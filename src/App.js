import React from "react";
import Header from "./pages/header.js";
import Main from "./pages/Main.tsx";

function App() {
  return (
    <>
      <Header />
      <div className="flex-center">
        <Main />
      </div>
    </>
  );
}

export default App;
