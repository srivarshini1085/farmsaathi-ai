import { AlertTriangle, CloudSun, MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import { fetchWeather } from '../services/api'
import type { WeatherSnapshot } from '../types'

export function WeatherPage() {
  const [location, setLocation] = useState('Hyderabad')
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadWeather = async (value = location) => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchWeather(value)
      setWeather(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch weather data.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="panel p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Weather intelligence</p>
            <h3 className="text-2xl font-bold text-slate-900">Farming weather and alerts</h3>
          </div>
          <div className="flex items-center gap-3">
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Search city or village"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
            />
            <button className="btn-primary" onClick={() => loadWeather()} disabled={loading}>
              <Search className="h-4 w-4" />
              {loading ? 'Loading...' : 'Check weather'}
            </button>
          </div>
        </div>
      </section>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {weather && (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <h3 className="text-xl font-bold text-slate-900">{weather.location}</h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{weather.demo_mode ? 'Demo data' : 'Live data'}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-lime-500 p-5 text-white">
                <div className="flex items-center gap-2 text-emerald-50">
                  <CloudSun className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-[0.2em]">Current</span>
                </div>
                <div className="mt-4 text-4xl font-bold">{weather.current.temperature_c}°C</div>
                <p className="mt-2 text-sm text-emerald-50">Humidity {weather.current.humidity_pct}% · {weather.current.condition}</p>
              </div>
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex justify-between"><span>Rainfall</span><strong className="text-slate-900">{weather.current.precipitation_mm} mm</strong></div>
                <div className="flex justify-between"><span>Wind</span><strong className="text-slate-900">{weather.current.wind_kph} km/h</strong></div>
                <div className="flex justify-between"><span>Source</span><strong className="text-slate-900">{weather.source}</strong></div>
                <div className="flex justify-between"><span>Provider</span><strong className="text-slate-900">{weather.provider}</strong></div>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 font-semibold text-slate-900">Forecast</p>
              <div className="space-y-3">
                {weather.forecast.map((item) => (
                  <div key={item.day} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-medium text-slate-800">{item.day}</span>
                    <span className="text-slate-600">{item.condition}</span>
                    <span className="font-semibold text-slate-900">{item.temperature_c}°C</span>
                    <span className="text-slate-500">{item.rain_chance_pct}% rain</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel p-5">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="text-xl font-bold text-slate-900">Alerts</h3>
            </div>
            <div className="space-y-3">
              {weather.alerts.map((alert) => (
                <div key={alert} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{alert}</div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
