import React, {
  RefObject,
  useContext,
  useEffect,
  useState,
} from "react";
import "../styles/sideNav.css";
import "../styles/settingsNav.css";
import "../styles/switch.css";
import Settings from "src/infrastructure/settings";
import { repertoireTargets } from "src/infrastructure/Repertoire";
import { useRepertoire } from "src/hooks/useRepertoire";
import {
  callbackWithNumber,
  callbackWithoutArgument,
} from "src/infrastructure/types/global";
import { STORAGE_DIR, STORAGE_FILE } from "src/infrastructure/constants";
import manager from "src/infrastructure/URLManager";
import navigationCtx from "src/contexts/NavigationContext";
import Navigation from "src/viewModels/Navigation";

export default function SettingsNav({
  reference,
}: {
  reference: RefObject<HTMLElement>;
}) {
  const [isDarkTheme, _changeTheme] = useState(Settings.isDarkMode);
  // navigation = useContext(SongContext);

  const hideNav: callbackWithoutArgument = () => {
    reference.current?.classList.remove("active");
  };

  const changeTheme = (v: boolean) => {
    //  console.log({ v, isDarkTheme });
    Settings.setTheme(v);
    _changeTheme(v);
  };

  useEffect(() => {
    // Powinienem to zrobić w settings, ale nie chce to działać jak powinno, stąd jest tak
    document.documentElement.setAttribute(
      "data-theme",
      isDarkTheme ? "dark" : "light"
    );
  }, [isDarkTheme]);

  console.log("[SettingsNav] Rerender #1");
  return (
    // @ts-ignore
    <nav id="settings" className="sideNav" ref={reference}>
      <h3 className="text-center primary-underline">Ustawienia</h3>
      <div className="container">
        <div>Ciemny motyw</div>
        <div>
          <label className="switch">
            <input
              type="checkbox"
              id="dark-mode-switch"
              onChange={(e) => changeTheme(e.target.checked)}
              checked={isDarkTheme}
            />
            <span className="slider" />
          </label>
        </div>
        <div>Rozmiar tekstu</div>
        <div className="items-row">
          <button className="square" onClick={Settings.decreaseTextSize}>
            -
          </button>
          <button className="square" onClick={Settings.increaseTextSize}>
            +
          </button>
        </div>
      </div>
      <br />
      <RepertoireView hideNav={hideNav} />
      <br />
      <SpecialActionButton />
    </nav>
  );
}

function SpecialActionButton() {
  /** IDK how to name it. 
  PWA not installed - display "Install" button
  PWA installed - display "Download All button"
  */

  const [prompt, setPrompt] = useState<any>(null);
  const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setPrompt(e);
    });
  }, []);
  const install = () => {
    if (prompt) prompt.prompt();
  };

  const downloadAllSongs = () => {
    // // TODO: Dodać tą opcję i w SW żeby pobierało dopiero po zainstalowaniu
    window.registration.active?.postMessage({
      downloadAll: true,
      url: manager.relativePath(STORAGE_DIR + STORAGE_FILE),
    });
  };

  if (isInstalled)
    return (
      <div className="bottom">
        <button onClick={downloadAllSongs}>Pobierz wszystkie pieśni</button>
      </div>
    );

  return (
    <div className="bottom" hidden={prompt !== null}>
      <button onClick={install}>Zainstaluj śpiewnik</button>
    </div>
  );
}

function RepertoireView({ hideNav }: { hideNav: callbackWithoutArgument }) {
  const repertoire = useRepertoire();
  const navigation = useContext(navigationCtx)!;

  const displayAddSongPrompt = () => {
      hideNav();
      repertoire.displayPrompt();
    },
    displayShareLinkPrompt = () => {
      hideNav();
      repertoire.displayShareLinkPrompt();
    };

  const chooseSongCallback: callbackWithNumber<void> = (id) => {
    hideNav();
    navigation.setChosenSong(id);
  };

  const clearList: callbackWithoutArgument = () => {
    if (window.confirm("Czy napewno chcesz wyczyścić całą listę?"))
      repertoire.clear();
  };

  // console.log("[RepertoireView] reRender", repertoire);
  let key = "repertoire-" + Date.now();
  return (
    <>
      <h3 className="text-center primary-underline">Repertuar</h3>
      <div className="container" key={key} data-key={key}>
        {repertoireTargets.map((target) => (
          <RepertoireElem
            key={"repertoire-elem-" + target.replace(" ", "-").toLowerCase()}
            target={target}
            songID={repertoire.getSong(target)}
            chooseSongCallback={chooseSongCallback}
          />
        ))}

        <div className="cols-2 mg-top-1">
          <AddSongButton callback={displayAddSongPrompt} nav={navigation} />

          <button className="mg-top-1" onClick={displayShareLinkPrompt}>
            Udostępnij repertuar
          </button>

          <button className="outline mg-top-1" onClick={clearList}>
            Wyczyść listę
          </button>
        </div>
      </div>
    </>
  );
}

function AddSongButton({
  callback,
  nav,
}: {
  callback: callbackWithoutArgument;
  nav: Navigation;
}) {
  const [state, updateState] = useState(nav.isSongChosen);
  nav.onCurrentSongUpdate = (id) => {
    console.log(
      "[AddSongButton] callback, state: ",
      id === undefined || id === 0
    );
    updateState(id === undefined || id === 0);
  };
  return (
    <button disabled={state} onClick={callback}>
      Dodaj tą piosenkę
    </button>
  );
}

function RepertoireElem({
  target,
  songID,
  chooseSongCallback,
}: {
  target: string;
  songID: number;
  chooseSongCallback: callbackWithNumber<void>;
}) {
  const placeholder = "_____";
  // console.log("[SettingsNav]", target, songID);
  return (
    <>
      <div>{target}</div>
      {songID > 0 ? (
        <button
          className="song-item"
          onClick={() => chooseSongCallback(songID)}
        >
          {songID}
        </button>
      ) : (
        <div>{placeholder}</div>
      )}
    </>
  );
}
