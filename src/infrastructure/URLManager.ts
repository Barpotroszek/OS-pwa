class URLManager {
    private homepage = "/OS-pwa";
    private location = new URL(window.location.href)

    public pushState(url: string, refresh: boolean = false) {
        window.history.pushState({ notFromUrl: true }, "", url)
        if (refresh)
            window.location.reload()
    }

    public setSearchParam(name: string, value: string) {
        this.location.searchParams.set(name, value);
        this.pushState(this.location.href);
    }

    public getSearchParam(name: string): string | null {
        return this.location.searchParams.get(name)
    }

    public deleteSearchParam(name: string) {
        this.location.searchParams.delete(name);
        this.pushState(this.location.href);
    }

    public relativePath(url: string): string {
        let loc = this.location.pathname.replace(/\/$/, '') + url;
        return loc
    }

    public createURLwithSearchParam(key: string, value: string){
        console.log("[URLManager] Creating new URL")
        const loc = new URL(this.location);
        loc.search = "";
        loc.searchParams.set(key, value);
        return loc.href;
    }

    public log(){
        console.log("[URLManager]", {location: this.location})
    }
}

const manager = new URLManager();
export default manager;