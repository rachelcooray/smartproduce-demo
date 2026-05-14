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
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set in .env')

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
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64ImageData,
              },
            },
            {
              type: 'text',
              text: PROMPT,
            },
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
  const text = data.content?.[0]?.text ?? ''

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')
    return JSON.parse(jsonMatch[0])
  } catch {
    throw new Error('Failed to parse AI response: ' + text)
  }
}
