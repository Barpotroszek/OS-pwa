import React, { useEffect, useRef, useState } from "react";
import SideNav from "./UI-components/SideNav";
import "./styles/main.css";
import MyFileReader from "./MyFileReader";
import SongList from "./models/SongList";
import SongBook from "./viewModels/SongListVM";
import CurrentSong from "./viewModels/CurrentSong";
import { pushState } from "./helpers";
import SongListView from "./view/SongListView";
import { BackButton } from "./UI-components/button";
import CurrentSongView from "./view/CurrentSongView";
// @ts-ignore
import Header from "./UI-components/header.js"

function App() {
  const [isSideNavActive, updateSideNavState] = useState(false),
    reader = new MyFileReader(),
    songListRepo = useRef(new SongList(reader)).current,
    songListModel = useRef(new SongBook(songListRepo)).current,
    currentSongRepo = useRef(new CurrentSong(reader)).current;

  const [currentSongID, updateCurrentSong] = useState<number | undefined>();

  // URL Parser - żeby sprawdzić czy to aktualna piesn, itp itd
  useEffect(() => {

    songListRepo.loadingProcess.then(() => {
      const id = new URL(window.location.href).searchParams.get("id");
      if (id == null) updateCurrentSong(undefined);
      updateCurrentSong(Number(id));
    });
  }, []);

  const backCallback = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    updateCurrentSong(0);
    pushState(url.href);
  };

  const tagChosenCallback = (tag: number) => {
    songListModel.addTag(tag);
    songListModel.fetchSongsFromRepo();
  }

  window.onpopstate = backCallback;
  const toggleSideNav = () => {
    updateSideNavState(!isSideNavActive);
  };

  let MainBlock: React.ReactElement;

  if (currentSongID !== undefined && currentSongID > 0) {
    currentSongRepo.setNewSong(songListRepo.getSong(currentSongID));
    console.log({ currentSongID });
    MainBlock = (
      <main id="songDisplayer">
        <CurrentSongView repo={currentSongRepo} />
        <BackButton cb={backCallback} />
      </main>
    );
  } else
    MainBlock = (
      <main>
        <SongListView
          viewModel={songListModel}
          onClick={(id: number) => updateCurrentSong(id)}
        />
        <BackButton cb={backCallback} />
      </main>
    );

  return (
    <>
      <Header toggleSideNav={toggleSideNav} />
      <div
        id="main-wrapper"
        className={`flex-center ${isSideNavActive ? "active" : " "}`}
      >
        <SideNav onTagChosen={tagChosenCallback} />
        {MainBlock}
      </div>
    </>
  );
}

export default App;
