import { Camera, FileImage, RefreshCcw, Save, Trash2 } from 'lucide-react'
import { type ChangeEvent, useMemo, useState } from 'react'
import { analyzeCrop, saveReport } from '../services/api'

const crops = ['Rice', 'Cotton', 'Tomato', 'Chilli', 'Groundnut', 'Maize']

export function CropHealthPage() {
  const [selectedCrop, setSelectedCrop] = useState('Rice')
  const [symptoms, setSymptoms] = useState('Yellowing and curling leaves with uneven moisture distribution')
  const [notes, setNotes] = useState('Field looks uneven after recent irrigation and a humid week.')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  const fileSummary = useMemo(
    () => imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB • ${imageFile.type}` : 'No image selected',
    [imageFile],
  )

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be under 5MB.')
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError('')
  }

  const handleAnalyze = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await analyzeCrop(selectedCrop, symptoms, 'Hyderabad', notes)
      setAnalysis(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze the crop image.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!analysis) return
    try {
      await saveReport({
        crop: analysis.selected_crop,
        location: 'Hyderabad',
        title: `Crop health check for ${analysis.selected_crop}`,
        summary: analysis.confidence_summary,
        findings: analysis.possible_causes,
        analysis_source: analysis.provider,
        metadata: {
          symptoms: analysis.visible_symptoms,
          demo_mode: analysis.demo_mode,
        },
      })
      setSavedMessage('Report saved to local history.')
    } catch (err) {
      setSavedMessage(err instanceof Error ? err.message : 'Unable to save the report.')
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <Camera className="h-5 w-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-slate-900">Upload crop image</h3>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center transition hover:border-emerald-300 hover:bg-emerald-50">
            <FileImage className="mb-3 h-10 w-10 text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">Choose a crop photo</span>
            <span className="mt-1 text-xs text-slate-500">PNG, JPG, or WebP up to 5MB</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
          </label>

          <div className="mt-4 grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Crop</label>
              <select value={selectedCrop} onChange={(event) => setSelectedCrop(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500">
                {crops.map((crop) => <option key={crop} value={crop}>{crop}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Visible symptoms</label>
              <textarea value={symptoms} onChange={(event) => setSymptoms(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Optional notes</label>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <span>{fileSummary}</span>
            {previewUrl && (
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700" onClick={() => { if (previewUrl) URL.revokeObjectURL(previewUrl); setImageFile(null); setPreviewUrl(null) }}>
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <button className="btn-primary" onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze crop'}
            </button>
            <button className="btn-secondary" onClick={() => { setAnalysis(null); setSavedMessage(''); }}>
              <RefreshCcw className="h-4 w-4" /> Reset
            </button>
          </div>

          {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        </div>

        <div className="panel p-5">
          <h3 className="mb-4 text-xl font-bold text-slate-900">Image preview</h3>
          {previewUrl ? (
            <img src={previewUrl} alt="Selected crop preview" className="h-80 w-full rounded-2xl object-cover" />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">No image uploaded yet</div>
          )}

          {analysis && (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Analysis</span>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-emerald-700">{analysis.demo_mode ? 'Simulated' : 'Live'}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">{analysis.selected_crop}</h4>
                <p className="mt-2 text-sm text-slate-600">{analysis.confidence_summary}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 font-semibold text-slate-900">Possible causes</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {analysis.possible_causes.map((item: string) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 font-semibold text-slate-900">Recommended next steps</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {analysis.recommended_next_steps.map((item: string) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">When to contact an expert:</span> {analysis.contact_expert_when}
              </div>

              <button className="btn-primary w-full" onClick={handleSave}>
                <Save className="h-4 w-4" /> Save analysis report
              </button>
              {savedMessage && <p className="text-sm text-emerald-700">{savedMessage}</p>}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
