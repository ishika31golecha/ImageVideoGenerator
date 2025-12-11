// Configuration
const API_BASE_URL = 'http://localhost:3000';

// State
let generatedArticles = {};
let selectedArticle = null;
let selectedArticleKey = null;

// DOM Elements
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

// Event Listeners
generateBtn.addEventListener('click', generateArticles);
generateImageBtn.addEventListener('click', generateImage);
restartBtn.addEventListener('click', restart);

// Function to show error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Function to extract title from article (first sentence or 5-8 words)
function extractTitle(articleText) {
    // Try to get first sentence
    const firstSentence = articleText.split(/[.!?]/)[0].trim();
    
    // If first sentence is too long, take first 8 words
    const words = firstSentence.split(' ');
    if (words.length > 8) {
        return words.slice(0, 8).join(' ') + '...';
    }
    
    return firstSentence;
}

// Function to generate articles
async function generateArticles() {
    const topic = topicInput.value.trim();
    
    if (!topic) {
        showError('Please enter a topic');
        return;
    }

    const length = lengthSelect.value;
    const tone = toneSelect.value;
    const language = languageSelect.value;

    // Show loading
    generateBtn.disabled = true;
    loading.classList.remove('hidden');
    articlesSection.classList.add('hidden');
    imageSection.classList.add('hidden');
    resultSection.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE_URL}/generate-articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic, length, tone, language })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate articles');
        }

        const data = await response.json();
        generatedArticles = data;

        // Display articles
        displayArticles();

        // Hide loading
        loading.classList.add('hidden');
        generateBtn.disabled = false;
        articlesSection.classList.remove('hidden');

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to generate articles. Please check if the backend is running.');
        loading.classList.add('hidden');
        generateBtn.disabled = false;
    }
}

// Function to display articles
function displayArticles() {
    articlesContainer.innerHTML = '';

    Object.keys(generatedArticles).forEach((key, index) => {
        const article = generatedArticles[key];
        const articleCard = document.createElement('div');
        articleCard.className = 'article-card';
        articleCard.innerHTML = `
            <span class="select-badge">✓ Selected</span>
            <h3>Article ${index + 1}</h3>
            <p>${article}</p>
        `;

        articleCard.addEventListener('click', () => selectArticle(key, article, articleCard));
        articlesContainer.appendChild(articleCard);
    });
}

// Function to select an article
function selectArticle(key, article, cardElement) {
    // Remove previous selection
    document.querySelectorAll('.article-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selection to clicked card
    cardElement.classList.add('selected');

    // Store selected article
    selectedArticle = article;
    selectedArticleKey = key;

    // Show image generation section
    selectedTitle.textContent = extractTitle(article);
    selectedText.textContent = article;
    imageSection.classList.remove('hidden');
    resultSection.classList.add('hidden');

    // Scroll to image section
    imageSection.scrollIntoView({ behavior: 'smooth' });
}

// Function to generate image
async function generateImage() {
    if (!selectedArticle) {
        showError('Please select an article first');
        return;
    }

    // Extract title locally (no API call needed)
    const articleTitle = extractTitle(selectedArticle);

    // Show loading
    generateImageBtn.disabled = true;
    imageLoading.classList.remove('hidden');
    resultSection.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE_URL}/generate-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                articleText: selectedArticle,
                articleTitle: articleTitle
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate image');
        }

        const data = await response.json();

        // Display final image
        finalImage.src = data.imageUrl;
        downloadBtn.href = data.imageUrl;

        // Hide loading and show result
        imageLoading.classList.add('hidden');
        generateImageBtn.disabled = false;
        resultSection.classList.remove('hidden');

        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to generate image. Please try again.');
        imageLoading.classList.add('hidden');
        generateImageBtn.disabled = false;
    }
}

// Function to restart
function restart() {
    // Reset state
    generatedArticles = {};
    selectedArticle = null;
    selectedArticleKey = null;

    // Reset form
    topicInput.value = '';
    lengthSelect.value = 'Medium';
    toneSelect.value = 'Creative';
    languageSelect.value = 'English';

    // Hide all sections except input
    articlesSection.classList.add('hidden');
    imageSection.classList.add('hidden');
    resultSection.classList.add('hidden');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
