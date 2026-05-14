// Simulated responses for offline demo mode (no API key needed)
const DEMO_ROTATION = [
  { identified: true, category: 'banana',      confidence: 0.96, notes: '' },
  { identified: true, category: 'tomato',      confidence: 0.94, notes: '' },
  { identified: true, category: 'apple',       confidence: 0.97, notes: '' },
  { identified: true, category: 'mango',       confidence: 0.93, notes: '' },
  { identified: true, category: 'gotukola',    confidence: 0.91, notes: '' },
  { identified: true, category: 'carrot',      confidence: 0.95, notes: '' },
  { identified: true, category: 'brinjal',     confidence: 0.92, notes: '' },
  { identified: true, category: 'coconut',     confidence: 0.98, notes: '' },
  { identified: true, category: 'karapincha',  confidence: 0.89, notes: '' },
  { identified: true, category: 'onion',       confidence: 0.94, notes: '' },
]
let demoIndex = 0

const PROMPT = `You are a produce identification system for a supermarket scale.
Look at this image and identify what fruit or vegetable it shows.
Respond in JSON only, no other text:
{
  "identified": true,
  "category": "the produce category e.g. banana, apple, tomato",
  "confidence": 0.0,
  "notes": "any relevant observation e.g. appears to be in a bag"
}
If you cannot identify any produce, set identified to false and category to null.`

export async function identifyProduce(base64ImageData) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const demoMode = import.meta.env.VITE_DEMO_MODE === 'true' || !apiKey || apiKey === 'your_key_here'

  // Demo mode: simulate a 1.5s scan then return a rotating result
  if (demoMode) {
    await new Promise(r => setTimeout(r, 1500))
    const result = DEMO_ROTATION[demoIndex % DEMO_ROTATION.length]
    demoIndex++
    return result
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inline_data: { mime_type: 'image/jpeg', data: base64ImageData } },
              { text: PROMPT },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 256, temperature: 0.1 },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `API error ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')
    return JSON.parse(jsonMatch[0])
  } catch {
    throw new Error('Failed to parse AI response: ' + text)
  }
}
