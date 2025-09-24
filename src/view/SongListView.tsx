import React, { useContext, useEffect, useState } from "react";
import "../styles/table.css";
import "../styles/searchbar.css";
import SongBook from "../viewModels/SongListVM";
import Song from "../models/Song";
import { SongContext } from "src/contexts/SongContext";

export default function SongListView({
  viewModel,
}: {
  viewModel: SongBook;
}) {
  const [enteredInput, updateInput] = useState("");
  const [list, updateList] = useState(viewModel.getList());

  useEffect(() => {
    viewModel.onLoadEnd = () => updateList(viewModel.getList());
  }, []);

  const searchButtonAction = () => {
    viewModel.setSearchQuery(enteredInput);
    viewModel.fetchSongsFromRepo();
  };

  let myBody: () => React.JSX.Element;
  if (list.length > 0) myBody = () => <ItemsListFabric items={list} />;
  else myBody = () => SthWentWrong();

  return (
    <>
      <h2 className="primary-underline">Wybierz pieśń z listy:</h2>
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
 */
function ItemsListFabric({items}: {items: Song[]}) {
  const songContext = useContext(SongContext);
  return (
    <table id="titlesList">
      <tbody className="hoverable">
        {items.map((item, _) => {
          return <SongTitleItem item={item} key={item.id} cb={songContext?.setNewSong} />;
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
