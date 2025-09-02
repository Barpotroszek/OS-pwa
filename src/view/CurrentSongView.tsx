import React, { useEffect, useState } from "react";
import CurrentSong from "../viewModels/CurrentSong";
// @ts-ignore
import  HTMLConverter from '../htmlConverter.js'

// const HTMLconverter = require("../htmlConverter.js") as (text: String) => string;

export default function CurrentSongView({repo}: {repo: CurrentSong}){
    const [lyrics, updateLyrics] = useState("Ładowanie...");
    useEffect(()=>{
        repo.getLyrics().then(v => {
            let t = HTMLConverter(v);
            console.log("Było:", v)
            console.log("Jest:", t)
            return t
        }).then(updateLyrics);
    }, [])

    const Lyrics = React.createElement('section', {
        dangerouslySetInnerHTML: {__html: lyrics}
      })

    console.log(HTMLConverter)
    return(
        <>
            <h2>
            {repo.getTitle()}
            </h2>
            {Lyrics}
        </>
    )
}