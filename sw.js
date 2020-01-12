const CacheName = 'restaurant-static-1';


//install service worker
self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(CacheName).then(function(cache){
            console.log(cache);
            return cache.addAll([
                '/',
                '/sw.js',
                '/index.html',
                '/restaurant.html',
                '/js/main.js',
                '/js/dbhelper.js',
                '/js/restaurant_info.js',
                '/css/styles.css',
                '/css/responsive.css',
                '/img/',
                '/data/restaurants.json',
                '/restaurants.json'
            ]);
        })
    )
});


//activate service worker
self.addEventListener('activate',function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.filter(function(cacheName){
                    return cacheName.startsWith('retaurant.')&&
                    cacheName != staticCacheName;
                }).map(cacheName=>{
                    return caches.delete(cacheName);
                })
            );
        }));
    console.log('service worker activated');
});

/*Please take a look at the URL in Restaurant Info screen, 
it's http://localhost:8000/restaurant.html?id=1 so even though you stored
restaurant.html in the cache but it still hasn't found this in the cache, 
you should remove the query behind the /restaurant.html and it will work 
with every restaurant.
Check out the ignoreSearch in the external resource below to get it working
External Resources :books:
https://developer.mozilla.org/en-US/docs/Web/API/Cache/match */

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request).then(function(response){
            return response || fetch(event.request);
        })
    );
});

