import { Mic, MicOff, PauseCircle, Volume2 } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { sendChat } from '../services/api'
import type { ChatMessage } from '../types'

const starterQuestions = [
  'How can I improve soil moisture before sowing?',
  'What should I inspect if rice leaves are yellowing?',
  'How do I prepare for possible pest pressure in humid weather?',
]

export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'I can help with crop health, irrigation timing, soil issues, and seasonal guidance. Share your crop, location, and current condition for a more specific answer.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [language, setLanguage] = useState<'en' | 'te'>('en')
  const [isListening, setIsListening] = useState(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  const recognitionRef = useRef<any>(null)

  const selectedLanguageLabel = useMemo(
    () => (language === 'te' ? 'Telugu' : 'English'),
    [language],
  )

  const handleSend = async (draft?: string) => {
    const message = (draft ?? input).trim()
    if (!message) return

    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', text: message }])
    setInput('')
    setError('')
    setIsLoading(true)

    try {
      const result = await sendChat(message, 'Rice', 'Hyderabad', 'Loamy soil', 'Vegetative stage')
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: `${result.answer}\n\nDemo mode: ${result.demo_mode ? 'Simulated local guidance is being shown' : 'Live provider response'}\nSources: ${result.sources.join(', ')}`,
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load the assistant answer right now.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSpeechPlayback = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech is not supported in this browser.')
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'te' ? 'te-IN' : 'en-US'
    speechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  const handleVoiceInput = () => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition

    if (!SpeechRecognitionCtor) {
      setError('Speech recognition is not available in this browser. Please use text input instead.')
      return
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = language === 'te' ? 'te-IN' : 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => {
      setError('Microphone access failed or the browser could not process the speech input.')
      setIsListening(false)
    }
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput((current) => (current ? `${current} ${transcript}` : transcript))
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  return (
    <div className="space-y-6">
      <section className="panel p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">AI assistant</p>
            <h3 className="text-2xl font-bold text-slate-900">Ask about irrigation, soil, and crop care</h3>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="language" className="text-sm font-medium text-slate-600">Language</label>
            <select
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as 'en' | 'te')}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
            >
              <option value="en">English</option>
              <option value="te">Telugu</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-slate-800">Conversation</p>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{selectedLanguageLabel}</span>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 shadow-sm'} `}>
                  <div className="whitespace-pre-line">{message.text}</div>
                  {message.role === 'assistant' && (
                    <div className="mt-2 flex items-center gap-2">
                      <button className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700" onClick={() => handleSpeechPlayback(message.text)}>
                        <Volume2 className="h-3.5 w-3.5" />
                        Listen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={4}
              placeholder="Ask a question about crops, pests, soil, irrigation, or nutrition..."
              className="min-h-24 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="btn-primary" onClick={() => handleSend()} disabled={isLoading}>
              {isLoading ? 'Thinking...' : 'Send question'}
            </button>
            <button className="btn-secondary" onClick={handleVoiceInput}>
              {isListening ? <><MicOff className="h-4 w-4" /> Stop listening</> : <><Mic className="h-4 w-4" /> Voice input</>}
            </button>
            <button className="btn-secondary" onClick={handleStopSpeech}>
              <PauseCircle className="h-4 w-4" /> Stop speech
            </button>
          </div>

          {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        </div>

        <div className="panel p-5">
          <p className="mb-4 font-semibold text-slate-900">Suggested prompts</p>
          <div className="space-y-2">
            {starterQuestions.map((question) => (
              <button
                key={question}
                className="w-full rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-left text-sm text-emerald-800 transition hover:bg-emerald-100"
                onClick={() => handleSend(question)}
              >
                {question}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            This assistant uses a demo provider by default. Real AWS Bedrock responses require secure credentials and a configured environment.
          </div>
        </div>
      </section>
    </div>
  )
}
