import MyFileReader from "../MyFileReader";

export default class Song {
    private readonly _id: number = 0;
    private readonly _title: string = "";
    private readonly _tags: number = 0;
    private readonly _file: string = "";
    private readonly reader: MyFileReader | undefined;

    constructor(id: number, title: string, tags?: number, file?: string) {
        if(Number.isNaN(id))
            console.log(id, title);
        this._id = id;
        this._title = title;
        this._tags = tags ? tags : 0;
        this._file = file ? file : "";
    }

    public get id(): number {
        return this._id;
    }
    public get tags(): number {
        return this._tags;
    }
    /**
     * Pobranie tekstu za pośrednictwem zdefiniowanego readera
     */
    public fetchLyrics(reader: MyFileReader) {
        let path: string;
        if (this._file !== "")
            path = this._file
        else
            path = this._id + ".md"

        return reader.readToText(path)
    }

    toString = () => {
        return `${this._id}. ${this._title}`
    }
}