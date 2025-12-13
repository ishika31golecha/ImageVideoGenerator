const API_BASE_URL = 'http://127.0.0.1:3000';

// State
let generatedArticles = {};
let selectedArticle = null;

// Elements
const topicInput = document.getElementById('topic');
const lengthSelect = document.getElementById('length');
const toneSelect = document.getElementById('tone');
const languageSelect = document.getElementById('language');
const generateBtn = document.getElementById('generate-btn');
const loading = document.getElementById('loading');
const articlesSection = document.getElementById('articles-section');
const articlesContainer = document.getElementById('articles-container');
const imageSection = document.getElementById('image-section');
const selectedTitle = document.getElementById('selected-title');
const selectedText = document.getElementById('selected-text');
const generateImageBtn = document.getElementById('generate-image-btn');
const imageLoading = document.getElementById('image-loading');
const resultSection = document.getElementById('result-section');
const finalImage = document.getElementById('final-image');
const downloadBtn = document.getElementById('download-btn');
const errorMessage = document.getElementById('error-message');

// Overlay text
const posterTitle = document.getElementById('poster-title');
const posterSubtitle = document.getElementById('poster-subtitle');

// Caption
const generateCaptionBtn = document.getElementById('generate-caption-btn');
const captionSection = document.getElementById('caption-section');
const captionText = document.getElementById('caption-text');

// Error helper
function showError(msg){
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
  setTimeout(() => errorMessage.classList.add('hidden'), 4000);
}

// Markdown formatter
function formatMarkdown(text){
  return text
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    .replace(/^### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// Generate Articles
generateBtn.addEventListener('click', async () => {
  const topic = topicInput.value.trim();
  if(!topic) return showError('Please enter a topic');

  generateBtn.disabled = true;
  loading.classList.remove('hidden');
  articlesSection.classList.add('hidden');

  try {
    const resp = await fetch(`${API_BASE_URL}/generate-articles`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        topic,
        length: lengthSelect.value,
        tone: toneSelect.value,
        language: languageSelect.value
      })
    });

    generatedArticles = await resp.json();
    articlesContainer.innerHTML = '';

    Object.values(generatedArticles).forEach(article => {
      const card = document.createElement('div');
      card.className = 'article-card';
      card.innerHTML = `<h3>${article.title}</h3><p>${article.content.slice(0,140)}...</p>`;
      card.onclick = () => selectArticle(article);
      articlesContainer.appendChild(card);
    });

    articlesSection.classList.remove('hidden');
  } catch {
    showError('Failed to generate articles');
  }

  loading.classList.add('hidden');
  generateBtn.disabled = false;
});

// Select Article
function selectArticle(article){
  selectedArticle = article;
  selectedTitle.textContent = article.title;
  selectedText.innerHTML = formatMarkdown(article.content);
  imageSection.classList.remove('hidden');
}

// Generate Image (NO TEXT SENT)
generateImageBtn.addEventListener('click', async () => {
  if(!selectedArticle) return showError('Select an article first');

  generateImageBtn.disabled = true;
  imageLoading.classList.remove('hidden');

  try {
    const resp = await fetch(`${API_BASE_URL}/generate-image`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ articleText: selectedArticle.content })
    });

    const data = await resp.json();
    finalImage.src = data.imageUrl;
    downloadBtn.href = data.imageUrl;

    posterTitle.textContent = selectedArticle.title;
    posterSubtitle.textContent = 'Strategic insights for modern business growth';

    resultSection.classList.remove('hidden');
  } catch {
    showError('Failed to generate image');
  }

  imageLoading.classList.add('hidden');
  generateImageBtn.disabled = false;
});

// Generate Caption
generateCaptionBtn.addEventListener('click', async () => {
  captionSection.classList.remove('hidden');
  captionText.textContent = 'Generating caption...';

  const resp = await fetch(`${API_BASE_URL}/generate-caption`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ articleText: selectedArticle.content })
  });

  const data = await resp.json();
  captionText.textContent = data.caption;
});
