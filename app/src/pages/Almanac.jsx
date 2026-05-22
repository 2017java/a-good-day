import { useState, useMemo } from 'react'
import './Almanac.css'

// Mock lunar day names for display
const LUNAR_DAYS = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十',
]

const LUNAR_MONTHS = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月']

const WEEKDAYS = ['日','一','二','三','四','五','六']

// Mock data: which days are good/bad in May 2026
const MOCK_GOOD_DAYS = [1, 3, 7, 10, 15, 24, 27, 31]
const MOCK_BAD_DAYS = [5, 12, 19, 29]

// Mock detail data for each day
const MOCK_DETAILS = {
  1: {
    lunar: '四月初五', ganzhi: '庚寅日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['嫁娶','开市','出行','祈福'], ji: ['动土','安葬','破土'],
    wuxing: '松柏木', chongsha: '冲猴（甲申）煞北',
    jishen: ['天德','月德','天喜'], xiongshen: ['劫煞','天火'],
    jishi: ['子时(23-01)','丑时(01-03)','辰时(07-09)','巳时(09-11)'],
  },
  2: {
    lunar: '四月初六', ganzhi: '辛卯日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['祭祀','求嗣','解除'], ji: ['嫁娶','入宅','动土'],
    wuxing: '松柏木', chongsha: '冲鸡（乙酉）煞西',
    jishen: ['天恩','母仓'], xiongshen: ['天罡','大煞'],
    jishi: ['寅时(03-05)','午时(11-13)','未时(13-15)'],
  },
  3: {
    lunar: '四月初七', ganzhi: '壬辰日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['嫁娶','纳采','交易','立券'], ji: ['动土','破土','安葬'],
    wuxing: '长流水', chongsha: '冲狗（丙戌）煞南',
    jishen: ['天德合','月德合','时阴'], xiongshen: ['劫煞','五虚'],
    jishi: ['子时(23-01)','丑时(01-03)','辰时(07-09)','申时(15-17)'],
  },
  4: {
    lunar: '四月初八', ganzhi: '癸巳日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['祈福','求嗣','开光'], ji: ['嫁娶','出行','安葬'],
    wuxing: '长流水', chongsha: '冲猪（丁亥）煞东',
    jishen: ['天恩','王日'], xiongshen: ['月害','游祸'],
    jishi: ['寅时(03-05)','卯时(05-07)','未时(13-15)'],
  },
  5: {
    lunar: '四月初九', ganzhi: '甲午日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['祭祀','沐浴'], ji: ['嫁娶','入宅','动土','出行'],
    wuxing: '沙中金', chongsha: '冲鼠（戊子）煞北',
    jishen: [], xiongshen: ['天罡','死神','月煞'],
    jishi: ['丑时(01-03)','巳时(09-11)'],
  },
  6: {
    lunar: '四月初十', ganzhi: '乙未日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['开光','出行','交易'], ji: ['动土','破土','安葬'],
    wuxing: '沙中金', chongsha: '冲牛（己丑）煞西',
    jishen: ['天德','月德'], xiongshen: ['天罡','四耗'],
    jishi: ['子时(23-01)','卯时(05-07)','申时(15-17)','亥时(21-23)'],
  },
  7: {
    lunar: '四月十一', ganzhi: '丙申日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['嫁娶','纳采','出行','入宅'], ji: ['动土','安葬','破土'],
    wuxing: '山下火', chongsha: '冲虎（庚寅）煞南',
    jishen: ['天德合','月德合','天喜'], xiongshen: ['劫煞','天火'],
    jishi: ['子时(23-01)','丑时(01-03)','辰时(07-09)','巳时(09-11)'],
  },
  8: {
    lunar: '四月十二', ganzhi: '丁酉日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['祈福','求嗣','解除'], ji: ['嫁娶','出行','入宅'],
    wuxing: '山下火', chongsha: '冲兔（辛卯）煞东',
    jishen: ['天恩','母仓'], xiongshen: ['天罡','大煞'],
    jishi: ['寅时(03-05)','午时(11-13)','戌时(19-21)'],
  },
  10: {
    lunar: '四月十四', ganzhi: '己酉日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['嫁娶','祈福','开市','交易'], ji: ['动土','安葬','破土'],
    wuxing: '大驿土', chongsha: '冲鸡（癸酉）煞西',
    jishen: ['天喜','三合','天德'], xiongshen: ['劫煞','五虚'],
    jishi: ['子时(23-01)','丑时(01-03)','辰时(07-09)','巳时(09-11)'],
  },
  15: {
    lunar: '四月十九', ganzhi: '甲寅日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['嫁娶','纳采','出行','交易'], ji: ['动土','破土','安葬'],
    wuxing: '大溪水', chongsha: '冲猴（戊申）煞北',
    jishen: ['天德','月德','天恩'], xiongshen: ['劫煞','天火'],
    jishi: ['子时(23-01)','丑时(01-03)','辰时(07-09)','未时(13-15)'],
  },
  21: {
    lunar: '四月廿五', ganzhi: '庚申日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['嫁娶','开市','出行','祈福'], ji: ['动土','安葬','破土'],
    wuxing: '石榴木', chongsha: '冲虎（甲寅）煞南',
    jishen: ['天德','月德','天喜'], xiongshen: ['劫煞','天火'],
    jishi: ['子时(23-01)','丑时(01-03)','辰时(07-09)','巳时(09-11)'],
  },
  24: {
    lunar: '四月廿八', ganzhi: '癸亥日', yearPillar: '丙午年', monthPillar: '癸巳月',
    yi: ['嫁娶','订盟','纳采','祈福'], ji: ['动土','安葬','破土'],
    wuxing: '大海水', chongsha: '冲蛇（丁巳）煞西',
    jishen: ['天德','福星','天恩'], xiongshen: ['劫煞','重日'],
    jishi: ['子时(23-01)','丑时(01-03)','辰时(07-09)','申时(15-17)'],
  },
  27: {
    lunar: '五月初一', ganzhi: '丙寅日', yearPillar: '丙午年', monthPillar: '甲午月',
    yi: ['嫁娶','开市','入宅','出行'], ji: ['动土','安葬','破土'],
    wuxing: '炉中火', chongsha: '冲猴（庚申）煞北',
    jishen: ['天德','月德','天喜'], xiongshen: ['劫煞','天火'],
    jishi: ['子时(23-01)','丑时(01-03)','辰时(07-09)','巳时(09-11)'],
  },
  31: {
    lunar: '五月初五', ganzhi: '庚午日', yearPillar: '丙午年', monthPillar: '甲午月',
    yi: ['嫁娶','出行','解除','祈福'], ji: ['动土','安葬','破土'],
    wuxing: '路旁土', chongsha: '冲鼠（甲子）煞北',
    jishen: ['天德','月德'], xiongshen: ['劫煞','天火'],
    jishi: ['子时(23-01)','丑时(01-03)','辰时(07-09)','申时(15-17)'],
  },
}

