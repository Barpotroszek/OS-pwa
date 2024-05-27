export const pushState = (url: string,  refresh?: boolean) => {
    // making mark in history, adding url to history
    const e = new Error();
    console.trace("[pushState] to:", url, e.stack);
    window.history.pushState({ notFromUrl: true }, "", url)
    if (refresh)
        window.location.reload()
}

export const setBackCallback = (cb: any)=>{
    window.onpopstate = cb
}