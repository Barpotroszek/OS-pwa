import React, { useEffect, useState } from "react";
import CurrentSong from "../viewModels/CurrentSongVM";
// @ts-ignore
import HTMLConverter from "../htmlConverter.js";

export default function CurrentSongView({ repo }: { repo: CurrentSong }) {
  const [lyrics, updateLyrics] = useState("Ładowanie...");
  useEffect(() => {
    repo.onLoadEnd = (data) => {
      console.debug("[CurrentSongView] Loading lyrics in callback");
      updateLyrics(HTMLConverter(data));
      console.debug("[CurrentSongView] Lyrics loaded");
    };
  }, []);

  const Lyrics = React.createElement("section", {
    dangerouslySetInnerHTML: { __html: lyrics },
  });

  return (
    <>
      <h2 className="primary-underline">{repo.getTitle()}</h2>
      {Lyrics}
    </>
  );
}
