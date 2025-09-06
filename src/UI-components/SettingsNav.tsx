import React, {
  RefObject,
  useContext,
  createContext,
  useEffect,
  useState,
} from "react";
import "../styles/sideNav.css";
import "../styles/settingsNav.css";
import "../styles/switch.css";
import Settings from "src/infrastructure/settings";
import { repertoireTargets } from "src/infrastructure/Repertoire";
import { useRepertoire } from "src/hooks/useRepertoire";
import { SongContext } from "src/contexts/SongContext";
import {
  callbackWithNumber,
  callbackWithoutArgument,
} from "src/infrastructure/types/global";

interface SettingsNavContextInterface {
  setNewSong: callbackWithNumber;
  hideNav: callbackWithoutArgument;
}

const settingsNavContext = createContext<SettingsNavContextInterface | null>(
  null
);

export default function SettingsNav({
  reference,
}: {
  reference: RefObject<HTMLElement>;
}) {
  const [isDarkTheme, _changeTheme] = useState(Settings.isDarkMode),
    songContext = useContext(SongContext);

  const hideNav: callbackWithoutArgument = () => {
    reference.current?.classList.remove("active");
  };

  const changeTheme = (v: boolean) => {
    console.log({ v, isDarkTheme });
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

  return (
    // @ts-ignore
    <settingsNavContext.Provider>
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
            <button className="square">-</button>
            <button className="square">+</button>
          </div>
        </div>
        <br />
        <RepertoireView hideNav={hideNav} />
      </nav>
    </settingsNavContext.Provider>
  );
}

function RepertoireView({ hideNav }: { hideNav: callbackWithoutArgument }) {
  const repertoire = useRepertoire();
  const songContext = useContext(SongContext);

  const displayPrompt = () => {
    hideNav();
    repertoire.displayPrompt();
  };

  const chooseSongCallback: callbackWithNumber = (id) => {
    hideNav();
    songContext?.setNewSong(id);
  };

  console.log("[RepertoireView] reRender");
  let key = "repertoire-" + Date.now();
  return (
    <>
      <h3 className="text-center primary-underline" key={"repertoire-title"}>
        Repertuar
      </h3>
      <div className="container" key={key} data-key={key}>
        {repertoireTargets.map((target) => (
          <RepertoireElem
            target={target}
            songID={repertoire.getSong(target)}
            chooseSongCallback={chooseSongCallback}
          />
        ))}

        <div className="cols-2 mg-top-1">
          <button disabled={false} onClick={displayPrompt}>
            Dodaj tą piosenkę
          </button>
        </div>
      </div>
    </>
  );
}

function RepertoireElem({
  target,
  songID,
  chooseSongCallback,
}: {
  target: string;
  songID: number | undefined;
  chooseSongCallback: callbackWithNumber;
}) {
  const placeholder = "_____";
  console.log("[SettingsNav]", target, songID);
  return (
    <>
      <div>{target}</div>
      {songID !== undefined ? (
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
