import React, { useEffect, useRef } from "react";
import URLManager from "./infrastructure/URLManager";
import "./styles/main.css";
import "./styles/songView.css";
import MyFileReader from "./MyFileReader";
import SongList from "./models/SongList";
import CategoriesNav from "./UI-components/CategoriesNav";
// @ts-ignore
import Header from "./UI-components/header";
import Settings from "./infrastructure/settings";
import SettingsNav from "./UI-components/SettingsNav";
import RepertoireSongPrompt from "./UI-components/prompts/RepertoireSongPrompt";
import ShareRepertoirePrompt from "./UI-components/prompts/ShareRepertoirePrompt";
import ImportRepertoirePrompt from "./UI-components/prompts/ImportRepertoirePrompt";
import { useRepertoire } from "./hooks/useRepertoire";
import { Main } from "./view/Main";
import Navigation from "./viewModels/Navigation";
import NavigationContext from "./contexts/NavigationContext";

function App() {
  const reader = new MyFileReader(),
    songListRepo = useRef(new SongList(reader)).current,
    categoriesNavRef = useRef<HTMLElement>(null),
    settingsNavRef = useRef<HTMLElement>(null),
    repertoire = useRepertoire(),
    navigation = new Navigation(songListRepo, reader);

  Settings.apply();

  // URL Parser - żeby sprawdzić co ma wyświetlić
  useEffect(() => {
    const id = URLManager.getSearchParam("id"),
      tag = URLManager.getSearchParam("tag"),
      r_query = new URL(window.location.href).searchParams.get("repertoire");

    URLManager.log();

    if (r_query !== null) {
      repertoire.import(r_query!);
      repertoire.displayImportedPrompt();
      URLManager.deleteSearchParam("repertoire");
    }

    if (tag !== null) navigation.setTag(Number(tag));

    songListRepo.loadingProcess.then(() => {
      if (id !== null) navigation.setChosenSong(Number(id));
      else navigation.exitSongView();
    });
  }, []);

  const tagChosenCallback = (tag: number) => {
    // @ts-ignore
    categoriesNavRef.current.classList.remove("active");
    navigation.setTag(tag);
  };

  window.onpopstate = navigation.exitSongView;

  return (
    <>
      <Header
        categoriesNavRef={categoriesNavRef}
        settingsNavRef={settingsNavRef}
      />
      <NavigationContext.Provider value={navigation}>
        <div id="main-wrapper" className="flex-center max-width">
          <div className="hidding-wrapper">
            <CategoriesNav
              reference={categoriesNavRef}
              onTagChosen={tagChosenCallback}
            />
            <SettingsNav reference={settingsNavRef} />
            <RepertoireSongPrompt />
            <ShareRepertoirePrompt />
            <ImportRepertoirePrompt />
          </div>
          <Main />
        </div>
      </NavigationContext.Provider>
    </>
  );
}

export default App;
