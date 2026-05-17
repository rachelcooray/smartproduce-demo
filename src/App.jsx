import { useState, useCallback, useEffect, useRef } from 'react'
import Header from './components/Header'
import ReadyScreen from './screens/ReadyScreen'
import ScanningScreen from './screens/ScanningScreen'
import ResultScreen from './screens/ResultScreen'
import LabelScreen from './screens/LabelScreen'
import DebugLog from './components/DebugLog'
import { identifyProduce } from './api/identify'
import { loadSession } from './api/onnxInfer'

const SCREENS = { READY: 'ready', SCANNING: 'scanning', RESULT: 'result', LABEL: 'label' }
const STEPS   = [
  { key: SCREENS.READY,    label: 'Camera'  },
  { key: SCREENS.SCANNING, label: 'Scan'    },
  { key: SCREENS.RESULT,   label: 'Result'  },
  { key: SCREENS.LABEL,    label: 'Label'   },
]

export default function App() {
  const [screen,       setScreen]       = useState(SCREENS.READY)
  const [captured,     setCaptured]     = useState(null)
  const [result,       setResult]       = useState(null)
  const [produce,      setProduce]      = useState(null)
  const [modelUsed,    setModelUsed]    = useState(null)
  const [onnxReady,    setOnnxReady]    = useState(false)
  const [scanLog,      setScanLog]      = useState([])
  const onnxSession = useRef(null)

  useEffect(() => {
    // Force-unblock the UI after 12s even if model is still downloading
    const timeout = setTimeout(() => setOnnxReady(true), 12000)
    loadSession()
      .then(s  => { onnxSession.current = s; setOnnxReady(true) })
      .catch(e => { console.warn('ONNX session failed to load:', e); setOnnxReady(true) })
      .finally(() => clearTimeout(timeout))
  }, [])

  const handleCapture = useCallback(async ({ dataUrl, base64 }) => {
    setCaptured(dataUrl)
    setScreen(SCREENS.SCANNING)
    try {
      const { result: res, model } = await identifyProduce(base64, onnxSession.current)
      setResult(res)
      setModelUsed(model)
      setScanLog(prev => [{
        time: new Date().toLocaleTimeString(),
        model,
        top: res.topPredictions ?? [],
        category: res.category,
        confidence: res.confidence,
      }, ...prev].slice(0, 20))
    } catch (err) {
      setResult({ category: null, confidence: 0, has_varieties: false, error: err.message })
      setModelUsed(null)
    }
    setScreen(SCREENS.RESULT)
  }, [])

  const handleConfirm = useCallback((p) => {
    setProduce(p)
    setScreen(SCREENS.LABEL)
  }, [])

  const handleChangeVariety = useCallback(() => {
    setProduce(null)
    setScreen(SCREENS.RESULT)
  }, [])

  const handleRetry = useCallback(() => {
    setCaptured(null)
    setResult(null)
    setModelUsed(null)
    setScreen(SCREENS.READY)
  }, [])

  const handleNewItem = useCallback(() => {
    setCaptured(null)
    setResult(null)
    setProduce(null)
    setModelUsed(null)
    setScreen(SCREENS.READY)
  }, [])

  const currentIdx = STEPS.findIndex(s => s.key === screen)

  return (
    <div className="flex flex-col h-screen max-w-sm mx-auto bg-white shadow-xl overflow-hidden">
      <Header />

      {/* Step indicator */}
      <div className="flex bg-gray-50 border-b border-gray-100 flex-shrink-0">
        {STEPS.map((step, i) => {
          const isActive = step.key === screen
          const isDone   = i < currentIdx
          return (
            <div key={step.key} className="flex-1 flex items-center justify-center py-1.5 relative">
              <span className={`text-xs font-medium ${isActive ? 'text-keells-green' : isDone ? 'text-gray-400' : 'text-gray-300'}`}>
                {step.label}
              </span>
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-keells-green" />}
            </div>
          )
        })}
      </div>

      <DebugLog entries={scanLog} onClear={() => setScanLog([])} />

      {/* Screen area */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {screen === SCREENS.READY    && <ReadyScreen onCapture={handleCapture} onnxReady={onnxReady} />}
        {screen === SCREENS.SCANNING && <ScanningScreen capturedImage={captured} />}
        {screen === SCREENS.RESULT   && result && (
          <ResultScreen result={result} onConfirm={handleConfirm} onRetry={handleRetry} />
        )}
        {screen === SCREENS.LABEL    && produce && (
          <LabelScreen produce={produce} onNewItem={handleNewItem} onChangeVariety={result?.has_varieties ? handleChangeVariety : undefined} modelUsed={modelUsed} confidence={result?.confidence} />
        )}
      </div>
    </div>
  )
}
