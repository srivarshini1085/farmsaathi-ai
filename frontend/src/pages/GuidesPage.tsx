import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchGuides } from '../services/api'
import type { Guide } from '../types'

export function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [query, setQuery] = useState('')
  const [cropFilter, setCropFilter] = useState('')
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)

  useEffect(() => {
    const loadGuides = async () => {
      const response = await fetchGuides(cropFilter || undefined)
      setGuides(response.items)

      const hasSelectedGuide = response.items.some((guide) => guide.id === selectedGuide?.id)
      if ((!selectedGuide && response.items.length > 0) || (!hasSelectedGuide && response.items.length > 0)) {
        setSelectedGuide(response.items[0])
      }

      if (response.items.length === 0) {
        setSelectedGuide(null)
      }
    }
    void loadGuides()
  }, [cropFilter, selectedGuide])

  const filteredGuides = guides.filter((guide) => {
    const haystack = `${guide.title} ${guide.summary} ${guide.content}`.toLowerCase()
    return haystack.includes(query.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <section className="panel p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Guide library</p>
            <h3 className="text-2xl font-bold text-slate-900">Crop and farming knowledge</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guides" className="rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-emerald-500" />
            </div>
            <select value={cropFilter} onChange={(event) => setCropFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500">
              <option value="">All crops</option>
              <option value="Rice">Rice</option>
              <option value="Tomato">Tomato</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="panel p-4">
          {filteredGuides.length === 0 ? (
            <div className="text-sm text-slate-500">No guides match the current search.</div>
          ) : (
            <div className="space-y-3">
              {filteredGuides.map((guide) => (
                <button key={guide.id} onClick={() => setSelectedGuide(guide)} className={`w-full rounded-2xl border p-3 text-left transition ${selectedGuide?.id === guide.id ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-200'}`}>
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-600">{guide.crop}</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">{guide.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{guide.summary}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="panel p-5">
          {selectedGuide ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">{selectedGuide.category}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedGuide.title}</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{selectedGuide.crop}</span>
              </div>

              <p className="text-slate-600">{selectedGuide.summary}</p>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {selectedGuide.content}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500">Choose a guide to view the detailed guidance.</div>
          )}
        </div>
      </section>
    </div>
  )
}
