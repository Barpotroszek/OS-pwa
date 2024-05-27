import react from "react";
import "../styles/header.css";
import pic from "./logo_mobile.png"
import "../styles/switch.css";


export default function Header() {
  const checkboxAction = (v)=>{
    window.postMessage({darkMode: v})  
    }
  return (
    <header>
      <div className="menu-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
        </svg>
      </div>
      <a href="./"><img src={pic}/></a>
      <div className="pos-right"> Tryb ciemny
      <label className="switch"> 
        <input type="checkbox" id="dark-mode-switch" onChange={e=> checkboxAction(e.target.checked)}/>
        <span className="slider"/>
      </label>
      </div> 
    </header>
  );
}
