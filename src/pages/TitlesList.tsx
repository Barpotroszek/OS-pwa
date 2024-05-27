import React, { useEffect, useState } from "react";
import Database from "../functions/db";
import { TitlesListItemFabric } from "../functions/Items";
import "../styles/titlesList.css";
import { TitlesListElem } from "../functions/interfaces";
import { BackButton } from "../functions/button";
import { pushState } from "../functions/helpers";

export default function TitlesList({ chosenSongCb }: { chosenSongCb: any }) {
  const db = Database.getInstance(),
    [list, setList] = useState<TitlesListElem[]>([]),
    [enteredInput, updateInput] = useState(""),
    searchInputAction = (e: any) => {
      updateInput(e.target.value);
    },
    searchButtonAction = (e?: any) => {
      console.log({ enteredInput });
      const url = new URL(window.location.href);
      if (enteredInput !== "") url.searchParams.set("q", enteredInput);
      else url.searchParams.delete("q");

      pushState(url.href);
      db.search(enteredInput).then(setList);
    },
    backCallback = () => {
      console.log("backCallback")
      db.getOnlyTitles().then(e=>{console.log("tt"); setList(e)});
      updateInput('');
    };

  useEffect(() => {
    const q = new URL(window.location.href).searchParams.get("q");
    if (q && q !== "") {
      console.log("QUERY", { q });
      db.search(q).then(setList);
      updateInput(q);
    } else {
      db.getOnlyTitles().then((v) => {
        console.log("[TitilesList] EFFECT");
        setList(v);
      });
    }
  }, []);

  return (
    <>
      <h2>Wybierz pieśń z listy:</h2>
      <div id="searchbar">
        <input
          type="text"
          placeholder="Wyszukiwarka"
          onKeyDown={(e) => (e.key === "Enter" ? searchButtonAction() : null)}
          onInput={searchInputAction}
          value={enteredInput}
        />
        <button onClick={searchButtonAction}>Szukaj</button>
      </div>
      <table id="titlesList">
        <tbody>
          {list.map((t: TitlesListElem, a) => (
            <TitlesListItemFabric key={t.id} item={t} cb={chosenSongCb} />
          ))}
        </tbody>
      </table>
      <BackButton
        cb={backCallback}
      />
    </>
  );
}
