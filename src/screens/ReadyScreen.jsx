import { useRef, useEffect, useState } from 'react'

export default function ReadyScreen({ onCapture }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraError, setCameraError] = useState(null)
  const [cameraReady, setCameraReady] = useState(false)

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
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  function handleCapture() {
    if (!videoRef.current || !cameraReady) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    const base64 = dataUrl.split(',')[1]
    onCapture({ dataUrl, base64 })
  }

  return (
    <div className="flex flex-col h-full fade-in">
      {/* Camera viewport */}
      <div className="relative flex-1 bg-black overflow-hidden">
        {cameraError ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
            <div className="text-5xl">📷</div>
            <p className="text-white font-medium">Camera unavailable</p>
            <p className="text-gray-400 text-sm">{cameraError}</p>
            <p className="text-gray-500 text-xs">Allow camera access and reload the page</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Pulsing ring overlay */}
            {cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="camera-ring w-56 h-56 rounded-full border-4 border-keells-green opacity-80" />
              </div>
            )}
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-keells-green border-t-transparent rounded-full animate-spin" />
                  <span className="text-white text-sm">Starting camera…</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom panel */}
      <div className="bg-white px-4 pt-4 pb-6 flex flex-col items-center gap-4 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <p className="text-gray-500 text-sm font-medium">
          Place produce in front of camera
        </p>
        <button
          onClick={handleCapture}
          disabled={!cameraReady || !!cameraError}
          className="w-full max-w-xs bg-keells-green text-white font-semibold text-base rounded-2xl py-4
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 transition-transform shadow-md hover:bg-keells-light"
        >
          Identify Produce
        </button>
      </div>
    </div>
  )
}
