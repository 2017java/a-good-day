import './Profile.css'

export default function Profile() {
  return (
    <div className="profile-page page-enter">
      <div className="profile-header">
        <h1 className="profile-title">我的</h1>
      </div>

      <div className="profile-empty">
        <div className="profile-empty-icon">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 18c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z"/>
            <path d="M28 18c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z"/>
            <path d="M24 18c-4.4 0-8 2.7-8 6v2h16v-2c0-3.3-3.6-6-8-6z"/>
            <circle cx="24" cy="36" r="6"/>
            <path d="M18 36c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
          </svg>
        </div>
        <div className="profile-empty-title">历史记录</div>
        <div className="profile-empty-desc">您查询过的择日记录将显示在这里</div>
      </div>

      {/* Bottom spacer for tab bar */}
      <div className="profile-bottom-spacer" />
    </div>
  )
}
