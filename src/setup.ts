declare global {
  interface Window { homepage: string; }
}

export const relativeUrl = (target: string) => {
  return window.homepage + target;
};

const registerSW = (path: string) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(relativeUrl(path)).then(function (registration) {
      console.debug("Service Worker Registered", registration);
    })
      .catch(function (err) {
        console.debug("Service Worker Failed to Register", err);
      });
  }
  else console.debug("SW not supported")
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

export default function init() {
  window.homepage = "/OS-pwa/";
  setupDarkModeListener()
  registerSW("sw.js");

  let theme = window.localStorage.getItem("theme"), mode;
  if (!theme)
    mode = window.matchMedia("(prefers-color-scheme: dark )").matches;
  else
    mode = theme === "dark";
  window.postMessage({ darkMode: mode });
}

  // window.addEventListener("popstate", e => {
  //   alert("PopSTate")
  //   const newUrl = (window.location),
  //     trimmed = window.homepage.replace(/\/$/, '');
  //   console.log(newUrl.href, newUrl.href.includes(trimmed))
  // })