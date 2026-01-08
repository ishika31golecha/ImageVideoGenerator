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

    const prompt = `
Generate 3 different well-structured articles on the topic: "${topic}"

Rules for EACH article:
- Provide a clear and professional TITLE
- Content must be properly formatted
- Use headings, subheadings, and bullet points where appropriate
- Maintain paragraph spacing
- Tone: ${tone}
- Language: ${language}
- Length: ${wordCount}

Return STRICT JSON ONLY:
{
  "article1": { "title": "...", "content": "markdown content" },
  "article2": { "title": "...", "content": "markdown content" },
  "article3": { "title": "...", "content": "markdown content" }
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional content writer. Return valid JSON only.' },
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
// 2) Generate Image (OPTION A – NO TEXT INSIDE IMAGE)
// =======================================================================
app.post('/generate-image', async (req, res) => {
  try {
    const { articleText } = req.body;

    const prompt = `
Create a highly realistic, cinematic, professional business photograph.

Scene:
- Modern executive boardroom or corporate strategy room
- Real human professionals (executives, analysts, decision-makers)
- Natural expressions and body language
- Looks like a real photograph (NOT illustration or CGI)

Visual context:
${articleText.substring(0, 400)}

Rules:
- DO NOT include any readable text
- NO letters, numbers, charts with labels
- Screens may show abstract visuals only
- No typography of any kind

Style:
- Ultra-photorealistic
- Cinematic lighting, HDR
- Serious, corporate mood
- Netflix / LinkedIn documentary style
- 8K detail, sharp focus
`;

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
Write a professional LinkedIn-style caption (~100 words) for:
"${articleText}"

Rules:
- NO emojis
- Include relevant hashtags
- No quotes
Return only caption text.
`;

    const out = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Write clean professional captions." },
        { role: "user", content: captionPrompt }
      ],
      max_tokens: 120,
      temperature: 0.7
    });

    res.json({ caption: out.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate caption', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const axios = require('axios');

app.post('/publish', async (req, res) => {
  const { imageUrl, caption, platforms } = req.body;
  const results = {};

  try {
    if (platforms.includes('instagram')) {
      const igUserId = process.env.INSTAGRAM_BUSINESS_ID;
      const token = process.env.INSTAGRAM_ACCESS_TOKEN;

      const create = await axios.post(
        `https://graph.facebook.com/v18.0/${igUserId}/media`,
        null,
        { params: { image_url: imageUrl, caption, access_token: token } }
      );

      await axios.post(
        `https://graph.facebook.com/v18.0/${igUserId}/media_publish`,
        null,
        { params: { creation_id: create.data.id, access_token: token } }
      );

      results.instagram = 'Posted';
    }

    if (platforms.includes('facebook')) {
      await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/photos`,
        null,
        {
          params: {
            url: imageUrl,
            caption,
            access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
          }
        }
      );

      results.facebook = 'Posted';
    }

    // LinkedIn → we’ll add next (needs org/user setup)
    if (platforms.includes('linkedin')) {
      results.linkedin = 'Pending setup';
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});