import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TabBar from './components/TabBar'
import Home from './pages/Home'
import Almanac from './pages/Almanac'
import Profile from './pages/Profile'
import SceneDetail from './pages/SceneDetail'
import Result from './pages/Result'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.slice(0, -1)}>
      <div className="app" style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh', background: 'var(--bg)', position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/almanac" element={<Almanac />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/scene/:type" element={<SceneDetail />} />
          <Route path="/result/:type" element={<Result />} />
        </Routes>
        <TabBar />
      </div>
    </BrowserRouter>
  )
}
