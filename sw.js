/* eslint-disable no-restricted-globals */

const version = "1.0.3",
  files = [
    "index.html",
    "manifest.json",
    "json/data-3.json",
    "https://fonts.googleapis.com/css?family=Ubuntu+Condensed|Ubuntu:300,300i,400,500&display=swap",
  ],
  CACHE_NAME = "os-app",
  CACHE_DYNAMIC = "os-app-dynamic";

let caching = false;

self.addEventListener("install", (event) => {
  console.log("[SW] INSTALL ", version);
});

function saveCache(req, res) {
  return caches.open(CACHE_NAME).then((cache) => {
    console.log("[SW oper] saving to cache", res);
    cache.put(req, res).catch(console.error);
  });
}

function cacheFirst(req) {
  return caches.match(req).then((res) => {
    if (res) {
      console.debug("[SW] Matched", res);
      // saveCache(req, res.clone());
      return res;
    }
    console.log("[SW] not matched, downloading", req.url);
    return fetch(req).then((resp) => {
      if (!resp || resp.status !== 200) {
        console.debug("[SW] Problem to fetch from web");
        return resp;
      }
      try {
        if (req.url.contains("hot-update")) return resp;
      } catch (error) {}
      if(caching)
        saveCache(req, resp.clone());
      return resp;
    });
  });
}

function fetchFirst(req) {
  return fetch(req)
    .then((resp) => {
      if (resp && resp.status == 200) {
        console.debug("[SW] Fetch from web");
        saveCache(req, resp.clone());
        return resp;
      }
    })
    .catch((error) => {
      console.debug("[SW} Not fetching...");
      return caches.match(req).then((r) => {
        console.debug("From CACHE");
        if (r) return r;
        else {
          alert("Bez połączenia dużo nie zrobimy...");
        }
      });
    });
}

const offlineMode = (event) => {
  return caches.match(event.req).then((r) => {
    console.debug("[SW] From CACHE");
    if (r) return r;
    else {
      alert("Bez połączenia dużo nie zrobimy...");
    }
  });
};

const fetchWrapper = (event) => {
  const req = event.request;
  console.log("[SW] event.request:", req.url);
  if (!caching) files.push(req.url);
  event.respondWith(cacheFirst(event.request));
};

self.addEventListener("fetch", fetchWrapper);

self.addEventListener("activate", (event) => {
  console.log("[SW] Active!!!", event);
  self.clients.claim();
});

self.addEventListener("message", (ev)=>{
  // To get if PWA is installed
  console.log("[SW] MESSAGE")
  console.log("[SW]", ev)
  const data  = ev.data;
  if(data.caching){
    caching = true;
    caches.open(CACHE_NAME).then(cache=>{
      cache.addAll(files);
    })
  }
  if(data.caching === false)
    data.caching = false;
});
