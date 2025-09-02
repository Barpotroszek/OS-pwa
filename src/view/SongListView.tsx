import React, { useEffect, useState } from "react";
import "../styles/titlesList.css";
import "../styles/searchbar.css";
import SongBook from "../viewModels/SongBook";
import Song from "../models/Song";
import { pushState } from "../helpers";

export default function SongListView({ viewModel, onClick }: { viewModel: SongBook, onClick: (id:number)=>void }) {
  const [enteredInput, updateInput] = useState("");
  const [list, updateList] = useState(viewModel.getList());

  useEffect(() => {
    viewModel.onLoadEnd = () => updateList(viewModel.getList());
  }, []);

  const searchButtonAction = () => {
    viewModel.setSearchQuery(enteredInput);
    viewModel.fetchSongsFromRepo();
  };

  const chooseSongCb = (id: number) => {
    // alert("Przeniesienie do: " + id);
    const path = new URL(window.location.href);
    path.pathname = path.pathname.replace(/\/$/, "");
    path.searchParams.set("id", String(id));
    pushState(path.href);
    onClick(id)
  };

  let myBody: () => React.JSX.Element;
  if (list.length > 0) myBody = () => ItemsListFabric(list, chooseSongCb);
  else myBody = () => SthWentWrong();

  return (
    <>
      <h2>Wybierz pieśń z listy:</h2>
      <div id="searchbar">
        <input
          type="text"
          placeholder="Wyszukiwarka"
          onKeyDown={(e) => (e.key === "Enter" ? searchButtonAction() : null)}
          onInput={(e: any) => updateInput(e.target.value)}
          value={enteredInput}
        />
        <button onClick={searchButtonAction}>Szukaj</button>
      </div>
      {myBody()}
    </>
  );
}

/**
 * Element wyświetlany wtedy, gdy zwrócona lista z tytułami jest pusta
 */
function SthWentWrong() {
  return <i>Lista jest pusta...</i>;
}

/**
 * Odpowiada za stworzenie elementów do tablicy na podstawie podanej listy
 * @param items lista pieśni do umieszczenia w tablicy
 * @param cb callback uruchamiany po wybraniu danej pozycji
 */
function ItemsListFabric(items: Song[], cb: (id: number) => void) {
  return (
    <table id="titlesList">
      <tbody>
        {items.map((item, _) => {
          return <SongTitleItem item={item} key={item.id} cb={cb} />;
        })}
      </tbody>
    </table>
  );
}

/**
 * Elementy wyświetlane na tablicy/w liście
 * @param item piosenka typu Song
 * @param cb - co zrobić, jak zostane naciśnięte
 * @returns 
 */
function SongTitleItem({ item, cb }: { item: Song; cb: any }) {
  return (
    <tr>
      <td onClick={() => cb(item.id)}>{item.toString()}</td>
    </tr>
  );
}
