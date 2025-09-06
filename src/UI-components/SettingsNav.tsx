import React, { RefObject, useEffect, useState } from "react";
import "../styles/sideNav.css";
import "../styles/settingsNav.css";
import "../styles/switch.css";
import Settings from "src/infrastructure/settings";
import { repertoireTargets } from "src/infrastructure/Repertoire";
import { useRepertoire } from "src/hooks/useRepertoire";

export default function SettingsNav({
  reference,
}: {
  reference: RefObject<HTMLElement>;
}) {
  const [isDarkTheme, _changeTheme] = useState(Settings.isDarkMode);
  /** Wrapper do oryginalnej funkcji */

  const _songChosenCallback = (id: number) => {
    reference.current?.classList.remove("active");
    // songChosenCallback(id);
  };

  const hideNav = () => {
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
      <RepertoireView onDisplayPrompt={hideNav} />
    </nav>
  );
}

function RepertoireView({ onDisplayPrompt }: { onDisplayPrompt: () => void }) {
  // const [t_value, forceUpdate] = useState(0);
  const repertoire = useRepertoire();

  // repertoire = useRepertoire();

  const displayPrompt = () => {
    onDisplayPrompt();
    repertoire.displayPrompt();
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
          <RepertoireElem target={target} songID={repertoire.getSong(target)} />
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
}: {
  target: string;
  songID: number | undefined;
}) {
  const placeholder = "_____";
  console.log("[SettingsNav]", target, songID);
  return (
    <>
      <div>{target}</div>
      {songID !== undefined ? (
        <button
          className="song-item"
          // onClick={() => _songChosenCallback(songID)}
        >
          {songID}
        </button>
      ) : (
        <div>{placeholder}</div>
      )}
    </>
  );
}
