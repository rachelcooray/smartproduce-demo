import * as ort from 'onnxruntime-web'

ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.26.0/dist/'
ort.env.wasm.numThreads = 1

// 37-class PackEat model — index order is alphabetical (ImageFolder default)
export const ONNX_CLASSES = [
  'apple', 'apricot', 'avocado', 'banana', 'beet', 'broccoli', 'cabbage',
  'carrot', 'cauliflower', 'chili', 'corn', 'cucumber', 'daikon', 'garlic',
  'grape', 'grapefruit', 'kiwi', 'lemon', 'lime', 'mango', 'melon', 'nectarine',
  'onion', 'orange', 'pear', 'pepper', 'plum', 'pomegranate', 'pomelo', 'potato',
  'pumpkin', 'radish', 'salad', 'tangerine', 'tomato', 'watermelon', 'zucchini',
]
const CLASSES = ONNX_CLASSES

const CONFIDENCE_THRESHOLD = 0.45

const CLASS_META = {
  apple:       { category: 'Apple',       has_varieties: true  },
  apricot:     { category: 'Apricot',     has_varieties: false },
  avocado:     { category: 'Avocado',     has_varieties: false },
  banana:      { category: 'Banana',      has_varieties: true  },
  beet:        { category: 'Beet',        has_varieties: false },
  broccoli:    { category: 'Broccoli',    has_varieties: false },
  cabbage:     { category: 'Cabbage',     has_varieties: true  },
  carrot:      { category: 'Carrot',      has_varieties: true  },
  cauliflower: { category: 'Cauliflower', has_varieties: false },
  chili:       { category: 'Chilli',      has_varieties: false },
  corn:        { category: 'Corn',        has_varieties: false },
  cucumber:    { category: 'Cucumber',    has_varieties: true  },
  daikon:      { category: 'Daikon',      has_varieties: false },
  garlic:      { category: 'Garlic',      has_varieties: false },
  grape:       { category: 'Grape',       has_varieties: true  },
  grapefruit:  { category: 'Grapefruit',  has_varieties: false },
  kiwi:        { category: 'Kiwi',        has_varieties: false },
  lemon:       { category: 'Lemon',       has_varieties: false },
  lime:        { category: 'Lime',        has_varieties: false },
  mango:       { category: 'Mango',       has_varieties: true  },
  melon:       { category: 'Melon',       has_varieties: true  },
  nectarine:   { category: 'Nectarine',   has_varieties: false },
  onion:       { category: 'Onion',       has_varieties: true  },
  orange:      { category: 'Orange',      has_varieties: true  },
  pear:        { category: 'Pear',        has_varieties: true  },
  pepper:      { category: 'Pepper',      has_varieties: true  },
  plum:        { category: 'Plum',        has_varieties: false },
  pomegranate: { category: 'Pomegranate', has_varieties: false },
  pomelo:      { category: 'Pomelo',      has_varieties: false },
  potato:      { category: 'Potato',      has_varieties: true  },
  pumpkin:     { category: 'Pumpkin',     has_varieties: true  },
  radish:      { category: 'Radish',      has_varieties: false },
  salad:       { category: 'Salad',       has_varieties: false },
  tangerine:   { category: 'Tangerine',   has_varieties: false },
  tomato:      { category: 'Tomato',      has_varieties: true  },
  watermelon:  { category: 'Watermelon',  has_varieties: true  },
  zucchini:    { category: 'Zucchini',    has_varieties: false },
}

const MEAN = [0.485, 0.456, 0.406]
const STD  = [0.229, 0.224, 0.225]

export async function loadSession() {
  return ort.InferenceSession.create('/smartproduce_packeat.onnx')
}

function softmax(logits) {
  const max  = Math.max(...logits)
  const exps = logits.map(x => Math.exp(x - max))
  const sum  = exps.reduce((a, b) => a + b, 0)
  return exps.map(x => x / sum)
}

async function preprocess(base64ImageData) {
  const img = new Image()
  await new Promise((resolve, reject) => {
    img.onload  = resolve
    img.onerror = reject
    img.src = `data:image/jpeg;base64,${base64ImageData}`
  })

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 224
  canvas.getContext('2d').drawImage(img, 0, 0, 224, 224)
  const { data } = canvas.getContext('2d').getImageData(0, 0, 224, 224)

  const N = 224 * 224
  const tensor = new Float32Array(3 * N)
  for (let i = 0; i < N; i++) {
    tensor[i]         = (data[i * 4]     / 255 - MEAN[0]) / STD[0]
    tensor[N + i]     = (data[i * 4 + 1] / 255 - MEAN[1]) / STD[1]
    tensor[2 * N + i] = (data[i * 4 + 2] / 255 - MEAN[2]) / STD[2]
  }
  return tensor
}

export async function runOnnx(session, base64ImageData) {
  const tensorData = await preprocess(base64ImageData)
  const tensor = new ort.Tensor('float32', tensorData, [1, 3, 224, 224])

  const outputs = await session.run({ image: tensor })
  const logits  = Array.from(outputs['logits'].data)
  const probs   = softmax(logits)
  const maxIdx  = probs.indexOf(Math.max(...probs))
  const maxProb = probs[maxIdx]

  const meta = CLASS_META[CLASSES[maxIdx]]

  // Top-5 predictions for debug logging
  const indexed = probs.map((p, i) => ({ label: CLASSES[i], pct: Math.round(p * 100) }))
  indexed.sort((a, b) => b.pct - a.pct)
  const topPredictions = indexed.slice(0, 5)

  return {
    ...meta,
    confidence:     Math.round(maxProb * 100),
    is_produce:     true,
    multiple_items: false,
    aboveThreshold: maxProb >= CONFIDENCE_THRESHOLD,
    topPredictions,
  }
}
