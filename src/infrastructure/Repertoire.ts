import { callbackWithBoolean, callbackWithoutArgument } from "./types/global";

type RepertoireTarget = "Wejście" | "Ofiarowanie" | "Komunia" | "Uwielbienie" | "Zakończenie";
export const repertoireTargets = ["Wejście", "Ofiarowanie", "Komunia", "Uwielbienie", "Zakończenie"];

class Repertoire {
    private data: Map<string, number> = new Map();
    public displayPrompt: callbackWithoutArgument= () => { };
    private _onUpdate: callbackWithoutArgument | undefined;
    public setAddSongButtonDisabled: callbackWithBoolean = (t)=>{
        console.log("[Repertoire] Adding btn disabler not assigned")
    }

    /** Ustawia callback, jeśli nie był on wcześniej zdefiniwany */
    public set onUpdate(callback: () => void) {
        this._onUpdate = () => {
            callback()
        };
    }

    constructor(songs?: number[]) {
        console.log("[Repertoire] New construction")
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
        console.log(this.data)
    }

    public getSong(target: RepertoireTarget | string) {
        let data = this.data.get(target)
        // console.log("[Repertoire] getting", target, '=>', data)
        return data
    }
    /** Czyszczenie całego repertuaru, usunięcie wszystkich pozycji */
    public clear(){
        this.data.clear()
        repertoireTargets.forEach(t=>localStorage.removeItem(t))
        if (this._onUpdate !== undefined)
            this._onUpdate();
    }

    public export(): string {
        // TODO: Zaimplementować to
        return ""
    }
}
const repertoire = new Repertoire()
export default repertoire;