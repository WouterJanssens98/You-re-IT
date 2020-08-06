/* eslint-disable no-restricted-globals */

// set the debug state
const DEBUG = true;

/**
 * When Service Worker is installed
 */
self.addEventListener('install', () => {
  if (DEBUG) console.log('[Serviceworker] installed.');
});

/**
 * When Service Worker is active
 * After the install event
 */
self.addEventListener('activate', () => {
  if (DEBUG) console.log('[Serviceworker] active.');
});

/**
 * When the Fetch event is triggered
 */
self.addEventListener('fetch', (e) => {
  if (DEBUG) console.log('[ServiceWorker] Fetching', e.request.url);
});
