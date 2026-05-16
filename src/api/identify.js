import { runOnnx } from './onnxInfer'

const USE_ANTHROPIC_FALLBACK = false

// Returns { result, model } where model is 'onnx' or 'claude'
export async function identifyProduce(base64ImageData, onnxSession) {
  // --- ONNX-only mode ---
  if (!USE_ANTHROPIC_FALLBACK) {
    if (!onnxSession) {
      return {
        result: { category: null, confidence: 0, has_varieties: false, not_in_model: true },
        model: 'onnx',
      }
    }
    const onnxResult = await runOnnx(onnxSession, base64ImageData)
    if (onnxResult) return { result: onnxResult, model: 'onnx' }
    return {
      result: { category: null, confidence: 0, has_varieties: false, not_in_model: true },
      model: 'onnx',
    }
  }

  // --- ONNX + Claude fallback mode ---
  if (onnxSession) {
    try {
      const onnxResult = await runOnnx(onnxSession, base64ImageData)
      if (onnxResult?.aboveThreshold) return { result: onnxResult, model: 'onnx' }
    } catch (err) {
      console.warn('ONNX inference failed, falling back to Claude:', err)
    }
  }

  const response = await fetch('/api/identify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageData: base64ImageData }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error ?? `API error ${response.status}`)
  }

  const data = await response.json()
  const raw  = data.content?.[0]?.text ?? ''

  const cleaned   = raw.replace(/```[a-z]*\n?/gi, '').trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not parse API response')

  return { result: JSON.parse(jsonMatch[0]), model: 'claude' }
}
