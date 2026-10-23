import { useEffect, useState } from 'react'
import { fetchSettings, updateSettings } from '../services/api'
import type { FarmerSettings } from '../types'

const initialState: FarmerSettings = {
  language: 'en',
  default_crop: 'Rice',
  default_location: 'Hyderabad',
  voice_enabled: true,
  tts_enabled: true,
  notifications_enabled: true,
  dark_mode: false,
}

export function SettingsPage() {
  const [settings, setSettings] = useState<FarmerSettings>(initialState)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetchSettings()
        setSettings(response)
      } catch {
        setStatus('Using fallback local settings.')
      }
    }
    void loadSettings()
  }, [])

  const saveSettings = async () => {
    try {
      const updated = await updateSettings(settings)
      setSettings(updated)
      setStatus('Settings saved locally and ready for future sessions.')
    } catch {
      setStatus('Unable to save settings in this environment.')
    }
  }

  return (
    <div className="space-y-6">
      <section className="panel p-5">
        <h3 className="text-2xl font-bold text-slate-900">Settings</h3>
        <p className="mt-2 text-sm text-slate-600">Adjust your default crop, location, accessibility preferences, and local app behaviour.</p>
      </section>

      <section className="panel p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Interface language</label>
            <select value={settings.language} onChange={(event) => setSettings({ ...settings, language: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500">
              <option value="en">English</option>
              <option value="te">Telugu</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Default crop</label>
            <input value={settings.default_crop} onChange={(event) => setSettings({ ...settings, default_crop: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Default location</label>
            <input value={settings.default_location} onChange={(event) => setSettings({ ...settings, default_location: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500" />
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full" onClick={saveSettings}>Save settings</button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span>Voice input</span>
            <input type="checkbox" checked={settings.voice_enabled} onChange={(event) => setSettings({ ...settings, voice_enabled: event.target.checked })} />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span>Text-to-speech</span>
            <input type="checkbox" checked={settings.tts_enabled} onChange={(event) => setSettings({ ...settings, tts_enabled: event.target.checked })} />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span>Notifications</span>
            <input type="checkbox" checked={settings.notifications_enabled} onChange={(event) => setSettings({ ...settings, notifications_enabled: event.target.checked })} />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span>Dark mode</span>
            <input type="checkbox" checked={settings.dark_mode} onChange={(event) => setSettings({ ...settings, dark_mode: event.target.checked })} />
          </label>
        </div>

        {status && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{status}</div>}
      </section>
    </div>
  )
}
