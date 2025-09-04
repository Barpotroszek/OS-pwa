import React, { useEffect, useRef, useState } from "react";
import SideNav from "./UI-components/SideNav";
import "./styles/main.css";
import MyFileReader from "./MyFileReader";
import SongList from "./models/SongList";
import SongListVM from "./viewModels/SongListVM";
import CurrentSong from "./viewModels/CurrentSong";
import { pushState } from "./helpers";
import SongListView from "./view/SongListView";
import { BackButton } from "./UI-components/button";
import CurrentSongView from "./view/CurrentSongView";
// @ts-ignore
import Header from "./UI-components/header.js";

function App() {
  const reader = new MyFileReader(),
    songListRepo = useRef(new SongList(reader)).current,
    songListModel = useRef(new SongListVM(songListRepo)).current,
    currentSongRepo = useRef(new CurrentSong(reader)).current;

  const toggleSideNav = useRef<() => void | undefined>(),
    wrapper = useRef(null);
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
    songListModel.setTag(tag);
    songListModel.fetchSongsFromRepo();
    // @ts-ignore
    wrapper.current.classList.remove("active");
  };

  window.onpopstate = backCallback;

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
      <Header wrapperRef={wrapper} />
      <div id="main-wrapper" ref={wrapper} className={`flex-center`}>
        <SideNav onTagChosen={tagChosenCallback} />
        {MainBlock}
      </div>
    </>
  );
}

export default App;
