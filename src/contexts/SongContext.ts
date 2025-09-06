import { createContext } from "react";
import { callbackWithNumber } from "src/infrastructure/types/global";

export interface SongContextInterface {
    setNewSong: callbackWithNumber,
    isSongChosen: boolean
}
export const SongContext = createContext<SongContextInterface | null>(null)