import { SYSTEM_PROMPT } from './prompt'

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
 * 调用 AI 生成择日解读（通过后端代理，不暴露 API Key）
 * @param {Object} dateData - 日期数据
 * @returns {Promise<string>} AI 解读文本
 */
export async function generateInterpretation(dateData) {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: buildUserMessage(dateData) },
        ],
      }),
    })

    if (!response.ok) {
      console.error('AI API error:', response.status)
      return null
    }

    const result = await response.json()
    return result.content || null
  } catch (err) {
    console.error('AI interpretation failed:', err)
    return null
  }
}
