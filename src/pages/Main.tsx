import React, { useEffect, useState } from "react";
import TitlesList from "./TitlesList";
import Database from "../functions/db";
import "../styles/songDisplayer.css";
import "../styles/searchbar.css"
import { SongItemFabric } from "../functions/Items";
import { pushState } from "../functions/helpers";

export default function Main() {
  const [chosenSong, changeChosenSong] = useState<any>(),
    proxyChosenSong = (id: number, fromUrl?: boolean) => {
      // add history mark if it was userAction
      if (!fromUrl) {
        console.log("NOT FROM URL")
        const path = new URL(window.location.href)
        path.pathname = path.pathname.replace(/\/$/,'')
        path.searchParams.set("id", String(id));
        // eslint-disable-next-line
        pushState(path.href)
      }
      else
      console.log("FROM URL")


      //@ts-ignore
      Database.getInstance().getItem(id).then(changeChosenSong);
    },
    backCallback = ()=>{
      const url = new URL(window.location.href)
      url.searchParams.delete("id");
      changeChosenSong(null);
      pushState(url.href);
      // changeChosenSong(undefined)
    };
  
    window.onpopstate = backCallback;

  useEffect(() => {
    const id = new URL(window.location.href).searchParams.get("id");
    console.log({ id });
    if (id!=null) proxyChosenSong(Number(id), true);
    // callRender((render) => render+1)
  }, []);
  

  if (chosenSong == null)
    return (
      <main>
        <TitlesList chosenSongCb={proxyChosenSong} />
        </main>
    );
  console.log("Chosen song ID:", chosenSong);
  return <SongItemFabric item={chosenSong} cb={backCallback} />;
}
