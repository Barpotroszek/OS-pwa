import { useContext, useEffect, useState } from "react";
import React from "react";
import SongListView from "./SongListView";
import { BackButton } from "src/UI-components/backButton";
import CurrentSongView from "./CurrentSongView";
import navigationCtx from "src/contexts/NavigationContext";

export function Main() {
  const navigation = useContext(navigationCtx)!;
  const [currentSongID, updateCurrentSong] = useState<number>(0);

  useEffect(() => {
    // Wymuszenie zmiany widoku kinda
    navigation.onCurrentSongUpdate = updateCurrentSong;
  }, []);

  if (currentSongID !== undefined && currentSongID > 0) {
    return (
      <main id="songView">
        <CurrentSongView repo={navigation.getCurrentSong()} />
        <BackButton cb={() => navigation.exitSongView()} />
      </main>
    );
  }

  return (
    <main>
      <SongListView />
      <BackButton cb={() => navigation.exitTagView()} />
    </main>
  );
}
