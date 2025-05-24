const BookmarkView = {
  render() {
    return `
      <section class="bookmark-page">
        <h1 class="page-title">Laporan Tersimpan</h1>
        <div id="storiesContainer" class="stories-container"></div>
        <div id="messageContainer" class="message-container"></div>
      </section>
    `;
  },

  showStories(stories) {
    const container = document.getElementById('storiesContainer');
    
    container.innerHTML = stories.map(story => `
      <article class="story-card" data-id="${story.id}">
        <img src="${story.photoUrl}" alt="${story.name}" class="story-image" />
        <div class="story-content">
          <h3>${story.name}</h3>
          <p class="story-desc">${story.description.substring(0, 100)}...</p>
          <div class="story-meta">
            <span>🗓️ ${new Date(story.createdAt).toLocaleDateString()}</span>
            <span>💾 ${new Date(story.savedAt).toLocaleDateString()}</span>
          </div>
          <div class="story-actions">
            <a href="#/detail/${story.id}" class="btn-detail">Lihat Detail</a>
            <button class="btn-remove" data-id="${story.id}">Hapus</button>
          </div>
        </div>
      </article>
    `).join('');
  },

  showEmptyMessage() {
    const container = document.getElementById('storiesContainer');
    container.innerHTML = `
      <div class="empty-message">
        <p>Belum ada laporan yang disimpan</p>
        <a href="#/" class="btn-primary">Jelajahi Laporan</a>
      </div>
    `;
  },

  bindRemoveButton(handler) {
    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        handler(id);
      });
    });
  },

  showMessage(message) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.textContent = message;
    messageContainer.style.display = 'block';
    
    setTimeout(() => {
      messageContainer.style.display = 'none';
    }, 3000);
  },

  showError(message) {
    const container = document.getElementById('storiesContainer');
    container.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
        <button onclick="window.location.reload()">Coba Lagi</button>
      </div>
    `;
  }
};

export default BookmarkView;