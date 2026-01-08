const data = JSON.parse(localStorage.getItem('previewPost'));

const img = document.getElementById('preview-image');
const caption = document.getElementById('preview-caption');
const postBtn = document.getElementById('post-now-btn');
const status = document.getElementById('status');

img.src = data.imageUrl;
caption.value = data.caption;

postBtn.onclick = async () => {
  const platforms = Array.from(
    document.querySelectorAll('input[type=checkbox]:checked')
  ).map(cb => cb.value);

  if (!platforms.length) {
    alert('Select at least one platform');
    return;
  }

  postBtn.disabled = true;
  status.textContent = 'Posting...';

  try {
    const resp = await fetch('http://localhost:3000/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: img.src,
        caption: caption.value,
        platforms
      })
    });

    const result = await resp.json();
    status.textContent = '✅ Posted successfully:\n' + JSON.stringify(result, null, 2);
  } catch (e) {
    status.textContent = '❌ Failed to post';
  }

  postBtn.disabled = false;
};
