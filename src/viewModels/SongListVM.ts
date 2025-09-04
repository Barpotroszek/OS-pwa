import Filter from "../models/Filter";
import Song from "../models/Song";
import SongList from "../models/SongList";
import { LoadingStates } from "./LoadingStates"

export default class SongListVM {
    private currentList: Song[] = [];
    private filter: Filter;
    private repo: SongList;
    private _uiState: LoadingStates = LoadingStates.LOADING
    private _onLoadEnd: (() => void) = () => { };
    // private _uiState = LoadingStates.NOT_READY

    public set onLoadEnd(callback: (() => void)) {
        this._onLoadEnd = callback;
        if (this._uiState === LoadingStates.FINISHED){
            console.log("Finished before setup !!!")
            callback();
        }
    }

    public get uiState(): LoadingStates {
        return this._uiState
    }
    private set uiState(v: LoadingStates) {
        this._uiState = v;
    }

    constructor(sharedSongRepo: SongList) {
        this.repo = sharedSongRepo;
        this.filter = new Filter();
        // this.fetchSongsFromRepo();
        // console.log("Filter in constructor:", this.filter)
    }

    /** Dodawanie tagów wyszukania, alias dla Filter.addTag() */
    public addTag(value: number) {
        this.filter.addTag(value)
        console.log("Tag has been added")
    }

    /** Ustawianie tagu jako filtr, nadpisuje pozostałe tagi, alias dla Filter.setTag() */
    public setTag(value: number){
        this.filter.setTag(value);
    }

    /** Usuwanie tagów wyszukania, alias dla Filter.removeTag() */
    public removeTag(value: number) {
        this.filter.removeTag(value)
    }

    public clearTags(){
        this.filter.clearTags();
    }

    /** Ustawianie tekstu do wyszukania, alias dla Filter.setSearchQuery() */
    public setSearchQuery(value: string) {
        this.filter.setSearchQuery(value)
    }

    /** Resetowanie filtrów, alias dla Filter.reset() */
    public clearFilters() {
        this.filter.reset();
    }

    /**
     * Uruchomienie pobierania piosenek z zadanego repo stosując zadane filtry;
     * żeby otrzymać listę - uzyć metody **getList()**
     */
    public fetchSongsFromRepo() {
        // console.log("Filter in fetch:", this.filter)
        this.repo.fetchList(this.filter).then(list => {
            this.currentList = list;
            this._uiState = LoadingStates.FINISHED;
            console.log("List has been fetched, running callback:")
            if (this._onLoadEnd)
                this._onLoadEnd();
        }).catch(e => alert(e))

    }

    /**
     * Zwraca listę odfiltrowanych piosenek pobranych z repo
     * @returns Lista piosenek pobrana z repo
     */
    public getList(): Song[] {
        console.log("Downloading list of songs")
        console.log(this.currentList)
        return this.currentList
    }
}