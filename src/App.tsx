import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import MapPage from '@/pages/MapPage'
import InteractiveMapPage from '@/pages/InteractiveMapPage'
import LineupDetailsPage from '@/pages/LineupDetailsPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProfilePage from '@/pages/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="map/:mapId" element={<MapPage />} />
        <Route path="map/:mapId/:side" element={<InteractiveMapPage />} />
        <Route path="lineup/:lineupId" element={<LineupDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}
