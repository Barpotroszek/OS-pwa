import { createContext } from "react";
import { callbackWithNumber } from "src/infrastructure/types/global";
import Song from "src/models/Song";
import SongList from "src/models/SongList";
import SongListVM from "src/viewModels/SongListVM";

export interface SongContextInterface {
    setNewSong: callbackWithNumber<void>,
    isSongChosen: boolean,
    list: SongListVM
    repo: SongList
    getSong: callbackWithNumber<Song>
}
export const SongbookContext = createContext<SongContextInterface | null>(null)