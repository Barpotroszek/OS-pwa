import React from "react";
import { DbItem, TitlesListElem } from "./interfaces";
//@ts-ignore
import HTMLconverter from "./htmlConverter.js";
import { BackButton } from "./button";

/**
 * Przygotowuje element na podstawie przekazanego elementu
 *
 * @param {TitlesListElem} item - element zawierający dane o pieśni, pobierane z bazy
 * @returns {Element} Obrobiony element gotowy do użycia
 */

export function TitlesListItemFabric({
  item,
  cb,
}: {
  item: TitlesListElem;
  key: number;
  cb: any;
}) {
  return (
    <tr onClick={() => cb(item.id)}>
      <td key={item.id} id={`${item.id}`}>
        {item.id}. {item.title}
      </td>
    </tr>
  );
}

export function SongItemFabric({item,cb}: {item: DbItem,cb:any}) {
  let temp = item.lyrics;
  temp = HTMLconverter(temp);
  console.log("2 FABRICAAA")

  const lyrics = React.createElement("section", {
    dangerouslySetInnerHTML: { __html: temp },
  });

  return (
    <main id="songDisplayer">
      <h2>
        {item.id}. {item.title}
      </h2>
      {lyrics} <BackButton cb={cb}/>
    </main>
  );
}
