// Configuration
// const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://127.0.0.1:3000';

// Sidebar behavior
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const collapseBtn = document.getElementById('collapse-btn');

// Panel navigation
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const panels = Array.from(document.querySelectorAll('.panel'));

// Existing DOM elements (article/image flow)
let generatedArticles = {};
let selectedArticle = null;
let selectedArticleKey = null;

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
const restartBtn = document.getElementById('restart-btn');
const errorMessage = document.getElementById('error-message');

// Video generator elements
const generateVideoBtn = document.getElementById('generate-video-btn');
const videoLoading = document.getElementById('video-loading');
const videoResult = document.getElementById('video-result');
const videoPreview = document.getElementById('video-preview');

// Schedule elements
const scheduleBtn = document.getElementById('schedule-btn');
const scheduleLoading = document.getElementById('schedule-loading');
const scheduleResult = document.getElementById('schedule-result');
const scheduledList = document.getElementById('scheduled-list');

//Caption generation
const generateCaptionBtn = document.getElementById('generate-caption-btn');
const captionSection = document.getElementById('caption-section');
const captionText = document.getElementById('caption-text');
const copyCaptionBtn = document.getElementById('copy-caption-btn');


// Attach event listeners
sidebarToggle.addEventListener('click', () => {
  // Quick visual feedback (no full collapse)
  sidebar.classList.toggle('collapsed');
});
collapseBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  const pressed = sidebar.classList.contains('collapsed');
  collapseBtn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
});

// Navigation click: switch panels
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    const sectionId = link.getAttribute('data-section');
    panels.forEach(p => {
      if (p.id === sectionId) {
        p.classList.add('active-panel');
        p.scrollIntoView({ behavior: 'smooth' });
      } else {
        p.classList.remove('active-panel');
      }
    });
  });
});

// ---------- Helper: show error ----------
function showError(message){
  if(!errorMessage) return;
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  setTimeout(() => errorMessage.classList.add('hidden'), 5000);
}

// ---------- Title extraction ----------
function extractTitle(articleText){
  const firstSentence = (articleText || '').split(/[.!?]/)[0].trim();
  const words = firstSentence.split(/\s+/);
  if(words.length > 8) return words.slice(0,8).join(' ') + '...';
  return firstSentence || 'Untitled';
}

// ---------- Generate Articles ----------
generateBtn && generateBtn.addEventListener('click', generateArticles);

async function generateArticles(){
  const topic = topicInput.value.trim();
  if(!topic){ showError('Please enter a topic'); return; }

  const length = lengthSelect.value;
  const tone = toneSelect.value;
  const language = languageSelect.value;

  generateBtn.disabled = true;
  loading.classList.remove('hidden');
  articlesSection.classList.add('hidden');
  imageSection.classList.add('hidden');
  resultSection.classList.add('hidden');

  try{
    // Replace with your real API; here we simulate a response if backend isn't available
    const useFake = false; // set true for local offline demo
    let data;
    if(useFake){
      data = {
        "a1": `A short introduction to ${topic}. This article explains the importance and main ideas in simple language.`,
        "a2": `Another perspective on ${topic}. This version takes a more creative tone and explores implications.`,
        "a3": `A detailed take on ${topic}. It addresses recent trends, challenges and future directions.`
      };
      await new Promise(r => setTimeout(r,800));
    } else {
      const resp = await fetch(`${API_BASE_URL}/generate-articles`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ topic, length, tone, language })
      });
      if(!resp.ok){
        const err = await resp.json().catch(()=>({error:'Unknown'}));
        throw new Error(err.error || 'Failed to generate articles');
      }
      data = await resp.json();
    }

    generatedArticles = data;
    displayArticles();
    loading.classList.add('hidden');
    generateBtn.disabled = false;
    articlesSection.classList.remove('hidden');

    // Ensure image panel hidden until selection
    imageSection.classList.add('hidden');
    resultSection.classList.add('hidden');

  }catch(err){
    console.error(err);
    showError(err.message || 'Failed to generate articles. Check backend.');
    loading.classList.add('hidden');
    generateBtn.disabled = false;
  }
}

