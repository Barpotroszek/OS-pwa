const version = "1.0.2",
  files = [
    "/",
    "/index.html",
    "manifest.json",
    "https://fonts.googleapis.com/css?family=Ubuntu+Condensed|Ubuntu:300,300i,400,500&display=swap",
  ],
  CACHE_NAME = "os-app",
  CACHE_DYNAMIC = "os-app-dynamic";

self.addEventListener("install", (event) => {
  console.log("[SW] Instalacja");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(files);
    })
  );
});

function saveCache(req, res) {
  return caches.open(CACHE_NAME).then((cache) => {
    console.log("[SW oper] saving to cache", res);
    cache.put(req, res);
  });
}

function cacheFirst(req) {
  return caches.match(req).then((r) => {
    if (r) {
      console.log("[SW] Matched", r);
      saveCache(r.clone());
      return r;
    }
    console.log("[SW] not matched, downloading", req.url);
    return fetch(req).then((resp) => {
      if (!resp || resp.status !== 200) {
        console.log("[SW] Problem to fetch from web");
        return resp;
      }
      return saveCache(req, resp);
    });
  });
}

function fetchFirst(req) {
  return fetch(req).then((resp) => {
    if (resp && resp.status == 200) {
      console.log("[SW] Fetch from web");
      saveCache(req, resp.clone());
      return resp;
    }
    }).catch(error=>{
    console.log("Not fetching...")
    return caches.match(req).then((r) => {
        console.log("From CACHE");
        if (r) return r;
        else {
          alert("Bez połączenia dużo nie zrobimy...");
        }
    });
  });
}

const offlineMode = (event)=> {
  return caches.match(event.req).then((r) => {
    console.log("From CACHE");
    if (r) return r;
    else {
      alert("Bez połączenia dużo nie zrobimy...");
    }
});
}

const fetchWrapper = (event) => {
  const req = event.request;
  console.log("[SW] event.request:", req.url);
  event.respondWith(cacheFirst(event.request));
}

self.addEventListener("fetch", fetchWrapper);

self.addEventListener("activate", (event) => {
  console.log("[SW] Active!!!", event);
  self.clients.claim();
});

// self.addEventListener("message", (ev)=>{
//   if(ev.data.offlineMode){
//     self.removeEventListener("fetch", fetchWrapper, true)
//     self.addEventListener("fetch", offlineMode)
//   }
//   else{
//     self.removeEventListener("fetch", offlineMode, true)
//     self.addEventListener("fetch", fetchWrapper)
//   }
// })
