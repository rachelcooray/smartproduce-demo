import * as tf from '@tensorflow/tfjs'

const MODEL_URL = `${import.meta.env.BASE_URL}tfjs_model/model.json`
const LABELS_URL = `${import.meta.env.BASE_URL}tfjs_model/labels.json`
const CONFIDENCE_THRESHOLD = 0.60

let model = null
let labels = null

async function loadModel() {
  if (model && labels) return
  ;[model, labels] = await Promise.all([
    tf.loadLayersModel(MODEL_URL),
    fetch(LABELS_URL).then(r => r.json()),
  ])
  // Warm up — avoids first-inference lag
  const dummy = tf.zeros([1, 224, 224, 3])
  model.predict(dummy).dispose()
  dummy.dispose()
}

// Start loading immediately when module is imported
loadModel().catch(() => {})

export async function identifyProduce(base64ImageData) {
  await loadModel()

  // Decode base64 JPEG → tensor [1, 224, 224, 3]
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

  const tensor = tf.tidy(() => {
    return tf.browser.fromPixels(img)
      .resizeBilinear([224, 224])
      .toFloat()
      .div(255)
      .expandDims(0)
  })

  const predictions = await model.predict(tensor).data()
  tensor.dispose()

  const maxIdx = predictions.indexOf(Math.max(...predictions))
  const confidence = predictions[maxIdx]

  if (confidence < CONFIDENCE_THRESHOLD) {
    return { identified: false, category: null, confidence, notes: '' }
  }

  return {
    identified: true,
    category: labels[maxIdx],
    confidence: parseFloat(confidence.toFixed(3)),
    notes: '',
  }
}
