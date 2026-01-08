import React, { useContext, useEffect, useState } from "react";
import "../styles/table.css";
import "../styles/searchbar.css";
import Song from "../models/Song";
import navigationCtx from "src/contexts/NavigationContext";
import { LoadingStates } from "src/viewModels/LoadingStates";

export default function SongListView() {
  const navigation = useContext(navigationCtx)!,
    songListVM = navigation.songList,
    [list, updateList] = useState(songListVM.getList());

  useEffect(() => {
    navigation.onListLoaded = () => {
      updateList(songListVM.getList())
    };
    songListVM.fetchSongsFromRepo();
  }, []);

  const searchButtonAction = (txt: string) => {
    songListVM.setSearchQuery(txt);
    songListVM.fetchSongsFromRepo();
  };

  let myBody: () => React.JSX.Element;
  if (songListVM.uiState !== LoadingStates.FINISHED)
    myBody = () => <i>Ładowanie pieśni...</i>;
  else if (list.length > 0) myBody = () => <ItemsListFabric items={list} />;
  else myBody = () => SthWentWrong();
  console.log("[SongListView] Rerendering list :>");

  return (
    <>
      <h2 className="primary-underline">Wybierz pieśń z listy:</h2>
      <Searchbar onSubmit={searchButtonAction} />
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
 * Wyszukiwarka po tekście
 * @param onSubmit obsługa "zatwierdzenia" tekstu
 * @returns
 */
function Searchbar({ onSubmit }: { onSubmit: (txt: string) => void }) {
  const [enteredInput, updateInput] = useState("");
  return (
    <div id="searchbar">
      <input
        type="text"
        placeholder="Wyszukiwarka"
        onKeyDown={(e) => (e.key === "Enter" ? onSubmit(enteredInput) : console.log)}
        onSubmit={()=> onSubmit(enteredInput)}
        onInput={(e: any) => updateInput(e.target.value)}
        value={enteredInput}
      />
      <button onClick={() => onSubmit(enteredInput)}>Szukaj</button>
    </div>
  );
}

/**
 * Odpowiada za stworzenie elementów do tablicy na podstawie podanej listy
 * @param items lista pieśni do umieszczenia w tablicy
 */
function ItemsListFabric({ items }: { items: Song[] }) {
  const navigation = useContext(navigationCtx)!;
  return (
    <table id="titlesList">
      <tbody className="hoverable">
        {items.map((item, _) => {
          return (
            <SongTitleItem
              item={item}
              key={item.id}
              cb={(id: number) => navigation.setChosenSong(id)}
            />
          );
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
