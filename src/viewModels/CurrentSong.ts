import Song from "../models/Song";
import MyFileReader from "../MyFileReader";

export default class CurrentSong {
    public content: string = "";
    private songRepo: Song | undefined;
    private reader: MyFileReader;
    private _onLoadEnd: ((text: string) => void) | undefined;
    private finished: boolean = true;
    private loadingProcess: Promise<string> | undefined
    // private uiState: LoadingStates;

    public set onLoadEnd(v: (text: string) => void) {
        this._onLoadEnd = v;
        if (this.finished) {
            // Jakby nie zdązył ustawić listenera, a skończył już prace
            // console.log("[CurrentSong] Shit, they were faster")
            v(this.content)
        }
    }

    constructor(reader: MyFileReader) {
        this.reader = reader;
    }

    public getTitle(): String {
        return this.songRepo?.toString() || "Coś poszło nie tak...";
    }

    public setNewSong(song: Song | undefined) {
        this.finished = false;
        this.songRepo = song;
        console.debug("[CurrentSong] Ustawianie nowej piosenki")
        if (this.songRepo === undefined)
            this.content = "Nie znaleziono tekstu...";
        else
            this.songRepo.fetchLyrics(this.reader).then((t) => {
                this.finished = true;
                this.content = t
                if (this._onLoadEnd !== undefined) this._onLoadEnd(t)
            })
    }

    /**
     * Pobieranie tekstu piosenki za pośrednictwem (jakiegoś) readera
     * @deprecated
     */
    public async getLyrics(): Promise<string> {
        if (this.loadingProcess !== undefined)
            this.content = await this.loadingProcess
        else
            this.content = "Nie znaleziono tekstu..."
        return this.content
    }
}