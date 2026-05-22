import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

// ===== Mock calendar data (replace with src/utils/calendar.js when available) =====
const LUNAR_DAYS = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
]

const WEEKDAY_NAMES = ['日','一','二','三','四','五','六']

const SCENES = [
  { type: 'wedding',      name: '结婚', desc: '婚嫁择日', iconBg: '#FDF6F3', iconStroke: '#8B2500' },
  { type: 'business',     name: '开业', desc: '开市择日', iconBg: '#FDF8EC', iconStroke: '#9A7B2C' },
  { type: 'moving',       name: '搬家', desc: '迁居择日', iconBg: '#EDF5ED', iconStroke: '#4D8C4B' },
  { type: 'construction', name: '动土', desc: '开工择日', iconBg: '#F0EBF5', iconStroke: '#6B5B95' },
  { type: 'travel',       name: '出行', desc: '远行择日', iconBg: '#E8F4F8', iconStroke: '#2D7D9A' },
  { type: 'contract',     name: '签约', desc: '契约择日', iconBg: '#F8F4EC', iconStroke: '#8B7355' },
]

/**
 * Generate mock month data.
 * Returns an array of day objects for the calendar grid (including leading/trailing days).
 */
function getMonthData(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const today = new Date()
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()

  // Mock good/bad days (pseudo-random based on date)
  const isGood = (d) => [1,3,7,10,15,24,27,31].includes(d) && month === todayMonth
  const isBad = (d) => [5,12,19,29].includes(d) && month === todayMonth

  const days = []

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i
    days.push({ day: d, lunar: LUNAR_DAYS[(d - 1) % 30], currentMonth: false, isToday: false, isGood: false, isBad: false })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      lunar: LUNAR_DAYS[(d - 1) % 30],
      currentMonth: true,
      isToday: d === todayDate && month === todayMonth && year === todayYear,
      isGood: isGood(d),
      isBad: isBad(d),
    })
  }

  // Next month leading days
  const remaining = 42 - days.length // 6 rows
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, lunar: LUNAR_DAYS[(d - 1) % 30], currentMonth: false, isToday: false, isGood: false, isBad: false })
  }

  return days
}