// Fill in basic detail for days without specific mock data
function getDetailForDay(day) {
  if (MOCK_DETAILS[day]) return MOCK_DETAILS[day]
  const lunarIdx = day - 1
  const isGood = MOCK_GOOD_DAYS.includes(day)
  const isBad = MOCK_BAD_DAYS.includes(day)
  return {
    lunar: LUNAR_DAYS[lunarIdx] || '初一',
    ganzhi: '甲子日',
    yearPillar: '丙午年',
    monthPillar: '癸巳月',
    yi: isGood ? ['嫁娶','祈福','出行'] : ['祭祀','解除'],
    ji: isBad ? ['嫁娶','入宅','动土','出行'] : ['动土','安葬'],
    wuxing: '海中金',
    chongsha: '冲猴（甲申）煞北',
    jishen: isGood ? ['天德','月德'] : ['天恩'],
    xiongshen: isBad ? ['劫煞','天火','月煞'] : ['劫煞'],
    jishi: ['子时(23-01)','辰时(07-09)','巳时(09-11)'],
  }
}

// Compute days-in-month and first-day-of-week for a given year/month
function getMonthInfo(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()
  return { firstDay, daysInMonth, daysInPrevMonth }
}

export default function Almanac() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  const { firstDay, daysInMonth, daysInPrevMonth } = useMemo(
    () => getMonthInfo(year, month),
    [year, month]
  )

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1

  // Build calendar grid cells
  const cells = useMemo(() => {
    const result = []
    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({
        day: daysInPrevMonth - i,
        lunar: LUNAR_DAYS[daysInPrevMonth - i - 1] || '',
        isCurrentMonth: false,
      })
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({
        day: d,
        lunar: LUNAR_DAYS[d - 1] || '',
        isCurrentMonth: true,
        isGood: MOCK_GOOD_DAYS.includes(d),
        isBad: MOCK_BAD_DAYS.includes(d),
        isToday: isCurrentMonth && d === today.getDate(),
      })
    }
    // Next month leading days
    const remaining = 42 - result.length
    for (let i = 1; i <= remaining; i++) {
      result.push({
        day: i,
        lunar: LUNAR_DAYS[i - 1] || '',
        isCurrentMonth: false,
      })
    }
    return result
  }, [firstDay, daysInMonth, daysInPrevMonth, isCurrentMonth, today.getDate()])

  const detail = getDetailForDay(selectedDay)

  function prevMonth() {
    if (month === 1) {
      setMonth(12)
      setYear(y => y - 1)
    } else {
      setMonth(m => m - 1)
    }
    setSelectedDay(1)
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1)
      setYear(y => y + 1)
    } else {
      setMonth(m => m + 1)
    }
    setSelectedDay(1)
  }

  const lunarMonth = LUNAR_MONTHS[month - 1] || ''

  return (
    <div className="almanac-page page-enter">
      {/* Month Header */}
      <div className="almanac-month-header">
        <div>
          <div className="almanac-month-title">{year}年{month}月</div>
          <div className="almanac-month-sub">农历{year % 10 === 5 ? '丙' : '乙'}午年 · {lunarMonth}</div>
        </div>
        <div className="almanac-nav">
          <button className="almanac-nav-btn" onClick={prevMonth} aria-label="上一月">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="almanac-nav-btn" onClick={nextMonth} aria-label="下一月">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="almanac-calendar">
        <div className="almanac-weekdays">
          {WEEKDAYS.map(w => (
            <span key={w} className="almanac-weekday">{w}</span>
          ))}
        </div>
        <div className="almanac-days">
          {cells.map((cell, idx) => {
            const classes = ['almanac-day']
            if (!cell.isCurrentMonth) classes.push('other-month')
            if (cell.isGood) classes.push('good')
            if (cell.isBad) classes.push('bad')
            if (cell.isToday) classes.push('today')
            if (cell.isCurrentMonth && cell.day === selectedDay && !cell.isToday) classes.push('selected')

            return (
              <button
                key={idx}
                className={classes.join(' ')}
                onClick={() => cell.isCurrentMonth && setSelectedDay(cell.day)}
                disabled={!cell.isCurrentMonth}
              >
                <span className="almanac-day-num">{cell.day}</span>
                <span className="almanac-day-lunar">{cell.lunar}</span>
              </button>
            )
          })}
        </div>
        {/* Legend */}
        <div className="almanac-legend">
          <span className="almanac-legend-item">
            <span className="legend-box legend-good" /> 吉日
          </span>
          <span className="almanac-legend-item">
            <span className="legend-box legend-bad" /> 凶日
          </span>
          <span className="almanac-legend-item">
            <span className="legend-box legend-today" /> 今日
          </span>
        </div>
      </div>

      {/* Day Detail */}
      <div className="almanac-detail">
        <div className="almanac-detail-header">
          <div className="almanac-detail-date">{selectedDay}</div>
          <div className="almanac-detail-lunar">农历{detail.lunar} · {detail.ganzhi}</div>
          <div className="almanac-detail-ganzhi">
            <span className="ganzhi-pill">{detail.yearPillar}</span>
            <span className="ganzhi-pill">{detail.monthPillar}</span>
            <span className="ganzhi-pill">{detail.ganzhi}</span>
          </div>
        </div>
        <div className="almanac-detail-body">
          {/* 宜 */}
          <div className="almanac-row">
            <div className="almanac-row-label">宜</div>
            <div className="almanac-row-value">
              {detail.yi.map(tag => (
                <span key={tag} className="yi-tag">{tag}</span>
              ))}
            </div>
          </div>
          {/* 忌 */}
          <div className="almanac-row">
            <div className="almanac-row-label">忌</div>
            <div className="almanac-row-value">
              {detail.ji.map(tag => (
                <span key={tag} className="ji-tag">{tag}</span>
              ))}
            </div>
          </div>
          {/* 五行 */}
          <div className="almanac-row">
            <div className="almanac-row-label">五行</div>
            <div className="almanac-row-value">
              <span className="wuxing-value">{detail.wuxing}</span>
            </div>
          </div>
          {/* 冲煞 */}
          <div className="almanac-row">
            <div className="almanac-row-label">冲煞</div>
            <div className="almanac-row-value">
              <span>{detail.chongsha}</span>
            </div>
          </div>
          {/* 吉神 */}
          <div className="almanac-row">
            <div className="almanac-row-label">吉神</div>
            <div className="almanac-row-value">
              {detail.jishen.length > 0 ? detail.jishen.map(tag => (
                <span key={tag} className="jishen-tag">{tag}</span>
              )) : <span className="almanac-empty">无</span>}
            </div>
          </div>
          {/* 凶神 */}
          <div className="almanac-row">
            <div className="almanac-row-label">凶神</div>
            <div className="almanac-row-value">
              {detail.xiongshen.length > 0 ? detail.xiongshen.map(tag => (
                <span key={tag} className="xiongshen-text">{tag}</span>
              )) : <span className="almanac-empty">无</span>}
            </div>
          </div>
          {/* 吉时 */}
          <div className="almanac-row">
            <div className="almanac-row-label">吉时</div>
            <div className="almanac-row-value jishi-wrap">
              {detail.jishi.map(t => (
                <span key={t} className="jishi-time">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing for tab bar */}
      <div className="almanac-bottom-spacer" />
    </div>
  )
}
