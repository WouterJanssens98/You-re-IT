/* eslint-disable no-restricted-globals */

// set the debug state
const DEBUG = true;




const cacheVersion = 1;
const cacheName = `cache-${cacheVersion}`;
const cacheFiles = [
  './app.js',
  './lib/App.js',
  './lib/core/LocalStorage.js',
  './lib/core/FireBase.js',
  './lib/core/Renderer.js',
  './lib/core/Router.js',
  './lib/core/Tools.js',
  './assets/icons/players/badplayer.png',
  './assets/icons/players/goodplayer.png',
  './assets/icons/players/realplayer.png',
  './pages/offline.js',
  './templates/admingame.hbs',
  './templates/homepage.hbs',
  './templates/playergame.hbs',
  './templates/offlinepage.hbs',
  './routes.js',

];

/*
 * When Service Worker is active
 * After the install event
 */



// Adding the offline page  
// when installing the service worker 
self.addEventListener('install', e => { 
    // Wait until promise is finished  
    // Until it get rid of the service worker 
    e.waitUntil( 
        caches.open(cacheFiles) 
        .then(cache => { 
            cache.add(cacheFiles) 
                // When everything is set 
                .then(() => self.skipWaiting()) 
        }) 
    ); 
}) 
  
// Call Activate Event 
self.addEventListener('activate', e => { 
    console.log('Service Worker - Activated') 
    e.waitUntil( 
        caches.keys().then(cacheNames => { 
            return Promise.all( 
                cacheNames.map( 
                    cache => { 
                        if (cache !== cacheFiles) { 
                            console.log( 
                              'Service Worker: Clearing Old Cache'); 
                            return caches.delete(cache); 
                        } 
                    } 
                ) 
            ) 
        }) 
    ); 
  
}); 
  
// Call Fetch Event  
self.addEventListener('fetch', function(event) {

    event.respondWith((async () => {
  const cachedResponse = await caches.match(event.request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(event.request);

  if (!response || response.status !== 200 || response.type !== 'basic') {
    return response;
  }

  if (ENABLE_DYNAMIC_CACHING) {
    const responseToCache = response.clone();
    const cache = await caches.open(DYNAMIC_CACHE)
    await cache.put(event.request, response.clone());
  }

  return response;
})());

  }); 