import { useState, useRef, useCallback, useEffect } from 'react'

// Extend Window to include webkit prefixed SpeechRecognition (Safari/iOS)
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface UseVoiceInputReturn {
  startListening: () => void
  stopListening: () => void
  transcript: string
  isListening: boolean
  isSupported: boolean
  error: string | null
  resetTranscript: () => void
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const SpeechRecognitionClass =
    window.SpeechRecognition || window.webkitSpeechRecognition

  const isSupported = !!SpeechRecognitionClass

  useEffect(() => {
    if (!isSupported) return

    const recognition = new SpeechRecognitionClass()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1]
      if (result.isFinal) {
        setTranscript(result[0].transcript.trim())
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false)
      switch (event.error) {
        case 'not-allowed':
          setError('Microphone permission denied. Please allow mic access and try again.')
          break
        case 'no-speech':
          setError('No speech detected. Please try again.')
          break
        case 'network':
          setError('Network error during speech recognition. Please check your connection.')
          break
        default:
          setError(`Speech recognition error: ${event.error}`)
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [isSupported, SpeechRecognitionClass])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.')
      return
    }
    setError(null)
    setTranscript('')
    setIsListening(true)
    recognitionRef.current?.start()
  }, [isSupported])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  return {
    startListening,
    stopListening,
    transcript,
    isListening,
    isSupported,
    error,
    resetTranscript,
  }
}
