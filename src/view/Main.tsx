import React, { useEffect, useRef, useState } from "react";
import SongListView from "./SongListView";
import SongList from "../models/SongList";
import SongBook from "../viewModels/SongBook";
import CurrentSong from "../viewModels/CurrentSong";
import MyFileReader from "../MyFileReader";
import CurrentSongView from "./CurrentSongView";
import { BackButton } from "../UI-components/button";
import { pushState } from "../helpers";

export default function Main() {
  const reader = new MyFileReader(),
    songListRepo = useRef(new SongList(reader)).current,
    songBookModel = useRef(new SongBook(songListRepo)).current,
    currentSongRepo = useRef(new CurrentSong(reader)).current;

  const [currentSongID, updateCurrentSong] = useState<number | undefined>();

  const backCallback = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    updateCurrentSong(0);
    pushState(url.href);
  };

  window.onpopstate = backCallback;

  // URL Parser - żeby sprawdzić czy to aktualna piesn, itp itd
  useEffect(() => {
    songListRepo.loadingProcess.then(() => {
      const id = new URL(window.location.href).searchParams.get("id");
      if (id == null) updateCurrentSong(undefined);
      updateCurrentSong(Number(id));
    });
  }, []);

  if (currentSongID !== undefined && currentSongID > 0) {
    currentSongRepo.setNewSong(songListRepo.getSong(currentSongID));
    console.log({ currentSongID });
    return (
      <main id="songDisplayer">
        <CurrentSongView repo={currentSongRepo} />
        <BackButton cb={backCallback} />
      </main>
    );
  }
  return (
    <main>
      <SongListView
        viewModel={songBookModel}
        onClick={(id: number) => updateCurrentSong(id)}
      />
      <BackButton cb={backCallback} />
    </main>
  );
}
