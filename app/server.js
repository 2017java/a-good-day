import express from 'express'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3000

async function main() {
  const app = express()

  app.use(express.json())

  // ===== AI Proxy API =====
  app.post('/api/ai', async (req, res) => {
    const apiKey = process.env.VITE_AI_API_KEY
    const baseUrl = process.env.VITE_AI_BASE_URL || 'https://ark.cn-beijing.volces.com/api/coding/v3'
    const model = process.env.VITE_AI_MODEL || 'ark-code-latest'

    if (!apiKey) {
      return res.status(500).json({ error: 'AI API key not configured' })
    }

    const { systemPrompt, messages } = req.body

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      })

      if (!response.ok) {
        console.error('AI API error:', response.status, await response.text())
        return res.status(response.status).json({ error: 'AI API request failed' })
      }

      const result = await response.json()
      const content = result.choices?.[0]?.message?.content
      res.json({ content })
    } catch (err) {
      console.error('AI proxy error:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  // ===== Serve static files or start dev server =====
  if (isProd) {
    app.use(express.static(path.join(__dirname, 'dist')))
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    })
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    })
    app.use(vite.middlewares)
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

main()
