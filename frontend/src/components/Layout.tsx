import { BarChart3, BookOpenText, Bot, CloudSun, FileText, Leaf, Menu, Settings, Sprout, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/', icon: BarChart3 },
  { label: 'AI Farming Assistant', to: '/assistant', icon: Bot },
  { label: 'Crop Health Scanner', to: '/scanner', icon: Leaf },
  { label: 'Weather & Alerts', to: '/weather', icon: CloudSun },
  { label: 'Farming Guide', to: '/guides', icon: BookOpenText },
  { label: 'Saved Reports', to: '/reports', icon: FileText },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f7f8ee,_#eef5ea_35%,#ecf3eb_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-4 lg:gap-6 lg:px-6">
        <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-72 border-r border-emerald-200 bg-white/90 p-5 shadow-lg backdrop-blur transition-transform lg:static lg:translate-x-0 lg:rounded-2xl`}> 
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-600 p-2 text-white shadow-sm">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">FarmSaathi</p>
                <h1 className="text-lg font-bold text-slate-900">AI</h1>
              </div>
            </div>
            <button className="rounded-lg p-2 hover:bg-emerald-50 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-emerald-100 text-emerald-800 shadow-sm' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Demo mode</p>
            <p className="mt-2 text-sm text-slate-600">Local AI and weather responses are clearly marked as demo data until real AWS services are configured.</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-emerald-200 p-2 hover:bg-emerald-50 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Your intelligent companion</p>
                <h2 className="text-xl font-bold text-slate-900">FarmSaathi AI</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Demo ready
            </div>
          </header>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
