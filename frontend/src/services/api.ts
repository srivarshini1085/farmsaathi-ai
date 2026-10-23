import type { CropAnalysisResult, FarmerSettings, Guide, SavedReport, WeatherSnapshot } from '../types'

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(typeof payload.detail === 'string' ? payload.detail : 'Request failed')
  }

  return response.json() as Promise<T>
}

export async function getHealth() {
  return apiRequest<{ status: string; service: string }>('/health')
}

export async function sendChat(message: string, crop?: string, location?: string, soilType?: string, growthStage?: string) {
  return apiRequest<{ answer: string; sources: string[]; demo_mode: boolean; provider: string; warnings: string[] }>('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, crop, location, soil_type: soilType, growth_stage: growthStage }),
  })
}

export async function analyzeCrop(crop: string, symptoms: string, location?: string, notes?: string) {
  return apiRequest<CropAnalysisResult>('/crop-analysis', {
    method: 'POST',
    body: JSON.stringify({ crop, symptoms, location, notes }),
  })
}

export async function fetchWeather(location: string) {
  return apiRequest<WeatherSnapshot>(`/weather?location=${encodeURIComponent(location)}`)
}

export async function fetchGuides(crop?: string, category?: string) {
  const params = new URLSearchParams()
  if (crop) params.set('crop', crop)
  if (category) params.set('category', category)
  const suffix = params.toString() ? `?${params.toString()}` : ''
  return apiRequest<{ items: Guide[] }>(`/guides${suffix}`)
}

export async function fetchReports() {
  return apiRequest<{ items: SavedReport[] }>('/reports')
}

export async function saveReport(payload: {
  crop: string
  location: string
  title: string
  summary: string
  findings: string[]
  analysis_source: string
  metadata: Record<string, unknown>
}) {
  return apiRequest<{ message: string; report: SavedReport }>('/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchSettings() {
  return apiRequest<FarmerSettings>('/settings')
}

export async function updateSettings(payload: FarmerSettings) {
  return apiRequest<FarmerSettings>('/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
