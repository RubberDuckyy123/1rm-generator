const CACHE_NAME = "one-rm-v2";

const FILES_TO_CACHE = [
  "/1rm-generator/",
  "/1rm-generator/index.html",
  "/1rm-generator/awesomeStyle.css",
  "/1rm-generator/awesomeScript.js",
  "/1rm-generator/RankingData.js",
  "/1rm-generator/Icons/SmallIcon.png",
  "/1rm-generator/Icons/BigIcon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );

});
