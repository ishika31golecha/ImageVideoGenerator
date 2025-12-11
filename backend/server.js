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

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Article Generator API is running' });
});

// Route 1: Generate 3 Articles
app.post('/generate-articles', async (req, res) => {
  try {
    const { topic, length, tone, language } = req.body;

    // Validation
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Map length to word count
    const lengthMap = {
      'Short': '100-150 words',
      'Medium': '200-300 words',
      'Long': '400-500 words'
    };

    const wordCount = lengthMap[length] || '200-300 words';

    // Construct the prompt
    const prompt = `Generate 3 different articles about "${topic}".

Requirements:
- Length: ${wordCount}
- Tone: ${tone}
- Language: ${language}

Return ONLY a valid JSON object in this exact format (no markdown, no extra text):
{
  "article1": "First article text here",
  "article2": "Second article text here",
  "article3": "Third article text here"
}

Make each article unique with different perspectives or angles on the topic.`;

    console.log('Generating articles for topic:', topic);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content writer. You always return valid JSON as requested.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Parse JSON response
    let articles;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      articles = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      return res.status(500).json({ 
        error: 'Failed to parse articles from AI response',
        details: parseError.message 
      });
    }

    // Validate response structure
    if (!articles.article1 || !articles.article2 || !articles.article3) {
      return res.status(500).json({ error: 'Invalid response format from AI' });
    }

    console.log('Articles generated successfully');
    res.json(articles);

  } catch (error) {
    console.error('Error generating articles:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate articles', 
      details: error.message 
    });
  }
});

// Route 2: Generate Final Image with Text
app.post('/generate-image', async (req, res) => {
  try {
    const { articleText, articleTitle } = req.body;

    // Validation
    if (!articleText || !articleTitle) {
      return res.status(400).json({ error: 'Article text and title are required' });
    }

    // Construct image generation prompt
    const imagePrompt = `Create a high-quality, modern illustration based on this article:
"${articleText.substring(0, 500)}..."

Include this text clearly on the image:
"${articleTitle}"

The text must be bold, centered, readable, clean, and visually pleasing.
The background should match the theme of the article.
Use vibrant colors and professional design.`;

    console.log('Generating image for article:', articleTitle);

    // Call OpenAI DALL-E API
    const image = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    });

    const imageUrl = image.data[0].url;

    console.log('Image generated successfully');
    res.json({ imageUrl });

  } catch (error) {
    console.error('Error generating image:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate image', 
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Endpoints available:`);
  console.log(`   POST /generate-articles - Generate 3 articles`);
  console.log(`   POST /generate-image - Generate final image with text`);
});
 