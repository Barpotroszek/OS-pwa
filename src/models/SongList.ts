import {  STORAGE_FILE } from "src/infrastructure/constants";
import MyFileReader from "../MyFileReader";
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
    return this.reader.readToJSON(STORAGE_FILE).then(data => {
      // console.log("[SongList] Song Data:", data)

      Object.entries(data.titles).forEach(([n, v]) => { 
        // console.log("[SongList] Data:", Number(n),v)
        this.mainList.push(new Song(Number(n), v as string, data.tags[n]))
      })
    }).catch(e => console.debug("[SongList] Problem z ładowaniem"))
  }

  public fetchList(filter: Filter): Promise<Song[]> {
    return new Promise(async (res, rej) => {
      await this.loadingProcess;
      res(this.mainList.filter((s) => filter.validateSong(s)))
    });
  }

  public getSong(id: number): Song{
    let t= this.mainList.find(v => v.id===id)
    if(t=== undefined)
      t = new Song(0, "Coś poszło nie tak...")
    return t;
  }
}