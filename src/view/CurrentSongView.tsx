import React, { useEffect, useRef, useState } from "react";
import CurrentSong from "../viewModels/CurrentSongVM";
// @ts-ignore
import HTMLConverter from "../htmlConverter.js";
import Settings from "src/infrastructure/settings";

/**
 * Widok wybranej piosenki (repo - źródło, skąd ma czerpać do niej dane) 
 */
export default function CurrentSongView({ repo }: { repo: CurrentSong }) {
  const [lyrics, updateLyrics] = useState("Ładowanie..."),
    lyricsBlockRef = useRef<HTMLElement>();

  useEffect(() => {
    // Ładowanie tylko raz, w momencie konstrukcji elementu
    repo.onLoadEnd = (data) => {
      console.debug("[CurrentSongView] Loading lyrics in callback");
      updateLyrics(HTMLConverter(data));
      console.debug("[CurrentSongView] Lyrics loaded");
    };

    Settings.changeTextSizeCallback = (size) => {
      lyricsBlockRef.current?.style.setProperty("--size", size+"em")
    }
  }, []);

  // Tworzenie tekstu
  const Lyrics = React.createElement("section", {
    dangerouslySetInnerHTML: { __html: lyrics },
    className: "lyrics",
    ref: lyricsBlockRef
  });

  return (
    <>
      <h2 className="primary-underline">{repo.getTitle()}</h2>
      {Lyrics}
    </>
  );
}
