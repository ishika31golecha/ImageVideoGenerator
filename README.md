# 🤖 AI Article Generator with Image Creation

A full-stack web application that generates AI-powered articles and creates stunning images with embedded text using OpenAI's GPT and DALL-E APIs.

## 🎯 Features

- **Generate 3 Unique Articles**: Input any topic and get 3 different perspectives
- **Customizable Options**: Choose article length, tone, and language
- **Smart Article Selection**: Pick your favorite article from the generated options
- **Image Generation**: Create a beautiful image with your article title embedded
- **Single API Calls**: Only 2 OpenAI API calls total (articles + image)
- **Download Ready**: Download your final image instantly

## 🏗️ Tech Stack

### Backend
- Node.js + Express
- OpenAI API (GPT-4 & DALL-E 3)
- CORS enabled
- Environment variables for security

### Frontend
- Pure HTML/CSS/JavaScript
- Responsive design
- Clean, modern UI
- No framework dependencies

## 📦 Project Structure

```
test4/
├── backend/
│   ├── server.js           # Express server with API routes
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Environment variables template
│   └── .gitignore
├── frontend/
│   ├── index.html          # Main HTML structure
│   ├── style.css           # Styling and animations
│   └── script.js           # Frontend logic and API calls
└── README.md               # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Step 1: Clone or Navigate to Project
```powershell
cd c:\Anish\clg\indestry\test4
```

### Step 2: Backend Setup

1. Navigate to backend folder:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Create `.env` file:
```powershell
Copy-Item .env.example .env
```

4. Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3000
```

5. Start the backend server:
```powershell
npm start
```

You should see:
```
🚀 Server is running on http://localhost:3000
📝 Endpoints available:
   POST /generate-articles - Generate 3 articles
   POST /generate-image - Generate final image with text
```

### Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend folder:
```powershell
cd c:\Anish\clg\indestry\test4\frontend
```

2. Open `index.html` in your browser:
```powershell
Start-Process index.html
```

Or simply double-click `index.html` in File Explorer.

## 📖 How to Use

### Step 1: Enter Topic and Preferences
1. Enter your topic (e.g., "Artificial Intelligence", "Climate Change")
2. Select article length: Short / Medium / Long
3. Choose tone: Formal / Creative / Professional / Informal / Educational
4. Pick language: English / Hindi / Hinglish
5. Click "Generate Articles"

### Step 2: Choose Your Favorite Article
- Review the 3 generated articles
- Click on the card of your favorite article
- The selected article will be highlighted

### Step 3: Generate Image
1. Click "Generate Image" button
2. Wait 10-20 seconds for image creation
3. The image will include:
   - Background illustration based on article content
   - Article title embedded as text on the image

### Step 4: Download Your Image
- Click "📥 Download Image" to save
- Or click "🔄 Create Another" to start over

## 🔌 API Endpoints

### POST `/generate-articles`
Generates 3 unique articles based on user input.

**Request Body:**
```json
{
  "topic": "Artificial Intelligence",
  "length": "Medium",
  "tone": "Creative",
  "language": "English"
}
```

**Response:**
```json
{
  "article1": "First article text...",
  "article2": "Second article text...",
  "article3": "Third article text..."
}
```

### POST `/generate-image`
Generates an image with text embedded using DALL-E 3.

**Request Body:**
```json
{
  "articleText": "Full article content...",
  "articleTitle": "Extracted title"
}
```

**Response:**
```json
{
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/..."
}
```

## ⚡ API Call Optimization

This project uses **exactly 2 OpenAI API calls**:

1. **Call 1**: Generate 3 articles (using GPT-4o-mini)
2. **Call 2**: Generate final image with embedded text (using DALL-E 3)

**Note**: The article title is extracted locally from the selected article text, requiring no additional API call.

## 🎨 Customization Options

### Article Length
- **Short**: 100-150 words
- **Medium**: 200-300 words
- **Long**: 400-500 words

### Tone Options
- Formal
- Creative
- Professional
- Informal
- Educational

### Language Support
- English
- Hindi
- Hinglish (Hindi + English mix)

## 🛠️ Troubleshooting

### Backend won't start
- Ensure you have Node.js installed: `node --version`
- Check if port 3000 is available
- Verify your `.env` file has a valid OpenAI API key

### "Failed to generate articles" error
- Check your OpenAI API key is valid
- Ensure you have credits in your OpenAI account
- Check backend console for detailed error messages

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:3000`
- Check browser console for CORS errors
- Verify API_BASE_URL in `script.js` matches backend URL

### Image generation takes too long
- DALL-E 3 typically takes 10-20 seconds
- Ensure stable internet connection
- Check OpenAI API status if issues persist

## 📸 Example Screenshots

### Input Section
User enters topic and selects preferences for article generation.

### Article Cards
Three unique articles displayed in clean cards for selection.

### Final Image
Generated image with embedded text, ready for download.

## 🔐 Security Notes

- Never commit `.env` file to version control
- Keep your OpenAI API key private
- Use `.gitignore` to exclude sensitive files
- Consider adding rate limiting for production use

## 🚀 Future Enhancements

### Potential Improvements:
1. **User Authentication**: Save articles and images to user accounts
2. **History Feature**: View previously generated content
3. **More Image Styles**: Add style options (abstract, realistic, minimalist)
4. **Social Sharing**: Share images directly to social media
5. **Image Editing**: Allow text position/style customization
6. **Multiple Languages**: Expand language support
7. **Export Options**: PDF, DOCX formats for articles
8. **Analytics Dashboard**: Track usage statistics
9. **Batch Generation**: Generate multiple sets at once
10. **API Rate Limiting**: Prevent abuse in production

## 📝 Development Mode

For development with auto-restart:

```powershell
cd backend
npm install -D nodemon
npm run dev
```

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend console logs
3. Verify OpenAI API status
4. Check browser console for frontend errors

---

**Built with ❤️ using OpenAI's GPT-4 and DALL-E 3**

Happy Generating! 🎉
