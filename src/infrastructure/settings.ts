import { callbackWithNumber } from "./types/global";

export default class Settings {
    private static _isDarkTheme: boolean = true;
    private static _textSize: number = 1.1;
    private static _changeTextSizeStep = 0.1;
    private static _changeTextSizeCallback: (size: string) => void

    public static apply() {
        let theme = localStorage.getItem("theme");
        if (theme !== null)
            Settings._isDarkTheme = theme === "dark";
        else
            // wg prefetencji przeglądarki
            Settings._isDarkTheme = window.matchMedia("(prefers-color-scheme: dark )").matches;
        Settings.changeDarkModeCallback(Settings._isDarkTheme);

    }

    public static changeDarkModeCallback(isDark: boolean) {
        // placeholder
    }

    public static get isDarkMode(): boolean {
        return Settings._isDarkTheme;
    }

    public static setTheme(isDark: boolean) {
        Settings._isDarkTheme = isDark;
        localStorage.setItem("theme", isDark ? "dark" : "light")
    }

    public static get textSize(): string {
        return Settings._textSize.toPrecision(2)
    }

    public static increaseTextSize() {
        Settings._textSize += Settings._changeTextSizeStep;
        Settings._changeTextSizeCallback(Settings.textSize);
    }

    public static decreaseTextSize() {
        Settings._textSize -= Settings._changeTextSizeStep;
        if (Settings._textSize < 0)
            Settings._textSize = 0;
        Settings._changeTextSizeCallback(Settings.textSize);
    }

    public static set changeTextSizeCallback(cb: (txt: string) => void) {
        Settings._changeTextSizeCallback = cb
    }

}