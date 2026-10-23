import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AssistantPage } from './pages/AssistantPage'
import { CropHealthPage } from './pages/CropHealthPage'
import { DashboardPage } from './pages/DashboardPage'
import { GuidesPage } from './pages/GuidesPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { WeatherPage } from './pages/WeatherPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/scanner" element={<CropHealthPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
