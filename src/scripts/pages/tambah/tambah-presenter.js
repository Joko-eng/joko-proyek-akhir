import { postStory } from '../../data/api';
import L from 'leaflet';

export default class TambahPresenter {
  constructor({ view }) {
    this.view = view;
    this.stream = null;
    this.currentLat = null;
    this.currentLng = null;
    this.map = null;
    this.marker = null;
    this.isGettingLocation = false;
  }

  async initCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.view.showCamera(this.stream);
    } catch (err) {
      console.error('Gagal mengakses kamera:', err);
      this.view.showError('Gagal mengakses kamera.');
    }
  }

  capturePhoto(videoElem, canvasElem, photoInputElem, photoPreviewElem, captureButton) {
    const context = canvasElem.getContext('2d');
    canvasElem.width = videoElem.videoWidth;
    canvasElem.height = videoElem.videoHeight;
    context.drawImage(videoElem, 0, 0, canvasElem.width, canvasElem.height);

    const dataURL = canvasElem.toDataURL('image/jpeg');
    photoPreviewElem.src = dataURL;
    photoPreviewElem.style.display = 'block';
    captureButton.disabled = true;

    canvasElem.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      photoInputElem.files = dataTransfer.files;
    }, 'image/jpeg');
  }

  initMap(mapContainerId) {
    this.map = L.map(mapContainerId).setView([-8.2192, 114.3692], 13); // Lokasi default: Poliwangi
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  
  
    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this.updateMarker(lat, lng);
    });
  }
  

  useMyLocation() {
    if (this.isGettingLocation) return;
    this.isGettingLocation = true;

    if (!navigator.geolocation) {
      this.view.showError('Geolocation tidak didukung oleh browser Anda.');
      this.isGettingLocation = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.map.setView([latitude, longitude], 13);
        this.updateMarker(latitude, longitude);
        this.view.showError('');
        this.isGettingLocation = false;
      },
      (error) => {
        console.error('Gagal mendapatkan lokasi:', error);
        this.view.showError('Gagal mendapatkan lokasi Anda.');
        this.isGettingLocation = false;
      }
    );
  }

  updateMarker(lat, lng) {
    this.currentLat = lat;
    this.currentLng = lng;
  
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
      this.marker.on('dragend', (e) => {
        const position = e.target.getLatLng();
        this.updateMarker(position.lat, position.lng);
      });
    }
  
    this.marker.bindPopup(`Lokasi dipilih: ${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();
  }
  

  async submitForm(form, photoInput, photoPreview) {
    const errorElem = document.getElementById('addStoryError');
    const successElem = document.getElementById('addStorySuccess');
    errorElem.textContent = '';
    successElem.textContent = '';

    const description = form.description?.value?.trim();
    const photoFile = photoInput.files[0];

    if (!description) {
      errorElem.textContent = 'Deskripsi tidak boleh kosong.';
      return;
    }

    if (!photoFile) {
      errorElem.textContent = 'Mohon pilih atau ambil foto terlebih dahulu.';
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photoFile);

    if (this.currentLat && this.currentLng) {
      formData.append('lat', this.currentLat);
      formData.append('lon', this.currentLng);
    }

    try {
      const token = localStorage.getItem('story_token');
      if (!token) throw new Error('Token tidak ditemukan. Harap login kembali.');

      await postStory(formData, token);

      successElem.textContent = 'Story berhasil ditambahkan!';
      form.reset();
      photoPreview.style.display = 'none';

      if (this.stream) this.stopCamera();
    } catch (err) {
      console.error('Gagal mengirim story:', err);
      errorElem.textContent = err.message || 'Terjadi kesalahan saat mengirim story.';
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }
}
