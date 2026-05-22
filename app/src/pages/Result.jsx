import { useParams, useNavigate, useLocation } from 'react-router-dom'
import './Result.css'

const MOCK_RESULTS = {
  wedding: [
    {
      date: '5月7日',
      weekday: '星期四',
      lunar: '农历四月十一',
      ganzhi: '乙巳年 辛巳月 丙午日',
      score: 98,
      yi: ['宜嫁娶', '宜纳采'],
      ji: [],
      stars: ['天德合', '月德合'],
      pillars: { year: '乙巳', month: '辛巳', day: '丙午', hour: '—' },
      ai: '这一天天干丙火坐午火，火势旺盛，象征热情与光明。天德合、月德合双吉星入命，主婚姻和美、夫妻恩爱。巳午同属南方火局，气场相合，是难得的上等婚期。建议婚礼仪式安排在午时（11:00-13:00）最佳。',
    },
    {
      date: '5月10日',
      weekday: '星期日',
      lunar: '农历四月十四',
      ganzhi: '乙巳年 辛巳月 己酉日',
      score: 95,
      yi: ['宜嫁娶', '宜祈福'],
      ji: [],
      stars: ['天喜', '三合'],
      pillars: { year: '乙巳', month: '辛巳', day: '己酉', hour: '—' },
      ai: '己土坐酉金，土金相生，主婚姻稳固、感情长久。天喜星入命，喜庆之气充沛。巳酉三合金局，夫妻宫得力，婚后财运亨通。此日为周末，方便宾客出席，是实用性与吉日兼得的好选择。',
    },
    {
      date: '5月24日',
      weekday: '星期日',
      lunar: '农历四月廿八',
      ganzhi: '乙巳年 辛巳月 癸亥日',
      score: 92,
      yi: ['宜嫁娶', '宜订盟'],
      ji: [],
      stars: ['天德', '福星'],
      pillars: { year: '乙巳', month: '辛巳', day: '癸亥', hour: '—' },
      ai: '癸水坐亥水，水势充沛，象征智慧与包容。天德贵人入命，主逢凶化吉、贵人相助。亥水为桃花星之一，夫妻感情融洽、琴瑟和鸣。此日亦为周末，适合举办婚宴。',
    },
  ],
  business: [
    {
      date: '5月8日',
      weekday: '星期五',
      lunar: '农历四月十二',
      ganzhi: '乙巳年 辛巳月 戊申日',
      score: 96,
      yi: ['宜开市', '宜交易'],
      ji: [],
      stars: ['天德', '月德'],
      pillars: { year: '乙巳', month: '辛巳', day: '戊申', hour: '—' },
      ai: '戊土坐申金，土金相生，主财运亨通、生意兴隆。天德、月德双贵人护佑，开业大吉。申金为财星，与巳火相合，利商贸流通。建议上午辰时（7:00-9:00）举行开业仪式。',
    },
    {
      date: '5月12日',
      weekday: '星期二',
      lunar: '农历四月十六',
      ganzhi: '乙巳年 辛巳月 庚戌日',
      score: 93,
      yi: ['宜开市', '宜纳财'],
      ji: [],
      stars: ['天赦', '驿马'],
      pillars: { year: '乙巳', month: '辛巳', day: '庚戌', hour: '—' },
      ai: '庚金坐戌土，金土相生，主根基稳固、财运绵长。天赦日逢凶化吉，驿马星动，利于拓展业务。此日开业，事业发展平稳顺利，客源不断。',
    },
    {
      date: '5月20日',
      weekday: '星期三',
      lunar: '农历四月廿四',
      ganzhi: '乙巳年 辛巳月 戊午日',
      score: 90,
      yi: ['宜开市', '宜签约'],
      ji: [],
      stars: ['三合', '天喜'],
      pillars: { year: '乙巳', month: '辛巳', day: '戊午', hour: '—' },
      ai: '戊土坐午火，火生土旺，主根基扎实、事业红火。三合吉星入命，合作运佳，利于签约合作。天喜星临门，开业喜庆盈门。午时开业最为应景。',
    },
  ],
  moving: [
    {
      date: '5月5日',
      weekday: '星期二',
      lunar: '农历四月初九',
      ganzhi: '乙巳年 辛巳月 丙辰日',
      score: 97,
      yi: ['宜入宅', '宜移徙'],
      ji: [],
      stars: ['天德合', '驿马'],
      pillars: { year: '乙巳', month: '辛巳', day: '丙辰', hour: '—' },
      ai: '丙火坐辰土，火土相生，主家宅安宁、人丁兴旺。天德合贵人入命，搬家顺利无阻。驿马星动，利于迁居，新居风水气场与家主相合，入住后运势上升。',
    },
    {
      date: '5月9日',
      weekday: '星期六',
      lunar: '农历四月十三',
      ganzhi: '乙巳年 辛巳月 庚申日',
      score: 94,
      yi: ['宜入宅', '宜安床'],
      ji: [],
      stars: ['月德', '天医'],
      pillars: { year: '乙巳', month: '辛巳', day: '庚申', hour: '—' },
      ai: '庚金坐申金，金气旺盛，主家宅坚固、财运亨通。月德贵人护佑，搬家过程平安顺利。天医星入命，入住后家人身体健康。周末搬家，亲友帮忙更方便。',
    },
    {
      date: '5月18日',
      weekday: '星期一',
      lunar: '农历四月廿二',
      ganzhi: '乙巳年 辛巳月 丁卯日',
      score: 91,
      yi: ['宜入宅', '宜祈福'],
      ji: [],
      stars: ['天喜', '福星'],
      pillars: { year: '乙巳', month: '辛巳', day: '丁卯', hour: '—' },
      ai: '丁火坐卯木，木火通明，主家运昌盛、学业有成。天喜星入命，乔迁之喜。福星高照，新居入住后福气绵延。卯木为文昌星，利子女学业。',
    },
  ],
  construction: [
    {
      date: '5月6日',
      weekday: '星期三',
      lunar: '农历四月初十',
      ganzhi: '乙巳年 辛巳月 丁巳日',
      score: 96,
      yi: ['宜动土', '宜开工'],
      ji: [],
      stars: ['天德', '天赦'],
      pillars: { year: '乙巳', month: '辛巳', day: '丁巳', hour: '—' },
      ai: '丁火坐巳火，火势旺盛，主动工顺利、工程红火。天德贵人入命，工程平安无灾。天赦日逢凶化吉，即使遇到困难也能顺利化解。巳月巳日，火旺生土，地基稳固。',
    },
    {
      date: '5月15日',
      weekday: '星期五',
      lunar: '农历四月十九',
      ganzhi: '乙巳年 辛巳月 壬子日',
      score: 93,
      yi: ['宜动土', '宜修造'],
      ji: [],
      stars: ['月德', '天恩'],
      pillars: { year: '乙巳', month: '辛巳', day: '壬子', hour: '—' },
      ai: '壬水坐子水，水势充沛，主动工顺利、资金充足。月德贵人护佑，工程进展顺利。天恩日利于祈福，动土前祭拜土地神效果更佳。',
    },
    {
      date: '5月27日',
      weekday: '星期二',
      lunar: '农历五月初二',
      ganzhi: '乙巳年 辛巳月 甲戌日',
      score: 90,
      yi: ['宜动土', '宜竖柱'],
      ji: [],
      stars: ['三合', '天马'],
      pillars: { year: '乙巳', month: '辛巳', day: '甲戌', hour: '—' },
      ai: '甲木坐戌土，木土相合，主根基稳固、工程顺利。三合吉星入命，合作运佳，利于与施工方沟通协调。天马星动，工程进度快速推进。',
    },
  ],
  travel: [
    {
      date: '5月3日',
      weekday: '星期日',
      lunar: '农历四月初七',
      ganzhi: '乙巳年 辛巳月 甲辰日',
      score: 97,
      yi: ['宜出行', '宜旅游'],
      ji: [],
      stars: ['天德合', '驿马'],
      pillars: { year: '乙巳', month: '辛巳', day: '甲辰', hour: '—' },
      ai: '甲木坐辰土，木土相合，主出行顺利、旅途平安。天德合贵人入命，途中多遇贵人相助。驿马星大旺，远行大吉，无论是出差还是旅行都会有好收获。',
    },
    {
      date: '5月11日',
      weekday: '星期一',
      lunar: '农历四月十五',
      ganzhi: '乙巳年 辛巳月 丁未日',
      score: 94,
      yi: ['宜出行', '宜会友'],
      ji: [],
      stars: ['天喜', '月德'],
      pillars: { year: '乙巳', month: '辛巳', day: '丁未', hour: '—' },
      ai: '丁火坐未土，火土相生，主出行愉快、人际和谐。天喜星入命，旅途中有意外之喜。月德贵人护佑，安全无忧。此日适合访友出游，人际运极佳。',
    },
    {
      date: '5月23日',
      weekday: '星期六',
      lunar: '农历四月廿七',
      ganzhi: '乙巳年 辛巳月 己酉日',
      score: 91,
      yi: ['宜出行', '宜交易'],
      ji: [],
      stars: ['三合', '天医'],
      pillars: { year: '乙巳', month: '辛巳', day: '己酉', hour: '—' },
      ai: '己土坐酉金，土金相生，主出行顺利、财运不错。三合吉星入命，出行途中多有好机遇。天医星护佑，健康无忧。周末出行，放松身心的好时机。',
    },
  ],
  contract: [
    {
      date: '5月4日',
      weekday: '星期一',
      lunar: '农历四月初八',
      ganzhi: '乙巳年 辛巳月 乙卯日',
      score: 96,
      yi: ['宜签约', '宜交易'],
      ji: [],
      stars: ['天德', '天恩'],
      pillars: { year: '乙巳', month: '辛巳', day: '乙卯', hour: '—' },
      ai: '乙木坐卯木，木气旺盛，主合约顺利、合作长久。天德贵人入命，签约过程顺利无阻。天恩日上天恩赐，合作双方互利共赢，是签订重要合约的好日子。',
    },
    {
      date: '5月14日',
      weekday: '星期四',
      lunar: '农历四月十八',
      ganzhi: '乙巳年 辛巳月 丁丑日',
      score: 93,
      yi: ['宜签约', '宜纳财'],
      ji: [],
      stars: ['月德', '三合'],
      pillars: { year: '乙巳', month: '辛巳', day: '丁丑', hour: '—' },
      ai: '丁火坐丑土，火土相生，主根基稳固、财源广进。月德贵人护佑，合作愉快。三合吉星入命，双方意见一致，合约条款公平合理，利于长期合作。',
    },
    {
      date: '5月26日',
      weekday: '星期一',
      lunar: '农历五月初一',
      ganzhi: '乙巳年 辛巳月 癸亥日',
      score: 90,
      yi: ['宜签约', '宜祈福'],
      ji: [],
      stars: ['天赦', '驿马'],
      pillars: { year: '乙巳', month: '辛巳', day: '癸亥', hour: '—' },
      ai: '癸水坐亥水，水势充沛，主智慧通达、合约圆满。天赦日化解矛盾，签约过程中的分歧容易达成共识。驿马星动，利于跨地区合作。新月新气象，合约带来新机遇。',
    },
  ],
}

