import MyFileReader from "../MyFileReader";
import CurrentSong from "../viewModels/CurrentSong";
import Filter from "./Filter";
import Song from "./Song";

export default class SongList {
  private mainList: Song[];
  public loadingProcess: Promise<any>;
  private reader: MyFileReader;

  constructor(reader: MyFileReader) {
    this.mainList = [];
    this.reader = reader;
    this.loadingProcess = this._fetchList();
  }

  private _fetchList(): Promise<void | Song[]> {
    return this.reader.readToJSON("storage.json").then(data => {
      // console.log(data)
      Object.entries(data).forEach(([n, v]) => {
        this.mainList.push(new Song(Number(n), v as string))
      })
    })
  }

  public fetchList(filter: Filter): Promise<Song[]> {
    return new Promise(async (res, rej) => {
      await this.loadingProcess;
      res(this.mainList.filter((s) => filter.validateSong(s)))
    });
  }

  public getSong(id: number): Song{
    let t= this.mainList.find(v => v.id == id)
    if(t== undefined)
      t = new Song(0, "Coś poszło nie tak...")
    return t;
  }
}