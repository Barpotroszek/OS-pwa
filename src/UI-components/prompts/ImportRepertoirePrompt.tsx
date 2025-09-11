import React, { useRef } from "react";
import "../../styles/prompt.css";
import repertoire from "src/infrastructure/Repertoire";

export default function ImportRepertoirePrompt() {
  const ref = useRef<HTMLDivElement>(null);
  const displayPrompt = () => ref.current?.classList.add("active");
  const hidePrompt = () => ref.current?.classList.remove("active");
  repertoire.displayImportedPrompt = displayPrompt;

  return (
    // <div >
    <div className="prompt grid-column" ref={ref}>
      <h3 className="text-center primary-underline">Zaimportowano repertuar</h3>
      <p>
        Cały repertuar z odnośnikami znajdziesz w panelu bocznym. Żeby go
        otworzyć, naciśnij przycisk w prawym górnym rogu.
      </p>
      <div className="flex-column">
        <button className="outline" onClick={hidePrompt}>
          Zamknij
        </button>
      </div>
    </div>
    // </div>
  );
}
