import { useState, useCallback } from 'react'
import Header from './components/Header'
import ReadyScreen from './screens/ReadyScreen'
import ScanningScreen from './screens/ScanningScreen'
import ResultScreen from './screens/ResultScreen'
import WeightScreen from './screens/WeightScreen'
import LabelScreen from './screens/LabelScreen'
import { identifyProduce } from './api/identify'

const SCREENS = {
  READY: 'ready',
  SCANNING: 'scanning',
  RESULT: 'result',
  WEIGHT: 'weight',
  LABEL: 'label',
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.READY)
  const [capturedImage, setCapturedImage] = useState(null)
  const [identifyResult, setIdentifyResult] = useState(null)
  const [confirmedProduce, setConfirmedProduce] = useState(null)
  const [labelData, setLabelData] = useState(null)
  const [error, setError] = useState(null)

  const handleCapture = useCallback(async ({ dataUrl, base64 }) => {
    setCapturedImage(dataUrl)
    setScreen(SCREENS.SCANNING)
    setError(null)
    try {
      const result = await identifyProduce(base64)
      setIdentifyResult(result)
      setScreen(SCREENS.RESULT)
    } catch (err) {
      setError(err.message)
      setScreen(SCREENS.RESULT)
      setIdentifyResult({ identified: false, category: null, confidence: 0, notes: err.message })
    }
  }, [])

  const handleConfirm = useCallback((produce) => {
    setConfirmedProduce(produce)
    setScreen(SCREENS.WEIGHT)
  }, [])

  const handlePrint = useCallback((data) => {
    setLabelData(data)
    setScreen(SCREENS.LABEL)
  }, [])

  const handleRetry = useCallback(() => {
    setCapturedImage(null)
    setIdentifyResult(null)
    setError(null)
    setScreen(SCREENS.READY)
  }, [])

  const handleNewItem = useCallback(() => {
    setCapturedImage(null)
    setIdentifyResult(null)
    setConfirmedProduce(null)
    setLabelData(null)
    setError(null)
    setScreen(SCREENS.READY)
  }, [])

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto bg-white shadow-xl">
      <Header />

      {/* Step indicator */}
      <div className="flex bg-gray-50 border-b border-gray-100">
        {[
          { key: SCREENS.READY, label: 'Ready' },
          { key: SCREENS.SCANNING, label: 'Scan' },
          { key: SCREENS.RESULT, label: 'Result' },
          { key: SCREENS.WEIGHT, label: 'Weight' },
          { key: SCREENS.LABEL, label: 'Label' },
        ].map((step, i, arr) => {
          const steps = Object.values(SCREENS)
          const currentIdx = steps.indexOf(screen)
          const stepIdx = steps.indexOf(step.key)
          const isActive = step.key === screen
          const isDone = stepIdx < currentIdx
          return (
            <div key={step.key} className="flex-1 flex items-center justify-center py-1.5 relative">
              <span className={`text-xs font-medium
                ${isActive ? 'text-keells-green' : isDone ? 'text-gray-400' : 'text-gray-300'}`}>
                {step.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-keells-green rounded-full" />
              )}
            </div>
          )
        })}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: 0 }}>
        {screen === SCREENS.READY && (
          <ReadyScreen onCapture={handleCapture} />
        )}
        {screen === SCREENS.SCANNING && (
          <ScanningScreen capturedImage={capturedImage} />
        )}
        {screen === SCREENS.RESULT && identifyResult && (
          <ResultScreen
            capturedImage={capturedImage}
            result={identifyResult}
            onConfirm={handleConfirm}
            onRetry={handleRetry}
          />
        )}
        {screen === SCREENS.WEIGHT && confirmedProduce && (
          <WeightScreen produce={confirmedProduce} onPrint={handlePrint} />
        )}
        {screen === SCREENS.LABEL && labelData && (
          <LabelScreen labelData={labelData} onNewItem={handleNewItem} />
        )}
      </div>
    </div>
  )
}
