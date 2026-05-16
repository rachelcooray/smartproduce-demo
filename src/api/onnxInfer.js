import * as ort from 'onnxruntime-web'

// Point WASM binaries at the ort dist folder served from node_modules
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.26.0/dist/'
ort.env.wasm.numThreads = 1

export const ONNX_CLASSES = ['apple', 'banana', 'chilli', 'grapes', 'lemon', 'tomato']
const CLASSES = ONNX_CLASSES
const CONFIDENCE_THRESHOLD = 0.6

const CLASS_META = {
  apple:  { category: 'Apple',  has_varieties: true  },
  banana: { category: 'Banana', has_varieties: true  },
  chilli: { category: 'Chilli', has_varieties: false },
  grapes: { category: 'Grape',  has_varieties: true  },
  lemon:  { category: 'Lemon',  has_varieties: false },
  tomato: { category: 'Tomato', has_varieties: true  },
}

const MEAN = [0.485, 0.456, 0.406]
const STD  = [0.229, 0.224, 0.225]

export async function loadSession() {
  return ort.InferenceSession.create('/smartproduce_model_single.onnx')
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
    tensor[i]         = (data[i * 4]     / 255 - MEAN[0]) / STD[0]  // R
    tensor[N + i]     = (data[i * 4 + 1] / 255 - MEAN[1]) / STD[1]  // G
    tensor[2 * N + i] = (data[i * 4 + 2] / 255 - MEAN[2]) / STD[2]  // B
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
  return {
    ...meta,
    confidence:        Math.round(maxProb * 100),
    is_produce:        true,
    multiple_items:    false,
    aboveThreshold:    maxProb >= CONFIDENCE_THRESHOLD,
  }
}
