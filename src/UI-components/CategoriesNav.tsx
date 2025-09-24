import React, { LegacyRef, MutableRefObject, RefObject } from "react";
import "../styles/sideNav.css";
import "../styles/table.css";
import { liturgical_tags, other_tags } from "../models/Tags";

export default function CategoriesNav({
  onTagChosen,
  reference,
}: {
  onTagChosen: (tag: number) => void;
  reference: RefObject<HTMLElement>;
}) {
  const tableRowBuilder = (v: any) => {
    return (
      <tr key={v[0]} onClick={() => onTagChosen(Number(v[0]))}>
          <td>{v[1]}</td>
      </tr>
    );
  };

  return (
    // @ts-ignore
    <nav id="categories" className="sideNav" ref={reference}>
      <h3 className="text-center">Podział pieśni wg. kategorii</h3>
      <b>Liturgiczne</b>
      <table>
        <tbody className="hoverable">
          {Object.entries(liturgical_tags).map(tableRowBuilder)}
        </tbody>
      </table>
      <br />
      <b>Pieśni i piosenki na różne okazje</b>
      <table>
        <tbody className="hoverable">
          {Object.entries(other_tags).map(tableRowBuilder)}
        </tbody>
      </table>
    </nav>
  );
}
