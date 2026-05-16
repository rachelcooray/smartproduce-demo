const SYSTEM_PROMPT = `You are a produce identification system for Keells supermarket in Sri Lanka. Identify the item in the image. Respond with ONLY a JSON object in this exact format:
{
  "category": "Banana",
  "confidence": 94,
  "has_varieties": true,
  "is_produce": true,
  "multiple_items": false
}

is_produce: true if the item is a fruit, vegetable, herb, or any grocery produce. false if it is clearly NOT a grocery item (e.g. a book, pen, phone, hand, car, person, clothing, etc.).
multiple_items: true if you can clearly see TWO OR MORE distinct different produce items in the image at the same time (e.g. a banana AND an apple together). false otherwise.
category: the produce name if identifiable (e.g. Banana, Tomato, Carrot, Curry Leaves, Jackfruit). Set to null if is_produce is false, multiple_items is true, or if you cannot identify the specific produce.
confidence: integer 0-100. Set to 0 if category is null.
has_varieties: true if this item has multiple varieties at Keells, false otherwise. Set to false if category is null.

Items WITH varieties at Keells (has_varieties: true):
Apple, Banana, Mango, Mandarin, Melon, Orange, Pear, Grape, Tomato, Capsicum, Bell Pepper, Carrot, Potato, Onion, Brinjal, Cabbage, Watermelon, Cucumber, Pumpkin

All other produce items have has_varieties: false.`

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
