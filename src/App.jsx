import { useState, useCallback } from 'react'
import Header from './components/Header'
import ReadyScreen from './screens/ReadyScreen'
import ScanningScreen from './screens/ScanningScreen'
import ResultScreen from './screens/ResultScreen'
import ManualPickScreen from './screens/ManualPickScreen'
import LabelScreen from './screens/LabelScreen'
import { identifyProduce } from './api/identify'

const SCREENS = { READY: 'ready', SCANNING: 'scanning', RESULT: 'result', MANUAL: 'manual', LABEL: 'label' }

const STEPS = [
  { key: SCREENS.READY,    label: 'Camera' },
  { key: SCREENS.SCANNING, label: 'Scan'   },
  { key: SCREENS.RESULT,   label: 'Result' },
  { key: SCREENS.MANUAL,   label: 'Result' }, // same visual step as RESULT
  { key: SCREENS.LABEL,    label: 'Label'  },
]
const STEP_KEYS = STEPS.map(s => s.key)

export default function App() {
  const [screen, setScreen]               = useState(SCREENS.READY)
  const [capturedImage, setCapturedImage] = useState(null)
  const [identifyResult, setIdentifyResult] = useState(null)
  const [confirmedProduce, setConfirmedProduce] = useState(null)

  const handleCapture = useCallback(async ({ dataUrl, base64 }) => {
    setCapturedImage(dataUrl)
    setScreen(SCREENS.SCANNING)
    try {
      const result = await identifyProduce(base64)
      setIdentifyResult(result)
    } catch (err) {
      setIdentifyResult({ identified: false, category: null, confidence: 0, notes: err.message })
    }
    setScreen(SCREENS.RESULT)
  }, [])

  // Called by ResultScreen — either immediately (variety tap) or after 1.5s auto (no variety)
  const handleConfirm = useCallback((produce) => {
    setConfirmedProduce(produce)
    setScreen(SCREENS.LABEL)
  }, [])

  const handleManualPick = useCallback(() => {
    setScreen(SCREENS.MANUAL)
  }, [])

  const handleRetry = useCallback(() => {
    setCapturedImage(null)
    setIdentifyResult(null)
    setScreen(SCREENS.READY)
  }, [])

  const handleNewItem = useCallback(() => {
    setCapturedImage(null)
    setIdentifyResult(null)
    setConfirmedProduce(null)
    setScreen(SCREENS.READY)
  }, [])

  const currentIdx = STEP_KEYS.indexOf(screen)

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto bg-white shadow-xl">
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

      {/* Screens — flex-1 so camera can go fullscreen within the card */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: 0 }}>
        {screen === SCREENS.READY && (
          <ReadyScreen onCapture={handleCapture} />
        )}
        {screen === SCREENS.SCANNING && (
          <ScanningScreen capturedImage={capturedImage} />
        )}
        {screen === SCREENS.RESULT && identifyResult && (
          <ResultScreen
            result={identifyResult}
            onConfirm={handleConfirm}
            onRetry={handleRetry}
            onManualPick={handleManualPick}
          />
        )}
        {screen === SCREENS.MANUAL && (
          <ManualPickScreen
            onSelect={handleConfirm}
            onRetry={handleRetry}
          />
        )}
        {screen === SCREENS.LABEL && confirmedProduce && (
          <LabelScreen produce={confirmedProduce} onNewItem={handleNewItem} />
        )}
      </div>
    </div>
  )
}
