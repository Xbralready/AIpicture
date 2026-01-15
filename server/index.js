import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// OpenAI API 配置
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_BASE = 'https://api.openai.com/v1';

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 健康检查
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'AI Marketing Studio API' });
});

// 代理 Chat Completions API
app.post('/api/chat/completions', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: { message: 'API key not configured' } });
    }

    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Chat completions error:', error);
    res.status(500).json({ error: { message: error.message } });
  }
});

// 代理 Images Generation API
app.post('/api/images/generations', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: { message: 'API key not configured' } });
    }

    const response = await fetch(`${OPENAI_API_BASE}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: { message: error.message } });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
