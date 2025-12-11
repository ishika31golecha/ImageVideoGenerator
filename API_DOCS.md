# API Documentation

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Health Check
```http
GET /
```

**Response:**
```json
{
  "message": "Article Generator API is running"
}
```

---

### 2. Generate Articles
```http
POST /generate-articles
```

**Description:** Generates 3 unique articles based on the provided topic and preferences.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "topic": "string (required)",
  "length": "Short | Medium | Long",
  "tone": "Formal | Creative | Professional | Informal | Educational",
  "language": "English | Hindi | Hinglish"
}
```

**Example Request:**
```json
{
  "topic": "Artificial Intelligence",
  "length": "Medium",
  "tone": "Creative",
  "language": "English"
}
```

**Success Response (200):**
```json
{
  "article1": "First article text with 200-300 words...",
  "article2": "Second article text with 200-300 words...",
  "article3": "Third article text with 200-300 words..."
}
```

**Error Response (400):**
```json
{
  "error": "Topic is required"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to generate articles",
  "details": "Error message from OpenAI"
}
```

---

### 3. Generate Image
```http
POST /generate-image
```

**Description:** Generates a DALL-E 3 image with the article title embedded as text on a themed background.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "articleText": "string (required) - Full article content",
  "articleTitle": "string (required) - Title to embed on image"
}
```

**Example Request:**
```json
{
  "articleText": "Artificial Intelligence is revolutionizing...",
  "articleTitle": "The Future of Artificial Intelligence"
}
```

**Success Response (200):**
```json
{
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/..."
}
```

**Error Response (400):**
```json
{
  "error": "Article text and title are required"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to generate image",
  "details": "Error message from OpenAI"
}
```

---

## Rate Limits

OpenAI rate limits apply:
- **GPT-4o-mini**: 500 requests per minute
- **DALL-E 3**: 7 images per minute

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request - Missing or invalid parameters |
| 500  | Internal Server Error - OpenAI API error |

## Notes

1. **API Key Required**: Set `OPENAI_API_KEY` in `.env` file
2. **Image URLs**: Temporary URLs from OpenAI (valid for 1 hour)
3. **Processing Time**: 
   - Articles: 3-10 seconds
   - Images: 10-20 seconds
4. **CORS**: Enabled for all origins (configure for production)

## Testing with cURL

### Generate Articles
```powershell
curl -X POST http://localhost:3000/generate-articles `
  -H "Content-Type: application/json" `
  -d '{\"topic\":\"Space Exploration\",\"length\":\"Medium\",\"tone\":\"Educational\",\"language\":\"English\"}'
```

### Generate Image
```powershell
curl -X POST http://localhost:3000/generate-image `
  -H "Content-Type: application/json" `
  -d '{\"articleText\":\"Space exploration has captivated...\",\"articleTitle\":\"Journey to the Stars\"}'
```

## Frontend Integration

See `frontend/script.js` for working examples of API integration.
