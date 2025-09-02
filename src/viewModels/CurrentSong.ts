import Song from "../models/Song";
import MyFileReader from "../MyFileReader";

export default class CurrentSong {
    public content: string = "";
    private songRepo: Song | undefined;
    private reader: MyFileReader;
    private loadingProcess: Promise<string> | undefined
    // private uiState: LoadingStates;

    public onLoadEnd: () => void = () => { };

    constructor(reader: MyFileReader) {
        this.reader = reader;
    }

    public getTitle(): String{
        return this.songRepo?.toString() || "Coś poszło nie tak..." ;
    }

    public setNewSong(song: Song | undefined){
        this.songRepo = song;
        if(this.songRepo == undefined)
            this.content = "Nie znaleziono tekstu...";
        else
            this.loadingProcess = this.songRepo.fetchLyrics(this.reader)
    }

    /**
     * Pobieranie tekstu piosenki za pośrednictwem (jakiegoś) readera
     */
    public async getLyrics(): Promise<string> {
        if(this.loadingProcess != undefined)
            this.content = await this.loadingProcess
        else
            this.content = "Nie znaleziono tekstu..."
        return this.content
    }
}