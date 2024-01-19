importScripts('js/sw-utils.js');

const STATIC = 'static-4';
const DYNAMIC = 'dynamic-2';
const INMUTABLE = 'inm-1';

const APP_SHELL = [
    // '/',
    'index.html',
    'js/app.js',
    'js/sw-utils.js',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg', 
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg', 
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
]

const APP_SHELL_INM = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]

self.addEventListener('install', e => {

    const cacheSatic = caches.open(STATIC)
        .then(cache => cache.addAll( APP_SHELL));

    const cacheINM = caches.open(INMUTABLE)
        .then(cache => cache.addAll( APP_SHELL_INM));

    e.waitUntil(Promise.all([cacheSatic, cacheINM]));
});

self.addEventListener('activate', e => {

const respuesta = caches.keys()
        .then( keys => {
            keys.forEach( key => {
                if (key !== STATIC && key.includes('static')) {
                    return caches.delete(key)}
                    if (key !== DYNAMIC && key.includes('dynamic') ) {
                        return caches.delete(key);
                    }
                })
        })

    e.waitUntil(respuesta);
})

self.addEventListener('fetch', e => {
	
    if(!e.request.url.includes('http')) return;

    const respuesta = caches.match( e.request)
        .then( res =>{
            if (res) {
                return res;
            } else {
                return fetch( e.request )
                    .then( newRes => {
                        return actualizarCacheDinamico(DYNAMIC, e.request, newRes );
                    });
            }
        });
    e.respondWith( respuesta );
})