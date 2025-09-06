import React, { FormEventHandler, useRef } from "react";
import "../styles/repertoireSongPrompt.css";
import repertoire from "src/infrastructure/Repertoire";
import URLManager from "src/infrastructure/URLManager";

export default function RepertoireSongPrompt() {
  const ref = useRef<HTMLFormElement>(null),
    selectRef = useRef<HTMLSelectElement>(null);

  const displayPrompt = () => ref.current?.classList.add("active");
  const hidePrompt = () => ref.current?.classList.remove("active");
  repertoire.displayPrompt = displayPrompt;

  const onSubmit: FormEventHandler = (event) => {
    let songID;
    event.preventDefault();
    if ((songID = URLManager.getSearchParam("id")) === null) return;
    repertoire.setSong(selectRef.current!.value, Number(songID));
    hidePrompt();
  };

  return (
    // <div >
    <form className="prompt grid-column" ref={ref} onSubmit={onSubmit}>
      <h3 className="text-center primary-underline">Dodaj do repertuaru</h3>
      <p>Obecnie otwarta pieśń ma być ustawiona na:</p>
      <select name="song-option" ref={selectRef}>
        <option value="Wejście">Wejście</option>
        <option value="Ofiarowanie">Ofiarowanie</option>
        <option value="Komunia">Komunię</option>
        <option value="Uwielbienie">Uwielbienie</option>
        <option value="Zakończenie">Zakończenie</option>
      </select>
      <div className="flex-column">
        <button type="submit">Dodaj do repertuaru</button>
        <button className="outline" type="reset" onClick={hidePrompt}>
          Anuluj
        </button>
      </div>
    </form>
    // </div>
  );
}
