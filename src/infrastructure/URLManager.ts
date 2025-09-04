export default class URLManager {
    private static _me: URLManager;
    private homepage = "/OS-pwa";
    private static location = new URL(window.location.href)

    private constructor() {
        URLManager._me = new URLManager()
    }

    public static pushState(url: string, refresh: boolean = false) {
        window.history.pushState({ notFromUrl: true }, "", url)
        if (refresh)
            window.location.reload()
    }

    public static setSearchParam(name: string, value: string) {
        this.location.searchParams.set(name, value);
        this.pushState(this.location.href);
    }

    public static deleteSearchParam(name: string) {
        this.location.searchParams.delete(name);
        this.pushState(this.location.href);
    }

    public static relativePath(url: string): string {
        let loc = this.location.pathname.replace(/\/$/,'') + url;
        console.log({loc})
        return loc
    }
}