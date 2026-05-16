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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { imageData } = req.body
  if (!imageData) return res.status(400).json({ error: 'imageData required' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageData } },
            { type: 'text', text: 'Identify this produce item.' },
          ],
        },
      ],
    }),
  })

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}))
    return res.status(upstream.status).json({ error: err?.error?.message ?? `API error ${upstream.status}` })
  }

  const data = await upstream.json()
  res.json(data)
}
