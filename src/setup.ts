declare global {
  interface Window { homepage: string; }
}

export const relativeUrl = (target: string) => {
  return window.homepage + target;
};

const registerSW = (path: string) => {
  console.log("[SW] Regitsration")
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(relativeUrl(path)).then(function (registration) {
      console.debug("[SW] Service Worker Registered", registration);
      
      registration.onupdatefound = () => {
        // Check & notify if app needs to be update
        console.log("[SW] UPDATE: ", registration);
        const installer = registration.installing;
        if (installer)
          installer.onstatechange = () => {
            if (installer.state === "installed") {
              // sendConfirmation(registration)
            }
          }
      }
    })
      .catch(function (err) {
        console.debug("Service Worker Failed to Register", err);
      });
  }
  else console.debug("SW not supported")
}

const sendConfirmation = (reg: ServiceWorkerRegistration) => {
  // ask user if he want to update app
  // eslint-disable-next-line no-restricted-globals
  if (confirm("Dostępna jest akualizacja. Czy chcesz ją zainstalowac?")) {
    reg.update()
  }
}

const setupDarkModeListener = () => {
  window.addEventListener("message", (e) => {
    const data = e.data;
    if (data.darkMode === undefined) return;
    console.log(data);
    let theme = data.darkMode ? "dark" : "light"
    document.documentElement.setAttribute(
      "data-theme", theme
    );
    localStorage.setItem("theme", theme)
  });
}

const notifySW = ()=>{
    navigator.serviceWorker.controller!.postMessage({ caching: window.matchMedia("(display-mode: standalone)").matches })
}

export default function init() {
  window.homepage = "/OS-pwa/";
  setupDarkModeListener()
  // registerSW("sw.js");

  let theme = window.localStorage.getItem("theme"), mode;
  if (!theme)
    mode = window.matchMedia("(prefers-color-scheme: dark )").matches;
  else
    mode = theme === "dark";
  window.postMessage({ darkMode: mode });

  return;  
  // inform SW if PWA is installed
  if(navigator.serviceWorker.controller !== null)
    notifySW()
  else
    navigator.serviceWorker.oncontrollerchange = notifySW;

}

// window.addEventListener("popstate", e => {
//   alert("PopSTate")
//   const newUrl = (window.location),
//     trimmed = window.homepage.replace(/\/$/, '');
//   console.log(newUrl.href, newUrl.href.includes(trimmed))
// })