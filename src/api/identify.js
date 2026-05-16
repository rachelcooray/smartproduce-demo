import { runOnnx } from './onnxInfer'

export async function identifyProduce(base64ImageData, onnxSession) {
  // Try ONNX first — fast, on-device, no network call
  if (onnxSession) {
    try {
      const result = await runOnnx(onnxSession, base64ImageData)
      if (result) return result
      // null means low confidence → fall through to Claude
    } catch (err) {
      console.warn('ONNX inference failed, falling back to Claude:', err)
    }
  }

  // Fall back to Claude Vision API
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

  return JSON.parse(jsonMatch[0])
}
