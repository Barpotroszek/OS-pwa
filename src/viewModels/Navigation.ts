import SongList from "src/models/SongList";
import SongListVM from "./SongListVM";
import URLManager from "src/infrastructure/URLManager";
import CurrentSongVM from "./CurrentSongVM";
import MyFileReader from "src/MyFileReader";
import { callbackWithNumber } from "src/infrastructure/types/global";

export default class Navigation {
    private songListVM: SongListVM;
    private currentSongVM: CurrentSongVM;
    private songListRepo: SongList;
    private _onCurrentSongUpdate: callbackWithNumber<void>[] = [];
    private _onTagUpdate: callbackWithNumber<void> | undefined;
    private _onListLoaded: (() => void) | undefined;

    public set onCurrentSongUpdate(f: callbackWithNumber<void>) {
        this._onCurrentSongUpdate.push(f);
    };

    public set onListLoaded(f: () => void) {
        this._onListLoaded = f;
        this.songListVM.onLoadEnd = f;
    }

    constructor(songListRepo: SongList, reader: MyFileReader) {
        console.debug("[Navigation] Constructor :<")
        this.songListRepo = songListRepo;
        this.songListVM = new SongListVM(songListRepo);
        this.currentSongVM = new CurrentSongVM(reader);
        console.log("[Navigation]", this.currentSongVM)
    }

    setTag(tag: number) {
        URLManager.setSearchParam("tag", tag.toString());
        this.songListVM.setTag(tag);
        this.songListVM.fetchSongsFromRepo();

        // TODO: ogarnąć jakoś te referencje i inne cuda... 
        // * chyba najlepszym pomysłem będzie po prostu opakować to w... no wiadomo czym xd
        // @ts-ignore
        // ! categoriesNavRef.current.classList.remove("active");


        // Na wypadek, jakby aktualnie była wyświetlana jakaś piosenka:
        this.exitSongView();
        if (this._onTagUpdate)
            this._onTagUpdate(tag);
    }

    setChosenSong(id: number) {
        URLManager.setSearchParam("id", String(id));
        console.log("[Navigation] Teraz ja:", this);
        if (this.currentSongVM === undefined) {
            console.warn("[Navigation] Ty, kurde, currentSongVM jest undefined. XDD")
            return;
        }
        this.currentSongVM.setNewSong(this.songListRepo.getSong(id));

        this._onCurrentSongUpdate.forEach(cb => cb(id))
    }

    exitSongView() {
        console.log("[Navigation] ExitSongView")
        URLManager.deleteSearchParam("id");
        this.currentSongVM?.setNewSong(undefined);
        this._onCurrentSongUpdate.forEach(cb => cb(0))
    }

    exitTagView() {
        console.log("[Navigation] Exit Tag View")
        URLManager.deleteSearchParam("tag");
        this.songListVM.clearTags();
        if (this._onTagUpdate)
            this._onTagUpdate(0);
        // Wymuszenie ponownego załadowania listy
        this.songListVM.fetchSongsFromRepo();
    }

    get isSongChosen() {
        return this.currentSongVM.isChosen
    }

    get songList() {
        return this.songListVM
    }

    getCurrentSong() {
        return this.currentSongVM;
    }
}