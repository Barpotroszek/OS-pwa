import React from "react";
import { pushState } from "./helpers";

export function BackButton({ cb }: { cb: any }) {
  const callback = () => {
    console.log("STATE:", window.history.state)
    if (cb) {;
      cb();
      // return
    }  // eslint-disable-next-line no-restricted-globals
    if (!(history.state && history.state.notFromUrl)) {
      // console.log(window.homepage, window.homepage.replace(/\/$/, ""));
      pushState(window.homepage.replace(/\/$/, ""));
      
    } 
  };
  window.onpopstate = cb;
  return (
    <>
      <button className="pos-right" onClick={callback}>
        Powrót
      </button>
    </>
  );
}
