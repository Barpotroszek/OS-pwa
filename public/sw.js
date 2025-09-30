/* eslint-disable no-restricted-globals */
const version = "1.0.3",
  files = [
    "",
    "manifest.json",
    // "https://fonts.googleapis.com/css?family=Ubuntu+Condensed|Ubuntu:300,300i,400,500&display=swap",
  ],
  CACHE_NAME = "os-app-v" + version,
  CACHE_DYNAMIC = "CACHE_DYNAMIC-v" + version,
  CACHE_FILES_TEST = new RegExp("\\.(?:html|css|js|json|md|png|svg|ico)$");

let caching = false;

function addResourcesToCache(url, res) {
  // console.log("[SW] trying to add resource:", url);
  if (!CACHE_FILES_TEST.test(url)) {
    // console.log("[SW] Changed my mind");
    return;
  }
  return caches.open(CACHE_NAME).then((cache) => {
    // console.log("[SW] saving to cache", res);
    cache.put(url, res).catch(console.error);
  });
}

function getCache(url) {
  // console.log("[SW]", { url });
  return caches.match(url).then((r) => {
    console.debug("[SW] From CACHE");
    if (r) {
      // console.log("[SW] cached resoruce: ", r);
    }
    return r;
  });
}

function makeFetch(url) {
  return fetch(url).then((resp) => {
    // console.log("[SW] Resp status:", resp);
    if (resp && resp.status == 200) {
      console.debug("[SW] Fetch from web", url);
      addResourcesToCache(url, resp.clone());
      return resp;
    }
  });
}

function getResponse(url, cachingFirst = false) {
  return new Promise(async (res, rej) => {
    if (cachingFirst) {
      let r = await getCache(url);
      if (r.ok) return res(r);
      // console.log("[SW] nothing found in cache... making fetch")
      try {
        r = await makeFetch(url);
        if (r.ok) return res(r);
        // console.log("[SW] nope, not working...")
      } catch (error) {
      } finally {
        return new Response("Coś poszło nie tak...", { status: 404 });
      }
    } else {
      try {
        r = await makeFetch(url);
        if (r) return res(r);
      } catch (error) {
        let r = await getCache(url);
        if (r) return res(r);
        return new Response("Coś poszło nie tak...", { status: 404 });
      }
    }
  });
}

self.addEventListener("fetch", (event) => {
  // console.log("[SW] Fetching something ...", event.request.url);
  event.respondWith(getResponse(event.request.url, false));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  // console.log("[SW] Active!!!", event);
});

self.addEventListener("install", (event) => {
  // console.log("[SW] INSTALL ", version);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // console.log("[SW] Caching resources");
      return cache.addAll(files).finally(() => {
        // console.log("[SW] All resources have been fetched and cached.");
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("message", (ev) => {
  // To get if PWA is installed
  console.log("[SW] MESSAGE");
  console.log("[SW]", ev);
  caches
    .open(CACHE_NAME)
    .then(async (cache) => {
      console.log(ev.data.url);
      const data = await fetch(ev.data.url);
      data.json().then((t) => {
        Object.keys(t.titles).forEach((id) => cache.add(`store/${id}.md`));
      });
    })
    .catch((e) => console.log("[SW] Failed to open CACHE:", e));
});