const SCENE_NAMES = {
  wedding: '结婚',
  business: '开业',
  moving: '搬家',
  construction: '动土',
  travel: '出行',
  contract: '签约',
}

export default function Result() {
  const { type } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const sceneName = SCENE_NAMES[type] || '择日'
  const selectedMonths = location.state?.months || [5, 6]
  const monthLabel = selectedMonths.length === 1
    ? `${selectedMonths[0]}月`
    : `${selectedMonths[0]}-${selectedMonths[selectedMonths.length - 1]}月`

  const results = MOCK_RESULTS[type] || MOCK_RESULTS.wedding

  return (
    <div className="result-page page-enter">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <h1>择日结果</h1>
          <div className="subtitle">为您精选的良辰吉日</div>
        </div>
      </div>

      {/* Result Header */}
      <div className="result-header">
        <div className="result-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          已为您找到 {results.length} 个吉日
        </div>
        <div className="result-title">{monthLabel} · {sceneName}吉日</div>
        <div className="result-subtitle">基于周易八卦 · 天干地支 · 黄道吉日综合推算</div>
      </div>

      {/* Result Cards */}
      {results.map((item, index) => (
        <div
          className="result-card"
          key={index}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="result-date-row">
            <div>
              <div className="result-date-main">
                {item.date} · {item.weekday}
              </div>
              <div className="result-date-sub">
                {item.lunar} · {item.ganzhi}
              </div>
            </div>
            <div className="result-score">
              <div className="score-value">{item.score}</div>
              <div className="score-label">综合评分</div>
            </div>
          </div>

          {/* Tags */}
          <div className="result-tags">
            {item.yi.map((tag, i) => (
              <span className="result-tag yi" key={`yi-${i}`}>{tag}</span>
            ))}
            {item.stars.map((star, i) => (
              <span className="result-tag star" key={`star-${i}`}>{star}</span>
            ))}
          </div>

          {/* Four Pillars */}
          <div className="result-ganzhi">
            <div className="ganzhi-item">
              <div className="ganzhi-label">年柱</div>
              <div className="ganzhi-value">{item.pillars.year}</div>
            </div>
            <div className="ganzhi-item">
              <div className="ganzhi-label">月柱</div>
              <div className="ganzhi-value">{item.pillars.month}</div>
            </div>
            <div className="ganzhi-item">
              <div className="ganzhi-label">日柱</div>
              <div className="ganzhi-value">{item.pillars.day}</div>
            </div>
            <div className="ganzhi-item">
              <div className="ganzhi-label">时柱</div>
              <div className="ganzhi-value">{item.pillars.hour}</div>
            </div>
          </div>

          {/* AI Interpretation */}
          <div className="ai-bubble">
            <div className="ai-bubble-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              AI 解读
            </div>
            {item.ai}
          </div>
        </div>
      ))}

      <div style={{ height: 24 }} />
    </div>
  )
}
