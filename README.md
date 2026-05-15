# SmartProduce AI — Demo App

A self-service produce identification demo for **Keells Supermarket** built for the SmartProduce AI pitch. Point the camera at any fruit or vegetable — the app identifies it, asks for the variety if needed, and prints a simulated price label. Zero taps required for most items.

## How it works

| Screen | What happens |
|--------|-------------|
| **Camera** | Live feed auto-captures after a 3-second countdown |
| **Scanning** | Frozen frame + sweep animation while Claude Vision identifies the produce |
| **Result** | Shows item name + confidence. If the item has varieties, a tap grid appears. Otherwise auto-advances in 1.5s |
| **Label** | Simulated thermal label with weight, price, PLU and barcode |

## Identification

Uses **Claude Vision** (`claude-sonnet-4-20250514`) to identify produce from the captured frame. The model returns category, confidence score, and whether the item has variety options at Keells.

### Swapping in the production model

In production, `src/api/identify.js` → `identifyProduce()` is replaced with a call to the on-device **EfficientNet / MobileNetV3** model trained on Keells produce. The function signature stays the same — it receives a base64 JPEG and returns `{ category, confidence, has_varieties }`. One function swap, nothing else changes.

## Run locally

```bash
git clone https://github.com/rachelcooray/smartproduce-demo.git
cd smartproduce-demo
npm install
cp .env.example .env
# Paste your Anthropic API key into .env
npm run dev
```

Open `http://localhost:5173`. For the camera on mobile: `npm run dev -- --host` then open your local IP on the same WiFi.

## API key

Get a free key at [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key.

Set it in `.env`:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

> The key is used directly from the browser in this demo. In production, proxy through a backend.

## Produce with variety selection

Apple, Banana, Mango, Mandarin, Melon, Orange, Pear, Grape, Tomato, Capsicum, Bell Pepper, Carrot, Potato, Onion, Brinjal, Cabbage, Watermelon, Cucumber, Pumpkin

All other items skip the variety screen and auto-advance to the label.
