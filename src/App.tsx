import React, { useEffect, useRef, useState } from "react";
import URLManager from "./infrastructure/URLManager";
import "./styles/main.css";
import MyFileReader from "./MyFileReader";
import SongList from "./models/SongList";
import SongListVM from "./viewModels/SongListVM";
import CurrentSong from "./viewModels/CurrentSongVM";
import CategoriesNav from "./UI-components/CategoriesNav";
import { BackButton } from "./UI-components/backButton";
import SongListView from "./view/SongListView";
import CurrentSongView from "./view/CurrentSongView";
// @ts-ignore
import Header from "./UI-components/header";
import Settings from "./infrastructure/settings";
import SettingsNav from "./UI-components/SettingsNav";
import RepertoireSongPrompt from "./UI-components/RepertoireSongPrompt";
import { SongContext } from "./contexts/SongContext";

function App() {
  const reader = new MyFileReader(),
    songListRepo = useRef(new SongList(reader)).current,
    songListModel = useRef(new SongListVM(songListRepo)).current,
    currentSongRepo = useRef(new CurrentSong(reader)).current,
    categoriesNavRef = useRef<HTMLElement>(null),
    settingsNavRef = useRef<HTMLElement>(null);

  const [currentSongID, updateCurrentSong] = useState<number | undefined>();

  Settings.apply();

  // URL Parser - żeby sprawdzić co ma wyświetlić
  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams,
      id = searchParams.get("id"),
      tag = searchParams.get("tag");

    if (tag != null) songListModel.setTag(Number(tag));

    songListRepo.loadingProcess.then(() => {
      if (id != null) updateCurrentSong(Number(id));
      else updateCurrentSong(undefined);
    });
    songListModel.fetchSongsFromRepo();
  }, []);

  const songChosenCallback = (id: number) => {
    URLManager.setSearchParam("id", String(id));
    updateCurrentSong(id);
  };

  const songExitCallback = () => {
    URLManager.deleteSearchParam("id");
    updateCurrentSong(0);
  };

  const tagChosenCallback = (tag: number) => {
    URLManager.setSearchParam("tag", tag.toString());
    songListModel.setTag(tag);
    songListModel.fetchSongsFromRepo();

    // @ts-ignore
    categoriesNavRef.current.classList.remove("active");
    // Na wypadek, jakby aktualnie była wyświetlana jakaś piosenka:
    songExitCallback();
  };

  const listBackCallback = () => {
    URLManager.deleteSearchParam("tag");
    songListModel.clearTags();
    songListModel.fetchSongsFromRepo();
  };

  window.onpopstate = songExitCallback; 
  let MainBlock: React.ReactElement;

  if (currentSongID !== undefined && currentSongID > 0) {
    currentSongRepo.setNewSong(songListRepo.getSong(currentSongID));
    console.log({ currentSongID });
    MainBlock = (
      <main id="songDisplayer">
        <CurrentSongView repo={currentSongRepo} />
        <BackButton cb={songExitCallback} />
      </main>
    );
  } else
    MainBlock = (
      <main>
        <SongListView viewModel={songListModel} />
        <BackButton cb={listBackCallback} />
      </main>
    );

  return (
    <>
      <Header
        categoriesNavRef={categoriesNavRef}
        settingsNavRef={settingsNavRef}
      />
      <SongContext.Provider value={{setNewSong: songChosenCallback, isSongChosen: ( currentSongID !== undefined && currentSongID > 0 )}} >
      <div id="main-wrapper" className="flex-center max-width">
        <div className="hidding-wrapper">
          <CategoriesNav
            reference={categoriesNavRef}
            onTagChosen={tagChosenCallback}
          />
          <SettingsNav reference={settingsNavRef} />
          <RepertoireSongPrompt />
        </div>
        {MainBlock}
      </div>
      </SongContext.Provider>
    </>
  );
}

export default App;
