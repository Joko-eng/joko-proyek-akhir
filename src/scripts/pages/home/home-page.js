import HomePresenter from "./home-presenter";

const HomePage = {
  async render() {
    return `
      <section class="home">
        <div class="page-header">
          <h2>Daftar Story</h2>
          
        </div>
        <div class="loader" id="loader" style="display: none;">Loading...</div>
  
        <div id="storiesContainer" class="stories-list"></div>
  
        <div id="storyMap" style="height: 300px; margin-top: 1rem; display: none;"></div>
      </section>
    `;
  },

  async afterRender() {
    const token = localStorage.getItem("story_token");
    const logoutWrapper = document.getElementById("logoutWrapper");
    const logoutButton = document.getElementById("logoutButton");
    const addStoryWrapper = document.getElementById('addStoryWrapper');

    const startTransition = async () => {
      const section = document.querySelector("section.home");
      if (section) {
        section.style.opacity = 0;

        await new Promise((resolve) => setTimeout(resolve, 100));
        section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        section.style.opacity = 1;
        section.style.transform = "translateY(0)";
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(startTransition);
    } else {
      startTransition();
    }

    this.presenter = new HomePresenter({
      view: this,
      token,
    });

    this.presenter.init();

   
    if (token) {
      if (logoutWrapper) logoutWrapper.style.display = 'list-item';
      if (addStoryWrapper) addStoryWrapper.style.display = 'list-item';
  
      if (logoutButton) {
        logoutButton.style.display = 'inline-block';
        logoutButton.addEventListener('click', () => {
          localStorage.removeItem('story_token');
          window.location.hash = '/login';
  
          // Sembunyikan kembali saat logout
          if (logoutWrapper) logoutWrapper.style.display = 'none';
          if (addStoryWrapper) addStoryWrapper.style.display = 'none';
        });
      }
    } else {
      if (logoutWrapper) logoutWrapper.style.display = 'none';
      if (addStoryWrapper) addStoryWrapper.style.display = 'none';
    }
  },

  showLoading() {
    const loader = document.getElementById("loader");
    const container = document.getElementById("storiesContainer");
    if (loader && container) {
      loader.style.display = "block";
      container.innerHTML = ""; // Kosongkan cerita saat loading
    }
  },

  hideLoading() {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.display = "none";
    }
  },

  showStories(stories) {
    this.hideLoading();
    const container = document.getElementById("storiesContainer");
    if (container) {
      container.innerHTML = stories
        .map(
          (story) => `
        <div class="story-card" data-id="${
          story.id
        }" tabindex="0" role="button" aria-label="Lihat detail dari ${
            story.name
          }">
          <img src="${story.photoUrl}" alt="${story.name}" />
          <h3>${story.name}</h3>
          <p>${
            story.description.length > 100
              ? story.description.substring(0, 100) + "..."
              : story.description
          }</p>
          <small>Created at: ${new Date(
            story.createdAt
          ).toLocaleDateString()}</small>
        </div>
      `
        )
        .join("");

      container.querySelectorAll(".story-card").forEach((card) => {
        card.addEventListener("click", () => {
          const storyId = card.dataset.id;
          window.location.hash = `/detail/${storyId}`;
        });

    
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            const storyId = card.dataset.id;
            window.location.hash = `/detail/${storyId}`;
          }
        });
      });
    }
  },

  showEmpty() {
    this.hideLoading();
    const container = document.getElementById("storiesContainer");
    if (container) {
      container.innerHTML = "<p>Belum ada story.</p>";
    }
  },

  showError(message) {
    this.hideLoading();
    const container = document.getElementById("storiesContainer");
    if (container) {
      container.innerHTML = `<p style="color:red;">${message}</p>`;
    }
  },

  initMap(storiesWithLocation) {
    const mapContainer = document.getElementById("storyMap");
    if (!mapContainer) return;
  
    mapContainer.style.display = "block";
  
    const map = L.map("storyMap").setView(
      [storiesWithLocation[0].lat, storiesWithLocation[0].lon],
      5
    );
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
  
    storiesWithLocation.forEach((story) => {
      L.marker([story.lat, story.lon])
        .addTo(map)
        .bindPopup(`<b>${story.name}</b><br>${story.description}`);
    });
  
    // Event listener untuk klik peta
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;
      alert(`Koordinat baru:\nLat: ${lat}\nLng: ${lng}`);
    });
  },
  

  hideMap() {
    const mapContainer = document.getElementById("storyMap");
    if (mapContainer) {
      mapContainer.style.display = "none";
    }
  },
};

export default HomePage;
