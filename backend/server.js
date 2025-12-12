const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'AI Content Studio API is running' });
});

// =======================================================================
// 1) Generate 3 Articles
// =======================================================================
app.post('/generate-articles', async (req, res) => {
  try {
    const { topic, length, tone, language } = req.body;

    if (!topic) return res.status(400).json({ error: 'Topic is required' });

    const lengthMap = {
      Short: '100-150 words',
      Medium: '200-300 words',
      Long: '400-500 words'
    };

    const wordCount = lengthMap[length] || '200-300 words';

    const prompt = `Generate 3 different articles about "${topic}".
Length: ${wordCount}
Tone: ${tone}
Language: ${language}
Return JSON ONLY:
{
 "article1":"...",
 "article2":"...",
 "article3":"..."
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Return clean JSON only.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000
    });

    let text = completion.choices[0].message.content.trim();
    text = text.replace(/```json|```/g, '');
    const parsed = JSON.parse(text);

    res.json(parsed);

  } catch (err) {
    res.status(500).json({ error: 'Failed to generate articles', details: err.message });
  }
});

// =======================================================================
// 2) Generate Image
// =======================================================================
app.post('/generate-image', async (req, res) => {
  try {
    const { articleText, articleTitle } = req.body;

    const prompt = `Create a modern high-quality illustration based on:
"${articleText.substring(0, 500)}..."
Include title: "${articleTitle}"`;

    const img = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      n: 1
    });

    res.json({ imageUrl: img.data[0].url });

  } catch (err) {
    res.status(500).json({ error: 'Failed to generate image', details: err.message });
  }
});

// =======================================================================
// 3) Caption Generator
// =======================================================================
app.post('/generate-caption', async (req, res) => {
  try {
    const { articleText } = req.body;

    const captionPrompt = `
Write an engaging caption (100 word long caption) for:
"${articleText}"
Rules:
- NO emojis
- Include hashtags
- No quotes
Return only caption text.
`;

    const out = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Write clean captions." },
        { role: "user", content: captionPrompt }
      ],
      max_tokens: 80,
      temperature: 0.8
    });

    res.json({ caption: out.choices[0].message.content.trim() });

  } catch (err) {
    res.status(500).json({ error: 'Failed to generate caption', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
