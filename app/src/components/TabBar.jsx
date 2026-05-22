import { NavLink } from 'react-router-dom'
import './TabBar.css'

export default function TabBar() {
  return (
    <nav className="tab-bar">
      <NavLink to="/" end className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3C9 3 7 5 8 7C6 7 4 5.5 3 6.5C1.5 8 3 10 5 10C4 11 4 13 5 14C4 16 6 17 8 16C8 18 10 19 12 19C14 19 16 18 16 16C18 17 20 16 19 14C20 13 20 11 19 10C21 10 22.5 8 21 6.5C20 5.5 18 7 16 7C17 5 15 3 12 3Z"/>
          <line x1="12" y1="19" x2="12" y2="22" opacity="0.4"/>
        </svg>
        <span>首页</span>
      </NavLink>
      <NavLink to="/almanac" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="18" rx="2"/>
          <line x1="4" y1="7" x2="20" y2="7"/>
          <line x1="4" y1="3" x2="4" y2="5"/>
          <line x1="20" y1="3" x2="20" y2="5"/>
          <rect x="9" y="10" width="6" height="5" rx="1"/>
          <line x1="9" y1="12.5" x2="15" y2="12.5"/>
        </svg>
        <span>黄历</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3C9 3 8 6 10 7C11 7.5 12 6 12 6C12 6 13 7.5 14 7C16 6 15 3 15 3"/>
          <circle cx="12" cy="15" r="7"/>
          <circle cx="12" cy="15" r="2.5"/>
        </svg>
        <span>我的</span>
      </NavLink>
    </nav>
  )
}
