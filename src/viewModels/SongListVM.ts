import Filter from "../models/Filter";
import Song from "../models/Song";
import SongList from "../models/SongList";
import { LoadingStates } from "./LoadingStates"

export default class SongListVM {
    private currentList: Song[] = [];   // aktualnie wyświetlana lista
    private filter: Filter;             // aktualnie uzywany filtr
    private repo: SongList;             // repozytorium, źródło danych
    private _uiState: LoadingStates = LoadingStates.NOT_READY   // stan załodwania danych
    private _onLoadEnd: (() => void) = () => { };   // callback wywoływany po stworzeniu listy
    // private _uiState = LoadingStates.NOT_READY

    /** Ustawienie callbacku wywoływanego w momencie załadowania listy piosenek */
    public set onLoadEnd(callback: (() => void)) {
        this._onLoadEnd = callback;
        if (this._uiState === LoadingStates.FINISHED) {
            console.log("shit, they were faster")
            callback();
        }
        console.log("[SongListVM] Set callback :> ", this._onLoadEnd)
    }

    public get uiState(): LoadingStates {
        /** Stan przygotowania listy */
        return this._uiState
    }
    private set uiState(v: LoadingStates) {
        this._uiState = v;
    }

    constructor(sharedSongRepo: SongList) {
        this.repo = sharedSongRepo;
        this.filter = new Filter();
        console.log("[SongListVM] Constructor")
    }

    /** Dodawanie tagów wyszukania, alias dla Filter.addTag() */
    public addTag(value: number) {
        this.filter.addTag(value)
        //  console.log("Tag has been added")
    }

    /** Ustawianie tagu jako filtr, nadpisuje pozostałe tagi, alias dla Filter.setTag() */
    public setTag(value: number) {
        this.filter.setTag(value);
    }

    /** Usuwanie konkretnego tagu wyszukania, alias dla Filter.removeTag() */
    public removeTag(value: number) {
        this.filter.removeTag(value)
    }

    /** Usuwanie wyszstkich tagów filtru, aliad dla Filter.clearTags*/
    public clearTags() {
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
        this._uiState = LoadingStates.LOADING
        this.repo.fetchList(this.filter).then(list => {
            this.currentList = list;
            this._uiState = LoadingStates.FINISHED;
            console.debug("[SongListVM] List has been fetched, running callback:")
            if (this._onLoadEnd)
                this._onLoadEnd();
        }).catch(e => alert(e))

    }

    /**
     * Zwraca listę odfiltrowanych piosenek pobranych z repo
     * @returns Lista piosenek pobrana z repo
     */
    public getList(): Song[] {
        console.debug("[SongListVM] Getting list of songs")
        // console.log(this.currentList)
        return this.currentList
    }
}