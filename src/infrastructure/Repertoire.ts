import { callbackWithBoolean, callbackWithoutArgument } from "./types/global";

type RepertoireTarget = "Wejście" | "Ofiarowanie" | "Komunia" | "Uwielbienie" | "Zakończenie";
export const repertoireTargets = ["Wejście", "Ofiarowanie", "Komunia", "Uwielbienie", "Zakończenie"];

class Repertoire {
    private data: Map<string, number> = new Map();
    private importedPromptDisplayed = false;
    public displayPrompt: callbackWithoutArgument = () => { };
    public displayShareLinkPrompt: callbackWithoutArgument = () => { };
    public _displayImportedPrompt: callbackWithoutArgument | null = null;
    private _onUpdate: callbackWithoutArgument | undefined;
    public setAddSongButtonDisabled: callbackWithBoolean = (t) => {
     //  console.log("[Repertoire] Adding btn disabler not assigned")
    }

    public set onUpdate(callback: () => void) {
        this._onUpdate = () => {
            callback()
        };
    }

    public set displayImportedPrompt(v: callbackWithoutArgument) {
        this._displayImportedPrompt = v;
        if (this.importedPromptDisplayed) {
            v();
        }
    }

    public get displayImportedPrompt() {
        if (this._displayImportedPrompt === null) {
            this.importedPromptDisplayed = true;
            // console.log("[Repertoire displayImportedPrompt] runned before assignement")
            return () => { }
        }
        return this._displayImportedPrompt
    }

    constructor(songs?: number[]) {
     //  console.log("[Repertoire] New construction")
        let found;
        repertoireTargets.forEach((name) => {
            found = localStorage.getItem(name);
            if (found === null)
                return;
            this.data.set(name, Number(found));
        })
        if (songs) {
            songs.forEach((v, index) => {
                if (index > 4) return;
                this.data.set(repertoireTargets[index], v);
            })
        }
    }

    public setSong(target: RepertoireTarget | string, songID: number) {
        localStorage.setItem(target, songID.toString());
        this.data.set(target, songID);
        if (this._onUpdate !== undefined)
            this._onUpdate();
     //  console.log(this.data)
    }

    public getSong(target: RepertoireTarget | string): number {
        let k = this.data.get(target);
        if (k === undefined)
            return 0;
        return k
    }

    /** Czyszczenie całego repertuaru, usunięcie wszystkich pozycji */
    public clear() {
        this.data.clear()
        repertoireTargets.forEach(t => localStorage.removeItem(t))
        if (this._onUpdate !== undefined)
            this._onUpdate();
    }

    /** Zwraca zakodowany w Base64 string */
    public export(): string {
        // każda wartość zajmuje 12n bitów(od 0 do 11)
        // maksymalna wartość: 4096 
        let arr: number[] = [];
        repertoireTargets.forEach(name => arr.push(this.getSong(name)))
        return btoa(arr.join(','));
    }


    /** Na podstawie query zakodowanego w Base64 odczytywany jest cały repertuar */
    public import(query: string) {
        let data = atob(query),
            arr = data.split(",");
        arr.forEach((elem, idx) => {
            this.setSong(repertoireTargets[idx], Number(elem));
        })
        // console.log("[Repertire import]", this.data);
        if (repertoire._onUpdate)
            repertoire._onUpdate();
    }
}
const repertoire = new Repertoire()
export default repertoire;