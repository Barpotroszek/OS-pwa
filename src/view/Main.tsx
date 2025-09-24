import CurrentSong from "src/viewModels/CurrentSongVM";
import CurrentSongView from "./CurrentSongView";
import SongListView from "./SongListView";
import SongList from "src/models/SongList";
import SongListVM from "src/viewModels/SongListVM";
import { useEffect, useState } from "react";
import React from "react";

export function MainBlock({
  currentSongRepo,
  songListRepo,
  songListModel,
}: {
  currentSongRepo: CurrentSong;
  songListRepo: SongList;
  songListModel: SongListVM;
}) {
  const [currentSongID, updateCurrentSong] = useState<number | undefined>();

  // URL Parser - żeby sprawdzić co ma wyświetlić
  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams,
      id = searchParams.get("id"),
      tag = searchParams.get("tag");

    if (tag != null) songListModel.setTag(Number(tag));

    songListRepo.loadingProcess.then(() => {
      // if (id != null) songChosenCallback(Number(id));
      // else 
        updateCurrentSong(undefined);
    });
    songListModel.fetchSongsFromRepo();
  }, []);

  if (currentSongID !== undefined && currentSongID > 0) {
    currentSongRepo.setNewSong(songListRepo.getSong(currentSongID));
 //  console.log({ currentSongID });
    return (
      <main id="songView">
        <CurrentSongView repo={currentSongRepo} />
        {/* <BackButton cb={songExitCallback} /> */}
      </main>
    );
  }
  return (
    <main>
      <SongListView viewModel={songListModel} />
      {/* <BackButton cb={listBackCallback} /> */}
    </main>
  );
}