import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import CONFIG from './config';

const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);

// Runtime caching
registerRoute(
  ({ url }) => {
    return (
      url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com'
    );
  },
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome');
  },
  new CacheFirst({
    cacheName: 'fontawesome',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://ui-avatars.com';
  },
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'story-api',
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'story-api-images',
  }),
);


registerRoute(
  ({ url }) => url.origin === 'https://tile.openstreetmap.org',
  new StaleWhileRevalidate({
    cacheName: 'osm-tiles',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
registerRoute(
  ({ url }) => url.origin === 'https://unpkg.com' && url.pathname.startsWith('/leatflet@'),
  new CacheFirst({
    cacheName: 'leatflet',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

self.addEventListener('push', (event) => {
  console.log('Service Worker menerima push notification...');

  try {
    const pushData = event.data.json();

    const judul = pushData.title || 'Ada laporan baru untuk Anda!';
    const opsi = {
      body: pushData.body || 'Terjadi insiden di daerah Anda',
    };

    event.waitUntil(
      self.registration.showNotification(judul, opsi)
    );
  } catch (error) {
    console.error('Gagal menampilkan notifikasi:', error);
    
    const fallbackOptions = {
      body: 'Buka aplikasi untuk melihat pembaruan terbaru'
    };
    event.waitUntil(
      self.registration.showNotification('Pembaruan tersedia', fallbackOptions)
    )
     }
});