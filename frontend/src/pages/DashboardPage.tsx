import { Activity, CloudRain, Leaf, ShieldCheck, Sprout, TrendingUp } from 'lucide-react'

const metrics = [
  { label: 'Crop health', value: '87%', detail: 'Healthy crop outlook', icon: Activity },
  { label: 'Irrigation', value: '4.2 hrs', detail: 'Last scheduled today', icon: CloudRain },
  { label: 'Soil status', value: 'Balanced', detail: 'Moisture in range', icon: Leaf },
  { label: 'Advisory', value: '3 alerts', detail: 'Action items this week', icon: ShieldCheck },
]

const tasks = [
  'Check rice plots for water stress near the field edge.',
  'Review nutrient balance before applying compost to his plots.',
  'Monitor afternoon humidity in the north block for fungal risk.',
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-500 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">Good morning, farmer</p>
            <h3 className="mt-2 text-3xl font-bold">Your field outlook is looking steady.</h3>
            <p className="mt-3 max-w-xl text-emerald-50">Use the assistant to review crop conditions, rainfall timing, and next steps for healthier, more resilient farming.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20">
            <Sprout className="h-4 w-4" />
            Quick crop check
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="panel p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">{label}</span>
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="mt-2 text-sm text-slate-500">{detail}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Field actions</h3>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-5">
          <h3 className="mb-3 text-xl font-bold text-slate-900">Season summary</h3>
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <p className="text-slate-500">Current crop</p>
              <p className="font-semibold text-slate-900">Rice · Kharif season</p>
            </div>
            <div>
              <p className="text-slate-500">Location</p>
              <p className="font-semibold text-slate-900">Hyderabad, Telangana</p>
            </div>
            <div>
              <p className="text-slate-500">Latest guidance</p>
              <p className="font-semibold text-slate-900">Monitor soil moisture before the next irrigation cycle.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
