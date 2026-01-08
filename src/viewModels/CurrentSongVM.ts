import Song from "../models/Song";
import MyFileReader from "../MyFileReader";

/** Obiekt przechowujące wszystkie dane potrzebne do wyświetlenia wybranej piosenki */
export default class CurrentSong {
    public content: string = "";
    private songRepo: Song | undefined;     // źródło danych
    private reader: MyFileReader;           // narzędzie do odczytu danych
    private _onLoadEnd: ((text: string) => void) | undefined;
    private finished: boolean = true;
    private loadingProcess: Promise<string> | undefined

    public get isChosen() {
        return this.songRepo === undefined;
    };

    /** Callback wywoływany po załadowaniu danych  */
    public set onLoadEnd(v: (text: string) => void) {
        this._onLoadEnd = v;
        // Jakby listener został ustawiony po przygotowaniu danych
        if (this.finished) {
            v(this.content)
        }
    }

    constructor(reader: MyFileReader) {
        this.reader = reader;
    }

    public getTitle(): String {
        return this.songRepo?.toString() || "Coś poszło nie tak...";
    }

    /**
     * Ustawianie piosenki do wyświetlenia, odpowiada za przygotowanie danych, itp.
     * @param song - nowa piosenka do ustawienia
     */
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
     */
    public async getLyrics(): Promise<string> {
        if (this.loadingProcess !== undefined)
            this.content = await this.loadingProcess
        else
            this.content = "Nie znaleziono tekstu..."
        return this.content
    }
}