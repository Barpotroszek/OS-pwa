export const relativeUrl = (target: string) => {
  return window.homepage + target;
};

const registerSW = (path: string) => {
  console.log("[SETUP] Registration", {homepage: window.homepage, path})

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(relativeUrl(path), {
      scope: window.homepage
    }).then(function (registration) {
      if (registration.installing)
        console.debug("[SETUP] Service Worker installing");
      else if (registration.waiting)
        console.debug("[SETUP] Service Worker installed");
      else if (registration.active)
        console.debug("[SETUP] Service Worker active :>");

      window.registration = registration;
   //  console.log({ registration })
      // console.debug("[SW] Service Worker Registered", registration);

      registration.onupdatefound = () => {
        // Check & notify if app needs to be update
     //  console.log("[SW] UPDATE: ", registration);
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
    // console.log(data);
    let theme = data.darkMode ? "dark" : "light"
    document.documentElement.setAttribute(
      "data-theme", theme
    );
    localStorage.setItem("theme", theme)
  });
}

export const enableCaching = () => {
  // Wyślij mu polecenie, żeby wszystko co ma już po prostu cachował
  // navigator.serviceWorker.controller!.postMessage({ caching: window.matchMedia("(display-mode: standalone)").matches })
  if (window.registration.active !== undefined && window.registration.active !== null)
    window.registration.active.postMessage({ caching: true })
}

export default function init() {
  window.homepage = "/OS-pwa/";
  console.log("[INIT] HomePage:", window.homepage)
  // setupDarkModeListener()

  // registerSW("sw.js");

  return;
  // TODO: Not working - repair
  // inform SW if PWA is installed
  if (navigator.serviceWorker.controller !== undefined && navigator.serviceWorker.controller !== null)
    enableCaching()
  else
    navigator.serviceWorker.oncontrollerchange = enableCaching;

}

// window.addEventListener("popstate", e => {
//   alert("PopSTate")
//   const newUrl = (window.location),
//     trimmed = window.homepage.replace(/\/$/, '');
////  console.log(newUrl.href, newUrl.href.includes(trimmed))
// })