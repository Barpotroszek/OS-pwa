import Song from "./Song";

export default class Filter {
    private query: string = "";
    private rgx: RegExp = RegExp("");
    private tags: number = 0;

    constructor(){
        // console.log("Stworzono nowy Filter;\n", this.rgx)
    }

    /**
     * Dodanie tekstu do wyszukiwania w filtrach
     * 
     * @param query jaki tekst ma być wyszukany
     */
    public setSearchQuery(query: string) {
        this.rgx = RegExp(this.query.replace(" ", ".*"))
        this.query = query;
        // if(this.onFiltersChange != undefined)
        //     this.onFiltersChange();
    }

    /**
     * Dodawanie tagu do wyszukiwanych
     * @param value wartość/ID tagu
     */
    public addTag(value: number) {
        this.tags |= value;
        // if(this.onFiltersChange != undefined)
        //     this.onFiltersChange();
    }

    /**
     * Usuwanie tagu z filtrów
     * 
     * @param value wartość/ID tagu
     */
    public removeTag(value: number) {
        this.tags &= ~value;
        // if(this.onFiltersChange != undefined)
        //     this.onFiltersChange();
    }

    /**
     * Czyszczenie filtrów
     */
    public reset(){
        this.query = "";
        this.tags = 0;
    }

    public validateSong(song: Song){
        if(song.toString().search(this.rgx) >= 0)
            return true;
        return false;
    }

    /**
     * @deprecated
     * 
     * 
     * Zastosowanie zdefiniowanych filtrów na podanej liście
     * @returns odfiltrowana lista typu Song[]
     */
    public apply(songList: Song[]) {
        const list: Song[] = [];
        songList.forEach(song => { 
            if(song.toString().search(this.rgx) < 0)
                return;
            list.push(song);
        })
    
        return list;
    }

}