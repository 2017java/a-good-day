import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './SceneDetail.css'

const SCENE_DATA = {
  wedding: {
    title: '结婚择日',
    subtitle: '为您挑选最佳婚期',
    desc: '依据新人八字，结合黄道吉日，为您推荐最佳婚期',
    color: '#8B2500',
    bgColor: '#FDF6F3',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="#8B2500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="14.5" r="5.5"/>
        <circle cx="17.5" cy="14.5" r="5.5"/>
        <path d="M14 9.8c1.2 1.8 3.8 1.8 5 0" strokeWidth="1.2" opacity="0.7"/>
        <path d="M9 9.8c1.2 1.8 3.8 1.8 5 0" strokeWidth="1.2" opacity="0.7"/>
      </svg>
    ),
    fields: [
      { key: 'groomBirth', label: '新郎生辰', placeholder: '如：1995年8月15日 辰时', optional: true },
      { key: 'brideBirth', label: '新娘生辰', placeholder: '如：1997年3月22日 午时', optional: true },
      {
        key: 'weddingType',
        label: '婚礼类型',
        type: 'options',
        options: ['酒店婚礼', '户外婚礼', '旅行婚礼', '中式婚礼'],
        default: '酒店婚礼',
      },
    ],
  },
  business: {
    title: '开业择日',
    subtitle: '为您选择最佳开业日',
    desc: '结合法人八字与行业五行，择定开市吉日',
    color: '#9A7B2C',
    bgColor: '#FDF8EC',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="#9A7B2C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11h20"/>
        <path d="M5 11c0 0 0-6 9-6s9 6 9 6"/>
        <line x1="5" y1="11" x2="5" y2="22"/>
        <line x1="23" y1="11" x2="23" y2="22"/>
        <line x1="4" y1="22" x2="24" y2="22"/>
        <line x1="14" y1="15" x2="14" y2="22"/>
        <circle cx="11" cy="18.5" r="0.8" fill="#9A7B2C" stroke="none"/>
        <circle cx="17" cy="18.5" r="0.8" fill="#9A7B2C" stroke="none"/>
      </svg>
    ),
    fields: [
      { key: 'legalPersonBirth', label: '法人生辰', placeholder: '如：1988年6月10日 巳时', optional: true },
      {
        key: 'industryType',
        label: '行业类型',
        type: 'options',
        options: ['餐饮', '零售', '科技', '教育', '金融', '其他'],
        default: '餐饮',
      },
    ],
  },
  moving: {
    title: '搬家择日',
    subtitle: '为您挑选迁居吉日',
    desc: '结合新居方位与家主八字，择定搬家良辰',
    color: '#4D8C4B',
    bgColor: '#EDF5ED',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="#4D8C4B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 14L14 6l9 8"/>
        <path d="M7 12.5V22h14v-9.5"/>
        <rect x="11" y="16" width="6" height="6" rx="0.5"/>
        <path d="M14 11v-3.5"/>
        <path d="M11.5 10L14 7.5 16.5 10"/>
      </svg>
    ),
    fields: [
      {
        key: 'direction',
        label: '现住址方位',
        type: 'options',
        options: ['坐北朝南', '坐南朝北', '坐东朝西', '坐西朝东'],
        default: '坐北朝南',
      },
    ],
  },
  construction: {
    title: '动土择日',
    subtitle: '为您挑选开工吉日',
    desc: '结合地脉方位与主人八字，择定动土良辰',
    color: '#6B5B95',
    bgColor: '#F0EBF5',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="#6B5B95" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="10" y1="6" x2="18" y2="18"/>
        <path d="M16.5 5.5c2 0 4 1.5 4 3.5s-2 3.5-4 3.5c-1 0-1.5-.3-2-.8"/>
        <line x1="6" y1="22" x2="22" y2="22"/>
        <path d="M8 22c0-2 1-3 2.5-3.5"/>
        <path d="M20 22c0-2-1-3-2.5-3.5"/>
      </svg>
    ),
    fields: [
      {
        key: 'houseOrientation',
        label: '房屋朝向',
        type: 'options',
        options: ['坐北朝南', '坐南朝北', '坐东朝西', '坐西朝东', '坐东南朝西北', '坐西北朝东南'],
        default: '坐北朝南',
      },
    ],
  },
  travel: {
    title: '出行择日',
    subtitle: '为您挑选出行吉日',
    desc: '结合出行方向与个人八字，择定远行良辰',
    color: '#2D7D9A',
    bgColor: '#E8F4F8',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="#2D7D9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="9"/>
        <circle cx="14" cy="14" r="2.5"/>
        <line x1="14" y1="5" x2="14" y2="8"/>
        <line x1="14" y1="20" x2="14" y2="23"/>
        <line x1="5" y1="14" x2="8" y2="14"/>
        <line x1="20" y1="14" x2="23" y2="14"/>
        <path d="M12.5 12l-3.5-5" strokeWidth="1.5"/>
        <path d="M15.5 16l3.5 5" strokeWidth="1.5"/>
      </svg>
    ),
    fields: [
      {
        key: 'destination',
        label: '目地方向',
        type: 'options',
        options: ['东方', '西方', '南方', '北方', '东南方', '西北方', '东北方', '西南方'],
        default: '东方',
      },
    ],
  },
  contract: {
    title: '签约择日',
    subtitle: '为您挑选签约吉日',
    desc: '结合合作方位与签约人八字，择定签约良辰',
    color: '#8B7355',
    bgColor: '#F8F4EC',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="#8B7355" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="19" rx="2"/>
        <line x1="9" y1="9" x2="15" y2="9"/>
        <line x1="9" y1="13" x2="13" y2="13"/>
        <path d="M17 15l3.5-3.5c.8-.8.8-2 0-2.8l-.7-.7c-.8-.8-2-.8-2.8 0L13.5 11.5"/>
        <path d="M10 22l-2 3 3-1z" fill="#8B7355" stroke="none"/>
      </svg>
    ),
    fields: [],
  },
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export default function SceneDetail() {
  const { type } = useParams()
  const navigate = useNavigate()
  const scene = SCENE_DATA[type] || SCENE_DATA.wedding

  const [selectedMonths, setSelectedMonths] = useState([5, 6])
  const [formData, setFormData] = useState(() => {
    const init = {}
    scene.fields.forEach(f => {
      init[f.key] = f.default || ''
    })
    return init
  })

  const toggleMonth = (month) => {
    setSelectedMonths(prev =>
      prev.includes(month)
        ? prev.filter(m => m !== month)
        : [...prev, month].sort((a, b) => a - b)
    )
  }

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    navigate(`/result/${type}`, {
      state: { months: selectedMonths, formData, sceneTitle: scene.title },
    })
  }

  return (
    <div className="scene-detail page-enter">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <h1>{scene.title}</h1>
          <div className="subtitle">{scene.subtitle}</div>
        </div>
      </div>

      {/* Scene Hero */}
      <div className="scene-hero">
        <div className="scene-hero-icon" style={{ background: scene.bgColor }}>
          {scene.icon}
        </div>
        <div className="scene-hero-title">{scene.title}</div>
        <div className="scene-hero-desc">{scene.desc}</div>
      </div>

      {/* Month Selection */}
      <div className="form-group">
        <div className="form-label">期望月份范围</div>
        <div className="month-select-grid">
          {MONTHS.map(m => (
            <button
              key={m}
              className={`month-chip ${selectedMonths.includes(m) ? 'selected' : ''}`}
              onClick={() => toggleMonth(m)}
            >
              {m}月
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Fields */}
      {scene.fields.map(field => (
        <div className="form-group" key={field.key}>
          <div className="form-label">
            {field.label}
            {field.optional && <span className="optional">(选填，更精准)</span>}
          </div>
          {field.type === 'options' ? (
            <div className="month-select-grid">
              {field.options.map(opt => (
                <button
                  key={opt}
                  className={`month-chip ${formData[field.key] === opt ? 'selected' : ''}`}
                  onClick={() => handleFieldChange(field.key, opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input
              className="form-input"
              type="text"
              placeholder={field.placeholder}
              value={formData[field.key] || ''}
              onChange={e => handleFieldChange(field.key, e.target.value)}
            />
          )}
        </div>
      ))}

      {/* Submit */}
      <button className="submit-btn" onClick={handleSubmit}>
        开始择日
      </button>
    </div>
  )
}
