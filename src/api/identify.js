const SYSTEM_PROMPT = `You are a produce identification system for Keells supermarket in Sri Lanka. Identify the single produce item in the image. Respond with ONLY a JSON object in this exact format:
{
  "category": "Banana",
  "confidence": 94,
  "has_varieties": true
}
category: the food category name (e.g. Banana, Tomato, Carrot)
confidence: integer 0-100
has_varieties: true if this item has multiple varieties at Keells, false if it does not

Items WITH varieties at Keells (has_varieties: true):
Apple, Banana, Mango, Mandarin, Melon, Orange, Pear, Grape, Tomato, Capsicum, Bell Pepper, Carrot, Potato, Onion, Brinjal, Cabbage, Watermelon, Cucumber, Pumpkin

All other items have has_varieties: false.`

export async function identifyProduce(base64ImageData) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'your_key_here') {
    throw new Error('VITE_ANTHROPIC_API_KEY is not set in .env')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: base64ImageData },
            },
            { type: 'text', text: 'Identify this produce item.' },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `API error ${response.status}`)
  }

  const data = await response.json()
  const raw = data.content?.[0]?.text ?? ''

  // Strip markdown fences if present
  const cleaned = raw.replace(/```[a-z]*\n?/gi, '').trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not parse API response')

  return JSON.parse(jsonMatch[0])
}
