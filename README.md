# SmartProduce Demo

A standalone produce recognition demo app built for the **Keells Supermarket** pitch.
Simulates the full self-service scale experience using the device camera and Claude AI for produce identification.

## What This App Does

1. **Camera capture** — Opens the device camera (rear-facing on mobile)
2. **AI identification** — Sends the captured frame to Claude Vision (`claude-sonnet-4-20250514`) which returns the produce category and confidence score
3. **Variety selection** — For produce with multiple varieties (banana, mango, apple, etc.) the shopper selects the specific variety
4. **Weight input** — A slider simulates placing produce on the scale (50–2000g); the price is calculated automatically
5. **Label preview** — Shows a simulated thermal label with PLU code, weight, price, and barcode — what would print at a real scale terminal

## How to Run Locally

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd smartproduce-demo

# 2. Install dependencies
npm install

# 3. Add your API key
cp .env.example .env
# Edit .env and paste your Anthropic API key

# 4. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.
For the camera to work on mobile, either use `localhost` or serve over HTTPS (`npm run dev -- --host` then open via your local IP on the same network).

## Getting an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Navigate to **API Keys** → **Create Key**
4. Copy the key and paste it as `VITE_ANTHROPIC_API_KEY` in your `.env` file

> **Note:** The API key is used directly from the browser in this demo. In a production deployment, route requests through a backend to keep the key secret.

## Building for Production

```bash
npm run build
# Output is in the dist/ folder — deploy to any static host (Netlify, Vercel, etc.)
```

## Production Architecture Note

This demo is intentionally simplified for pitch purposes:

| Demo | Production |
|------|-----------|
| Device camera via `getUserMedia` | Fixed USB camera mounted above the scale |
| Claude Vision API (`claude-sonnet-4-20250514`) | On-device YOLOv8 model trained on Sri Lankan produce |
| Slider weight input | Hardware load cell / scale serial interface |
| Simulated label preview | Thermal label printer via serial/USB |
| API key in browser env | Backend proxy with auth |

The trained YOLOv8 model eliminates the API cost and latency for production and works fully offline on the scale hardware.

## Supported Produce

Variety selection is available for: Banana, Mango, Tomato, Apple, Potato, Onion, Cabbage, Watermelon, Coconut, Jackfruit, Brinjal.

All other produce skips variety selection and goes straight to weight input.
