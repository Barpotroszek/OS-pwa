import React, { useRef } from "react";
import Header from "./view/header.js";
import Main from "./view/Main.tsx";
// import SideNav from "./UI-components/SideNav.tsx";
import "./styles/main.css"

function App() {
  let isSideNavActive = false,
    sideNavRef = useRef();

  const toggleSideNav = () => {
  }

  return (
    <>
      <Header toggleSideNav={toggleSideNav}/>
      <div id="main-wrapper" className={`flex-center ${isSideNavActive ? "active": " "}`}>
        <Main />
        {/* <SideNav ref={sideNavRef}/> */}
      </div>
    </>
  );
}

export default App;
