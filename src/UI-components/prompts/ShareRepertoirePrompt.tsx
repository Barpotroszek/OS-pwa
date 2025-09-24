import React, { useRef, useState } from "react";
import "../../styles/prompt.css";
import URLManager from "src/infrastructure/URLManager";
import { useRepertoire } from "src/hooks/useRepertoire";

export default function ShareRepertoirePrompt() {
  const ref = useRef<HTMLDivElement>(null),
    repertoire = useRepertoire(),
    [href, updateHref] = useState<string>("");

  const displayPrompt = () => {
    ref.current?.classList.add("active");
    updateHref(
      URLManager.createURLwithSearchParam("repertoire", repertoire.export())
    );
  };

  const hidePrompt = () => ref.current?.classList.remove("active");
  const copyLink = () => {
    navigator.clipboard.writeText(href);
    alert("Link skopiowany do schowka");
  };

  repertoire.displayShareLinkPrompt = displayPrompt;

  return (
    // <div >
    <div className="prompt grid-column" ref={ref}>
      <h3 className="text-center primary-underline">Udostępnij repertuar</h3>
      <p>Link do repertuaru:</p>
      <input type="text" defaultValue={href} inputMode="none" readOnly />
      <div className="flex-column">
        <button onClick={copyLink}>Kopiuj link</button>
        <button className="outline" onClick={hidePrompt}>
          Zamknij
        </button>
      </div>
    </div>
    // </div>
  );
}
