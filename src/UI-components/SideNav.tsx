import React from "react";
import "../styles/sideNav.css";
import "../styles/tableRows.css";
import { liturgical_tags, other_tags } from "../models/Tags";

export default function SideNav({
  onTagChosen,
}: {
  onTagChosen: (tag: number) => void;
}) {
  const tableRowBuilder = (v: any) => {
    return (
      <tr key={v[0]} onClick={() => onTagChosen(Number(v[0]))}>
        {v[1]}
      </tr>
    );
  };

  return (
    <div className="nav-wrapper">
      <nav id="sidenav">
        <h3 className="text-center">Podział pieśni wg. kategorii</h3>
        <b>Liturgiczne</b>
        <table>
          <tbody>{Object.entries(liturgical_tags).map(tableRowBuilder)}</tbody>
        </table>
        <b>Pieśni i piosenki na różne okazje</b>
        <table>
          <tbody>{Object.entries(other_tags).map(tableRowBuilder)}</tbody>
        </table>
      </nav>
    </div>
  );
}
