export type Guide = {
  id: string
  title: string
  crop: string
  category: string
  summary: string
  content: string
}

export type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  text: string
}

export type WeatherSnapshot = {
  location: string
  source: string
  provider: string
  demo_mode: boolean
  current: {
    temperature_c: number
    humidity_pct: number
    precipitation_mm: number
    wind_kph: number
    condition: string
  }
  forecast: Array<{
    day: string
    temperature_c: number
    condition: string
    rain_chance_pct: number
  }>
  alerts: string[]
}

export type CropAnalysisResult = {
  selected_crop: string
  visible_symptoms: string[]
  possible_causes: string[]
  alternative_explanations: string[]
  confidence_summary: string
  recommended_next_steps: string[]
  preventive_practices: string[]
  contact_expert_when: string
  provider: string
  demo_mode: boolean
}

export type SavedReport = {
  id: string
  crop: string
  location: string
  title: string
  summary: string
  findings: string[]
  created_at: string
  analysis_source: string
  metadata: Record<string, unknown>
}

export type FarmerSettings = {
  language: string
  default_crop: string
  default_location: string
  voice_enabled: boolean
  tts_enabled: boolean
  notifications_enabled: boolean
  dark_mode: boolean
}
