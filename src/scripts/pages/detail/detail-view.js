import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DetailView = {
  renderContainer() {
    return `
      <section class="detail" id="detailSection">
        <div id="detailContent">
          <div class="loader">Loading...</div>
        </div>
        <div id="messageContainer" class="message-container"></div>
      </section>
    `;
  },

  bindBackButton(handler) {
    const backBtn = document.getElementById('backButton');
    if (backBtn) {
      backBtn.addEventListener('click', handler);
    }
  },

  bindSaveButton(handler) {
    const saveBtn = document.getElementById('saveReportButton');
    if (saveBtn) {
      saveBtn.addEventListener('click', handler);
    }
  },

  toggleSaveButton(isSaved) {
    const saveBtn = document.getElementById('saveReportButton');
    if (saveBtn) {
      saveBtn.textContent = isSaved ? 'Hapus Penyimpanan' : 'Simpan Laporan';
      saveBtn.className = isSaved ? 'btn-remove' : 'btn-save';
    }
  },

  showDetail(detail) {
    const container = document.getElementById('detailContent');
    container.innerHTML = `
      <article class="story-card">
        <img src="${detail.photoUrl}" alt="${detail.name}" class="story-image" />
        <h2 class="story-title">${detail.name}</h2>
        <p class="story-desc">${detail.description}</p>
        <p class="story-date">🗓️ ${new Date(detail.createdAt).toLocaleString()}</p>

        ${detail.lat && detail.lon ? `
          <div class="story-map" id="detailMap" style="height: 300px;"></div>
        ` : ''}

        <div class="story-actions">
          <button id="backButton" class="btn-back">← Kembali</button>
          <button id="saveReportButton" class="btn-save">Simpan Laporan</button>
        </div>
      </article>
    `;

    if (detail.lat && detail.lon) {
      this.initMap(detail.lat, detail.lon, detail.name);
    }
  },

  initMap(lat, lon, title) {
    const map = L.map('detailMap').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(title)
      .openPopup();
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
    const container = document.getElementById('detailContent');
    container.innerHTML = `
      <div class="error-message">
        <p>Gagal memuat detail story: ${message}</p>
        <button id="backButton" class="btn-back">← Kembali</button>
      </div>
    `;
    
    this.bindBackButton(() => {
      window.location.hash = '/';
    });
  }
};

export default DetailView;