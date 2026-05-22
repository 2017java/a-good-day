import { SYSTEM_PROMPT } from './prompt'

const API_BASE = import.meta.env.VITE_AI_BASE_URL
const API_KEY = import.meta.env.VITE_AI_API_KEY
const MODEL = import.meta.env.VITE_AI_MODEL || 'ark-code-latest'

/**
 * 构建用户消息
 */
function buildUserMessage(data) {
  const { scene, date, lunar, ganzhi, wuxing, jiShen, xiongShen, yi, ji, jiShi } = data
  return [
    `场景：${scene}`,
    `日期：${date}`,
    `农历：${lunar}`,
    `日干支：${ganzhi}`,
    `五行纳音：${wuxing}`,
    `吉神：${jiShen.length > 0 ? jiShen.join('、') : '无'}`,
    `凶神：${xiongShen.length > 0 ? xiongShen.join('、') : '无'}`,
    `宜：${yi.join('、')}`,
    `忌：${ji.length > 0 ? ji.join('、') : '无'}`,
    `吉时：${jiShi.join('、')}`,
  ].join('\n')
}

/**
 * 调用 AI 生成择日解读
 * @param {Object} dateData - 日期数据
 * @returns {Promise<string>} AI 解读文本
 */
export async function generateInterpretation(dateData) {
  if (!API_BASE || !API_KEY) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserMessage(dateData) },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      console.error('AI API error:', response.status)
      return null
    }

    const result = await response.json()
    return result.choices?.[0]?.message?.content || null
  } catch (err) {
    console.error('AI interpretation failed:', err)
    return null
  }
}

/**
 * 批量生成多个日期的 AI 解读（带节流）
 */
export async function generateBatchInterpretations(dates, onEach) {
  const results = []
  for (const date of dates) {
    const text = await generateInterpretation(date)
    results.push(text)
    onEach?.(text, results.length)
  }
  return results
}
