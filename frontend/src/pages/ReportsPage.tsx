import { FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchReports } from '../services/api'
import type { SavedReport } from '../types'

export function ReportsPage() {
  const [reports, setReports] = useState<SavedReport[]>([])

  useEffect(() => {
    const loadReports = async () => {
      const response = await fetchReports()
      setReports(response.items)
    }
    void loadReports()
  }, [])

  return (
    <div className="space-y-6">
      <section className="panel p-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          <h3 className="text-2xl font-bold text-slate-900">Saved reports and history</h3>
        </div>
      </section>

      {reports.length === 0 ? (
        <div className="panel p-6 text-sm text-slate-500">No crop health reports saved yet. Upload an image and save a report from the crop health scanner.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <article key={report.id} className="panel p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">{report.crop}</p>
                  <h4 className="text-xl font-bold text-slate-900">{report.title}</h4>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{report.analysis_source}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{report.summary}</p>
              <div className="mt-4 text-xs text-slate-500">{report.location} · {new Date(report.created_at).toLocaleString()}</div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {report.findings.map((finding) => <li key={finding}>• {finding}</li>)}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
