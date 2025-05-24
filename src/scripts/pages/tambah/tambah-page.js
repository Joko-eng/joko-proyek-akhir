import TambahPresenter from './tambah-presenter';

const TambahPage = {
  async render() {
    return `
      <section class="add-story">
        <h2 tabindex="0">Tambah Story</h2>
        <form id="addStoryForm" aria-label="Form tambah story" role="form">
          <label for="photo">Pilih Foto dari Galeri</label>
          <input id="photo" type="file" accept="image/*" aria-label="Upload foto dari galeri" />

          <p>Atau ambil langsung dari kamera:</p>
          <video id="cameraPreview" autoplay playsinline width="300" height="200" aria-label="Preview Kamera" style="border:1px solid #ccc;"></video>
          <br />
          <button type="button" id="captureButton" aria-label="Ambil foto dari kamera">Ambil Foto</button>

          <div style="margin-top: 1rem;">
            <label>Preview:</label><br />
            <img id="photoPreview" src="" alt="Preview foto yang dipilih" style="display:none; width:300px; border:1px solid #ccc;" />
          </div>

          <label for="description">Deskripsi</label>
          <textarea id="description" required aria-label="Deskripsi story"></textarea>

          <div id="map" role="region" aria-label="Peta lokasi" style="height: 300px; margin: 1rem 0;"></div>
          <button type="button" id="myLocationButton" aria-label="Gunakan lokasi saya">Gunakan Lokasi Saya</button>

          <button type="submit" aria-label="Kirim story">Kirim</button>
        </form>

        <p id="addStoryError" style="color:red;" aria-live="assertive"></p>
        <p id="addStorySuccess" style="color:green;" aria-live="polite"></p>

        <canvas id="canvas" style="display:none;"></canvas>
      </section>
    `;
  },

  async afterRender() {
    this.presenter = new TambahPresenter({ view: this });

    const form = document.getElementById('addStoryForm');
    const video = document.getElementById('cameraPreview');
    const canvas = document.getElementById('canvas');
    const captureButton = document.getElementById('captureButton');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photoPreview');
    const myLocationButton = document.getElementById('myLocationButton');

    await this.presenter.initCamera();
    await this.presenter.initMap('map');

    captureButton.addEventListener('click', () => {
      this.presenter.capturePhoto(video, canvas, photoInput, photoPreview, captureButton);
    });

    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          photoPreview.src = e.target.result;
          photoPreview.style.display = 'block';
          captureButton.disabled = false;
        };
        reader.readAsDataURL(file);
      }
    });

    myLocationButton.addEventListener('click', () => {
      this.presenter.useMyLocation();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.presenter.submitForm(form, photoInput, photoPreview);
    });

    window.addEventListener('hashchange', () => {
      this.presenter.stopCamera();
    });
  },

  showCamera(stream) {
    const video = document.getElementById('cameraPreview');
    video.srcObject = stream;
  },

  showError(message) {
    document.getElementById('addStoryError').textContent = message;
    document.getElementById('addStorySuccess').textContent = '';
  },

  showSuccess(message) {
    document.getElementById('addStorySuccess').textContent = message;
    document.getElementById('addStoryError').textContent = '';
  },

  resetForm() {
    const form = document.getElementById('addStoryForm');
    const photoPreview = document.getElementById('photoPreview');
    form.reset();
    photoPreview.style.display = 'none';
  },
};

export default TambahPage;
