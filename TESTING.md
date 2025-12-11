# Test Examples

## Test Case 1: Technology Topic

### Input:
- **Topic**: Artificial Intelligence
- **Length**: Medium
- **Tone**: Educational
- **Language**: English

### Expected Output:
3 articles about AI, each 200-300 words, with educational tone.

### Example Article Title:
"Artificial Intelligence is transforming industries worldwide"

### Expected Image:
A modern illustration showing AI concepts (neural networks, robots, circuits) with the title overlaid in bold, centered text.

---

## Test Case 2: Environmental Topic

### Input:
- **Topic**: Climate Change
- **Length**: Long
- **Tone**: Formal
- **Language**: English

### Expected Output:
3 detailed articles about climate change, each 400-500 words, with formal tone.

### Example Article Title:
"Climate Change poses significant challenges to global ecosystems"

### Expected Image:
Earth, melting ice, or environmental themes with the title in professional typography.

---

## Test Case 3: Hindi Language Test

### Input:
- **Topic**: भारतीय संस्कृति (Indian Culture)
- **Length**: Short
- **Tone**: Creative
- **Language**: Hindi

### Expected Output:
3 short creative articles in Hindi about Indian culture.

### Example Article Title:
"भारतीय संस्कृति विश्व की सबसे प्राचीन संस्कृतियों में से एक है"

### Expected Image:
Cultural imagery with Hindi text overlay.

---

## Test Case 4: Hinglish Test

### Input:
- **Topic**: Social Media
- **Length**: Medium
- **Tone**: Informal
- **Language**: Hinglish

### Expected Output:
3 articles mixing Hindi and English, informal tone.

### Example Article Title:
"Social Media ne duniya ko kaise badal diya"

### Expected Image:
Modern social media themed illustration with Hinglish text.

---

## Test Case 5: Business Topic

### Input:
- **Topic**: Entrepreneurship
- **Length**: Medium
- **Tone**: Professional
- **Language**: English

### Expected Output:
3 professional articles about entrepreneurship.

### Example Article Title:
"Entrepreneurship drives innovation and economic growth"

### Expected Image:
Business/startup themed visuals with professional title display.

---

## API Testing with Postman

### 1. Test Generate Articles Endpoint

**URL**: `POST http://localhost:3000/generate-articles`

**Body (raw JSON)**:
```json
{
  "topic": "Space Exploration",
  "length": "Medium",
  "tone": "Educational",
  "language": "English"
}
```

**Expected Response**:
```json
{
  "article1": "Space exploration has been...",
  "article2": "The journey beyond Earth...",
  "article3": "Humanity's quest to explore..."
}
```

### 2. Test Generate Image Endpoint

**URL**: `POST http://localhost:3000/generate-image`

**Body (raw JSON)**:
```json
{
  "articleText": "Space exploration has been a fascinating journey for humanity. From the first satellite to Mars rovers, we've made incredible progress...",
  "articleTitle": "The Journey Beyond Earth"
}
```

**Expected Response**:
```json
{
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/..."
}
```

---

## Error Testing

### Missing Topic
**Request**:
```json
{
  "length": "Medium",
  "tone": "Creative",
  "language": "English"
}
```

**Expected Response** (400):
```json
{
  "error": "Topic is required"
}
```

### Invalid API Key
If `.env` has invalid API key:

**Expected Response** (500):
```json
{
  "error": "Failed to generate articles",
  "details": "Incorrect API key provided"
}
```

---

## Manual UI Testing Checklist

- [ ] Enter topic and generate articles
- [ ] All 3 article cards display correctly
- [ ] Click each article card - only one stays selected
- [ ] Selected article appears in "Step 3" section
- [ ] Generate image button works
- [ ] Loading spinner appears during generation
- [ ] Final image displays correctly
- [ ] Download button downloads the image
- [ ] "Create Another" resets the form
- [ ] Error messages display for failed requests
- [ ] Responsive design works on mobile
- [ ] All dropdown options work correctly

---

## Performance Benchmarks

### Article Generation
- **Expected Time**: 3-10 seconds
- **Tokens Used**: ~500-1000 tokens
- **Cost**: ~$0.001-0.003 per request

### Image Generation
- **Expected Time**: 10-20 seconds
- **Cost**: ~$0.04 per image (DALL-E 3 standard)

### Total Cost per Complete Flow
- Articles + Image: ~$0.041-0.043

---

## Browser Compatibility Testing

Test in:
- [x] Chrome
- [x] Firefox
- [x] Edge
- [x] Safari
- [x] Mobile Chrome
- [x] Mobile Safari

---

## Known Limitations

1. **Image URLs Expire**: OpenAI image URLs are temporary (1 hour)
2. **Rate Limits**: 7 images per minute with DALL-E 3
3. **Text in Images**: AI-generated text may have minor imperfections
4. **Long Topics**: Very long topics may be truncated
5. **Special Characters**: Some characters might not render perfectly in images

---

## Success Criteria

✅ Backend starts without errors
✅ Frontend connects to backend
✅ 3 unique articles generated per request
✅ Articles respect length/tone/language parameters
✅ Only 2 API calls made (articles + image)
✅ Image contains visible text
✅ Download functionality works
✅ Error handling displays appropriate messages
✅ UI is responsive and user-friendly
✅ All features work end-to-end
