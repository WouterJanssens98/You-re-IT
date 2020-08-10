/* eslint-disable no-restricted-globals */

// set the debug state
const DEBUG = true;

/**
 * When Service Worker is installed
 */
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Setting {cache: 'reload'} in the new request will ensure that the response
    // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
    await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
  })());
});

const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
// Customize this with a different URL if needed.
const OFFLINE_URL = './offline';


const cacheVersion = 1;
const cacheName = `cache-${cacheVersion}`;
const cacheFiles = [
  './app.js',
  './lib/App.js',
  './lib/core/MapBox.js',
  './lib/core/LocalStorage.js',
  './lib/core/FireBase.js',
  './lib/core/Renderer.js',
  './lib/core/Router.js',
  './lib/core/Tools.js',
  './pages/offline.js',
  './templates/offlinepage.hbs',
  './routes.js',

];

/**
 * When Service Worker is active
 * After the install event
 */


self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Enable navigation preload if it's supported.
    // See https://developers.google.com/web/updates/2017/02/navigation-preload
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});


/**
 * When the Fetch event is triggered
 */
self.addEventListener('fetch', (event) => {
  console.log(event.request.url);
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  }
});