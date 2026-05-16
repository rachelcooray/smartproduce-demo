import { useRef, useEffect, useState, useCallback } from 'react'

const COUNTDOWN = 1

export default function ReadyScreen({ onCapture, onnxReady }) {
  const videoRef   = useRef(null)
  const streamRef  = useRef(null)
  const timerRef   = useRef(null)
  const [cameraError, setCameraError] = useState(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN)

  const capture = useCallback(() => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width  = video.videoWidth  || 640
    canvas.height = video.videoHeight || 480
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    onCapture({ dataUrl, base64: dataUrl.split(',')[1] })
  }, [onCapture])

  useEffect(() => {
    if (!cameraReady || !onnxReady) return
    setSecondsLeft(COUNTDOWN)
    let count = COUNTDOWN
    timerRef.current = setInterval(() => {
      count -= 1
      setSecondsLeft(count)
      if (count <= 0) {
        clearInterval(timerRef.current)
        capture()
      }
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [cameraReady, onnxReady, capture])

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => setCameraReady(true)
        }
      } catch (err) {
        setCameraError(err.message ?? 'Camera access denied')
      }
    }
    startCamera()
    return () => {
      clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const radius       = 54
  const circumference = 2 * Math.PI * radius
  const dashOffset   = circumference - (secondsLeft / COUNTDOWN) * circumference

  return (
    <div className="relative flex-1 bg-black overflow-hidden fade-in">
      {cameraError ? (
        <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
          <div className="text-5xl">📷</div>
          <p className="text-white font-semibold">Camera unavailable</p>
          <p className="text-gray-400 text-sm">{cameraError}</p>
          <p className="text-gray-500 text-xs">Allow camera access and reload</p>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline muted
            className="absolute inset-0 w-full h-full object-cover" />

          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-keells-green border-t-transparent rounded-full animate-spin" />
                <span className="text-white text-sm">Starting camera…</span>
              </div>
            </div>
          )}

          {cameraReady && (
            <>
              {/* Scanner corner brackets */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-64 h-64">
                  {[
                    'top-0 left-0 border-t-4 border-l-4 rounded-tl-xl',
                    'top-0 right-0 border-t-4 border-r-4 rounded-tr-xl',
                    'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl',
                    'bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl',
                  ].map((cls, i) => (
                    <div key={i} className={`absolute w-10 h-10 border-keells-green ${cls}`} />
                  ))}
                </div>
              </div>

              {/* Pulsing ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="camera-ring w-64 h-64 rounded-full border-2 border-keells-green/40" />
              </div>

              {/* Bottom overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pb-8 flex flex-col items-center gap-4">
                <p className="text-white text-sm font-medium tracking-wide">
                  {onnxReady ? 'Place produce under camera' : 'Loading model…'}
                </p>
                {/* Countdown ring */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="-rotate-90 absolute inset-0" width="64" height="64" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                    <circle cx="64" cy="64" r={radius} fill="none" stroke="#1d6f42" strokeWidth="8"
                      strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                      style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
                  </svg>
                  {onnxReady
                    ? <span className="text-white text-2xl font-bold relative z-10">{secondsLeft}</span>
                    : <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                  }
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
