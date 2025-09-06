import React, { ChangeEvent, ChangeEventHandler } from "react";
import "../styles/header.css";
import "../styles/switch.css";
import URLManager from "src/infrastructure/URLManager";

export default function Header({
  categoriesNavRef,
  settingsNavRef,
}: {
  categoriesNavRef: any;
  settingsNavRef: any;
}) {
  const activateSideNav = (target: any) => {
    target.current.classList.add("active");
  };

  const deactivateSideNav = (target: any) => {
    target.current.classList.remove("active");
  };

  const navButtonClicked: ChangeEventHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const target = e.target;
    if (target.id === "categories") {
      if (target.checked) {
        activateSideNav(categoriesNavRef);
        deactivateSideNav(settingsNavRef);
      } else deactivateSideNav(categoriesNavRef);
    }

    if (target.id === "settings") {
      if (target.checked) {
        activateSideNav(settingsNavRef);
        deactivateSideNav(categoriesNavRef);
      } else deactivateSideNav(settingsNavRef);
    }
  };

  return (
    <header>
      <label className="menu-button">
        <input
          type="checkbox"
          name="categories"
          id="categories"
          className="hidden"
          onChange={navButtonClicked}
        />
        <img
          src={URLManager.relativePath("/icons/tag-icon.svg")}
          alt="Kategorie"
        />
      </label>
      <label className="menu-button pos-right">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
        </svg>

        <input
          type="checkbox"
          name="settings"
          id="settings"
          className="hidden"
          onChange={navButtonClicked}
        />
      </label>
    </header>
  );
}
