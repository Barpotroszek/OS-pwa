export default class Settings {
    private static _isDarkTheme: boolean = true;
    private static _textSize: number = 1.2;
    private static _changeTextSizeStep = 0.2
    private static _changeTextSizeCallback: (size: number) => void

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
    }

    public static get isDarkMode(): boolean {
        return Settings._isDarkTheme;
    }

    public static setTheme(isDark: boolean) {
        Settings._isDarkTheme = isDark;
        localStorage.setItem("theme", isDark ? "dark" : "light")
    }

    public static get textSize(): number {
        return Settings._textSize
    }

    public static increaseTextSize() {
        Settings._textSize += Settings._changeTextSizeStep;
        Settings._changeTextSizeCallback(Settings._textSize);
    }

    public static decreaseTextSize() {
        Settings._textSize -= Settings._changeTextSizeStep;
        if (Settings._textSize < 0)
            Settings._textSize = 0;
    }

    public static set changeTextSizeCallback(cb: (size: number) => void) {
        Settings._changeTextSizeCallback = cb
    }

}