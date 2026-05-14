import * as tf from '@tensorflow/tfjs'

const MODEL_URL = `${import.meta.env.BASE_URL}tfjs_model/model.json`
const LABELS_URL = `${import.meta.env.BASE_URL}tfjs_model/labels.json`

// Lower threshold — real camera vs studio shots has a big domain gap
const CONFIDENCE_THRESHOLD = 0.35

// Demo mode: cycles through realistic results, useful for pitching
// Set VITE_DEMO_MODE=true in .env to enable
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

const DEMO_ROTATION = [
  { category: 'banana',      confidence: 0.96 },
  { category: 'tomato',      confidence: 0.94 },
  { category: 'apple',       confidence: 0.97 },
  { category: 'mango',       confidence: 0.93 },
  { category: 'onion',       confidence: 0.91 },
  { category: 'watermelon',  confidence: 0.95 },
  { category: 'pineapple',   confidence: 0.92 },
  { category: 'avocado',     confidence: 0.88 },
  { category: 'potato',      confidence: 0.90 },
  { category: 'pepper',      confidence: 0.94 },
]
let demoIndex = 0

let model = null
let labels = null

async function loadModel() {
  if (model && labels) return
  ;[model, labels] = await Promise.all([
    tf.loadLayersModel(MODEL_URL),
    fetch(LABELS_URL).then(r => r.json()),
  ])
  const dummy = tf.zeros([1, 224, 224, 3])
  model.predict(dummy).dispose()
  dummy.dispose()
}

if (!DEMO_MODE) loadModel().catch(() => {})

export async function identifyProduce(base64ImageData) {
  if (DEMO_MODE) {
    await new Promise(r => setTimeout(r, 1200))
    const item = DEMO_ROTATION[demoIndex % DEMO_ROTATION.length]
    demoIndex++
    return { identified: true, ...item, notes: '' }
  }

  await loadModel()

  const imgData = atob(base64ImageData)
  const bytes = new Uint8Array(imgData.length)
  for (let i = 0; i < imgData.length; i++) bytes[i] = imgData.charCodeAt(i)
  const blob = new Blob([bytes], { type: 'image/jpeg' })
  const url = URL.createObjectURL(blob)

  const img = await new Promise((resolve, reject) => {
    const el = new Image()
    el.onload = () => resolve(el)
    el.onerror = reject
    el.src = url
  })
  URL.revokeObjectURL(url)

  const tensor = tf.tidy(() =>
    tf.browser.fromPixels(img).resizeBilinear([224, 224]).toFloat().div(255).expandDims(0)
  )

  const predictions = await model.predict(tensor).data()
  tensor.dispose()

  const maxIdx = predictions.indexOf(Math.max(...predictions))
  const confidence = predictions[maxIdx]

  if (confidence < CONFIDENCE_THRESHOLD) {
    return { identified: false, category: null, confidence, notes: '' }
  }

  return { identified: true, category: labels[maxIdx], confidence: parseFloat(confidence.toFixed(3)), notes: '' }
}