// ===== Scene Icons (inline SVG) =====
function SceneIcon({ type }) {
  switch (type) {
    case 'marry':
      return (
        <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10.5" cy="14.5" r="5.5" />
          <circle cx="17.5" cy="14.5" r="5.5" />
          <path d="M14 9.8c1.2 1.8 3.8 1.8 5 0" strokeWidth="1.2" opacity="0.7" />
          <path d="M9 9.8c1.2 1.8 3.8 1.8 5 0" strokeWidth="1.2" opacity="0.7" />
        </svg>
      )
    case 'open':
      return (
        <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11h20" />
          <path d="M5 11c0 0 0-6 9-6s9 6 9 6" />
          <line x1="5" y1="11" x2="5" y2="22" />
          <line x1="23" y1="11" x2="23" y2="22" />
          <line x1="4" y1="22" x2="24" y2="22" />
          <line x1="14" y1="15" x2="14" y2="22" />
          <circle cx="11" cy="18.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="17" cy="18.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'move':
      return (
        <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 14L14 6l9 8" />
          <path d="M7 12.5V22h14v-9.5" />
          <rect x="11" y="16" width="6" height="6" rx="0.5" />
          <path d="M14 11v-3.5" />
          <path d="M11.5 10L14 7.5 16.5 10" />
        </svg>
      )
    case 'break':
      return (
        <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="10" y1="6" x2="18" y2="18" />
          <path d="M16.5 5.5c2 0 4 1.5 4 3.5s-2 3.5-4 3.5c-1 0-1.5-.3-2-.8" />
          <line x1="6" y1="22" x2="22" y2="22" />
          <path d="M8 22c0-2 1-3 2.5-3.5" />
          <path d="M20 22c0-2-1-3-2.5-3.5" />
        </svg>
      )
    case 'travel':
      return (
        <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="14" cy="14" r="9" />
          <circle cx="14" cy="14" r="2.5" />
          <line x1="14" y1="5" x2="14" y2="8" />
          <line x1="14" y1="20" x2="14" y2="23" />
          <line x1="5" y1="14" x2="8" y2="14" />
          <line x1="20" y1="14" x2="23" y2="14" />
          <path d="M12.5 12l-3.5-5" strokeWidth="1.5" />
          <path d="M15.5 16l3.5 5" strokeWidth="1.5" />
        </svg>
      )
    case 'sign':
      return (
        <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="3" width="14" height="19" rx="2" />
          <line x1="9" y1="9" x2="15" y2="9" />
          <line x1="9" y1="13" x2="13" y2="13" />
          <path d="M17 15l3.5-3.5c.8-.8.8-2 0-2.8l-.7-.7c-.8-.8-2-.8-2.8 0L13.5 11.5" />
          <path d="M10 22l-2 3 3-1z" fill="currentColor" stroke="none" />
        </svg>
      )
    default:
      return null
  }
}

// ===== Cloud SVG Decoration =====
function CloudDecoration() {
  return (
    <svg className="today-cloud" viewBox="0 0 120 60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60,50 C60,50 62,40 68,38 C64,38 62,34 64,30 C66,26 72,26 74,30 C76,24 84,24 86,30 C90,26 94,28 94,32 C98,30 100,34 98,38 C102,38 102,44 96,46 C92,48 86,48 80,46 C76,50 66,50 60,50Z" />
      <path d="M20,55 C20,55 22,47 26,45 C23,45 21,42 23,39 C25,36 30,36 32,39 C34,35 40,35 42,39 C45,37 47,40 46,43 C49,42 50,45 49,47 C52,47 52,51 48,52 C45,54 38,54 34,52 C31,55 24,55 20,55Z" />
      <path d="M90,52 C92,48 96,48 98,50" strokeWidth="0.8" />
      <path d="M14,53 C12,50 14,47 18,47" strokeWidth="0.8" />
    </svg>
  )
}

// ===== Divider SVG =====
function SectionDivider() {
  return (
    <div className="section-divider">
      <svg viewBox="0 0 200 12" fill="none">
        <path d="M100 1 C96 1,93 4,96 6 C93 6,90 3,86 3 C82 3,80 5,82 7 C79 7,77 5,74 5 L126 5 C123 5,121 7,118 7 C120 5,118 3,114 3 C110 3,107 6,104 6 C107 4,104 1,100 1Z" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <line x1="8" y1="6" x2="72" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        <line x1="128" y1="6" x2="192" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        {[12,20,28,36,44].map(x => (
          <rect key={`l${x}`} x={x} y="3" width="4" height="6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.12" />
        ))}
        {[152,160,168,176,184].map(x => (
          <rect key={`r${x}`} x={x} y="3" width="4" height="6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.12" />
        ))}
      </svg>
    </div>
  )
}

// ===== Home Component =====
export default function Home() {
  const now = new Date()
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())

  const calData = useMemo(() => getMonthData(calYear, calMonth), [calYear, calMonth])

  const weekdayNames = WEEKDAY_NAMES
  const monthTitle = `${calYear}年${calMonth + 1}月`

  const goToPrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11)
      setCalYear(y => y - 1)
    } else {
      setCalMonth(m => m - 1)
    }
  }

  const goToNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0)
      setCalYear(y => y + 1)
    } else {
      setCalMonth(m => m + 1)
    }
  }

  // Today's data for the almanac card
  const todayDate = now.getDate()
  const todayWeekday = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][now.getDay()]

  // Mock: today's yi/ji and ganzhi
  const yiItems = ['嫁娶','开市','出行']
  const jiItems = ['动土','安葬']
  const ganzhiPills = ['丙午年','癸巳月','庚寅日']

  return (
    <div className="home-page page-enter">
      {/* 1. Logo Area */}
      <div className="home-hero">
        <div className="home-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1.2" y="1.2" width="21.6" height="21.6" rx="2.4" strokeWidth="1.4" />
            <rect x="6.5" y="5" width="11" height="14" rx="1" strokeWidth="1.6" />
            <line x1="7.5" y1="12" x2="16.5" y2="12" strokeWidth="1.6" />
            <path d="M7.5,12 C9.5,10 11.5,10 12,12 C12.5,14 14.5,14 16.5,12" strokeWidth="0.8" />
            <circle cx="9.8" cy="10.8" r="0.6" fill="white" stroke="none" />
            <circle cx="14.2" cy="13.2" r="0.6" fill="white" stroke="none" />
          </svg>
        </div>
        <div className="home-title">好日子</div>
        <div className="home-subtitle">择良辰 · 选吉日</div>
      </div>

      {/* 2. Today Almanac Card */}
      <div className="today-card">
        <CloudDecoration />

        <div className="today-date-row">
          <span className="today-solar">{todayDate}</span>
          <span className="today-solar-sub">{now.getFullYear()}年{now.getMonth() + 1}月 · {todayWeekday}</span>
        </div>

        <div className="today-lunar">
          农历{LUNAR_DAYS[(todayDate - 1) % 30]} · {ganzhiPills.join(' ')}
        </div>

        <div className="today-ganzhi">
          {ganzhiPills.map((pill, i) => (
            <span key={i} className="ganzhi-pill">{pill}</span>
          ))}
        </div>

        <div className="today-yi-ji">
          <div style={{ flex: 1 }}>
            <div className="label">宜</div>
            <div className="tags">
              {yiItems.map((item, i) => (
                <span key={i} className="yi-tag">{item}</span>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="label">忌</div>
            <div className="tags">
              {jiItems.map((item, i) => (
                <span key={i} className="ji-tag">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Scene Grid */}
      <div className="section-title">择日场景</div>
      <div className="scene-grid">
        {SCENES.map((scene) => (
          <Link
            key={scene.type}
            to={`/scene/${scene.type}`}
            className="scene-card"
          >
            <div className="scene-icon" style={{ background: scene.iconBg, color: scene.iconStroke }}>
              <SceneIcon type={scene.type} />
            </div>
            <div className="scene-name">{scene.name}</div>
            <div className="scene-desc">{scene.desc}</div>
          </Link>
        ))}
      </div>

      <SectionDivider />

      {/* 4. Monthly Calendar */}
      <div className="section-title">本月吉日速览</div>
      <div className="quick-calendar">
        <div className="cal-header">
          <h3>{monthTitle}</h3>
          <div className="cal-nav">
            <button onClick={goToPrevMonth} aria-label="上一月">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={goToNextMonth} aria-label="下一月">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>

        <div className="cal-weekdays">
          {weekdayNames.map((name) => (
            <span key={name} className="cal-weekday">{name}</span>
          ))}
        </div>

        <div className="cal-days">
          {calData.map((d, i) => (
            <div
              key={i}
              className={[
                'cal-day',
                !d.currentMonth && 'other-month',
                d.isToday && 'today',
                d.isGood && 'good',
                d.isBad && 'bad',
              ].filter(Boolean).join(' ')}
            >
              <span>{d.day}</span>
              <span className="cal-day-lunar">{d.lunar}</span>
            </div>
          ))}
        </div>

        <div className="cal-legend">
          <div className="cal-legend-item">
            <span className="cal-legend-dot good"></span> 吉日
          </div>
          <div className="cal-legend-item">
            <span className="cal-legend-dot bad"></span> 凶日
          </div>
          <div className="cal-legend-item">
            <span className="cal-legend-dot today"></span> 今日
          </div>
        </div>
      </div>

      <div className="home-spacer" />
    </div>
  )
}