// ---------- Display articles ----------
function displayArticles(){
  articlesContainer.innerHTML = '';
  Object.keys(generatedArticles).forEach((key, idx) => {
    const article = generatedArticles[key];
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <h3>Article ${idx + 1}</h3>
      <p>${article}</p>
    `;
    card.addEventListener('click', () => selectArticle(key, article, card));
    articlesContainer.appendChild(card);
  });
}

// ---------- Select article ----------
function selectArticle(key, article, cardElement){
  document.querySelectorAll('.article-card').forEach(c => c.classList.remove('selected'));
  cardElement.classList.add('selected');

  selectedArticle = article;
  selectedArticleKey = key;

  selectedTitle.textContent = extractTitle(article);
  selectedText.textContent = article;
  imageSection.classList.remove('hidden');
  resultSection.classList.add('hidden');

  imageSection.scrollIntoView({ behavior: 'smooth' });
}

// ---------- Generate image ----------
generateImageBtn && generateImageBtn.addEventListener('click', generateImage);
async function generateImage(){
  if(!selectedArticle){ showError('Please select an article first'); return; }

  const articleTitle = extractTitle(selectedArticle);
  generateImageBtn.disabled = true;
  imageLoading.classList.remove('hidden');
  resultSection.classList.add('hidden');

  try{
    const useFake = false; // true shows a placeholder image without backend
    let data;
    if(useFake){
      await new Promise(r => setTimeout(r,1000));
      data = { imageUrl: 'https://via.placeholder.com/1200x700.png?text=Generated+Image' };
    } else {
      const resp = await fetch(`${API_BASE_URL}/generate-image`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ articleText: selectedArticle, articleTitle })
      });
      if(!resp.ok){
        const err = await resp.json().catch(()=>({error:'Unknown'}));
        throw new Error(err.error || 'Failed to generate image');
      }
      data = await resp.json();
    }

    finalImage.src = data.imageUrl;
    downloadBtn.href = data.imageUrl;

    imageLoading.classList.add('hidden');
    generateImageBtn.disabled = false;
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });

  }catch(err){
    console.error(err);
    showError(err.message || 'Failed to generate image');
    imageLoading.classList.add('hidden');
    generateImageBtn.disabled = false;
  }
}

// ---------- Restart ----------
restartBtn && restartBtn.addEventListener('click', restart);
function restart(){
  generatedArticles = {};
  selectedArticle = null;
  selectedArticleKey = null;

  topicInput.value = '';
  lengthSelect.value = 'Medium';
  toneSelect.value = 'Creative';
  languageSelect.value = 'English';

  articlesSection.classList.add('hidden');
  imageSection.classList.add('hidden');
  resultSection.classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ---------------- Video generator (placeholder) ----------------
generateVideoBtn && generateVideoBtn.addEventListener('click', async () => {
  const topic = document.getElementById('video-topic').value.trim();
  if(!topic){ showError('Please enter a video topic'); return; }

  generateVideoBtn.disabled = true;
  videoLoading.classList.remove('hidden');
  videoResult.classList.add('hidden');

  try{
    // Replace with real backend call
    await new Promise(r => setTimeout(r, 1200));
    // fake video blob for demo
    videoPreview.src = '';
    videoPreview.src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
    videoResult.classList.remove('hidden');
    videoLoading.classList.add('hidden');
    generateVideoBtn.disabled = false;
    videoResult.scrollIntoView({ behavior: 'smooth' });
  }catch(err){
    console.error(err);
    showError('Failed to generate video.');
    videoLoading.classList.add('hidden');
    generateVideoBtn.disabled = false;
  }
});

// ---------------- Schedule post (local demo) ----------------
scheduleBtn && scheduleBtn.addEventListener('click', async () => {
  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();
  const when = document.getElementById('post-date').value;

  if(!title || !content || !when){ showError('Please fill title, content and date'); return; }

  scheduleBtn.disabled = true;
  scheduleLoading.classList.remove('hidden');

  try{
    // simple local storage demo of scheduled posts
    const item = { id: Date.now(), title, content, when };
    const list = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
    list.push(item);
    localStorage.setItem('scheduledPosts', JSON.stringify(list));

    // render cached list
    renderScheduled();
    scheduleLoading.classList.add('hidden');
    scheduleBtn.disabled = false;
    scheduleResult.classList.remove('hidden');
  }catch(err){
    console.error(err);
    showError('Failed to schedule post');
    scheduleLoading.classList.add('hidden');
    scheduleBtn.disabled = false;
  }
});

function renderScheduled(){
  const list = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
  scheduledList.innerHTML = '';
  list.forEach(li => {
    const el = document.createElement('li');
    el.innerHTML = `<strong>${li.title}</strong> — <span class="muted">${new Date(li.when).toLocaleString()}</span>
      <div style="margin-top:6px;color:var(--muted);font-size:13px">${li.content}</div>`;
    scheduledList.appendChild(el);
  });
}

// initial render of scheduled posts
renderScheduled();


generateCaptionBtn && generateCaptionBtn.addEventListener('click', async () => {
  if (!selectedArticle) {
    showError('Generate an image first.');
    return;
  }

  generateCaptionBtn.disabled = true;
  captionText.textContent = 'Generating caption...';
  captionSection.classList.remove('hidden');

  try {
    const resp = await fetch(`${API_BASE_URL}/generate-caption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleText: selectedArticle })
    });

    const data = await resp.json();

    if (!resp.ok) throw new Error(data.error);

    captionText.textContent = data.caption;
    generateCaptionBtn.disabled = false;

  } catch (err) {
    showError('Failed to generate caption');
    captionSection.classList.add('hidden');
    generateCaptionBtn.disabled = false;
  }
});
