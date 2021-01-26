const staticDiscontinued = ['netune-v1.0', 'netune-v2.0'];
const staticNetune = 'netune-v3.0';
const assets = [
    '/index.html',
    '/css/app.css',
    '/css/fa-all.min.css',
    '/js/app.js',
    '/images/wallpaper-02.jpg',
    '/vendor/pillar/pillar.js',
    '/vendor/pillar/jquery.js',
    '/vendor/pillar/app.css',
    '/vendor/framework7/framework7.css',
    '/vendor/framework7/framework7.js',
    '/vendor/framework7/framework7-bundle.min.js.map',
    '/vendor/omni/client.js',
    '/modules/app.js',
    '/modules/config.js',
];

caches.keys().then((keys) => {
    keys.forEach((key) => {
        caches.delete(key);
    });
});

for (let i = 0; i < staticDiscontinued.length; i++) {
    const name = staticDiscontinued[i];
    caches.open(name).then((cache) => {
        cache.keys().then((keys) => {
            keys.forEach((key) => {
                caches.delete(key);
            });
        });
    });
}

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(staticNetune).then(cache => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            return res || fetch(e.request);
        })
    );
});