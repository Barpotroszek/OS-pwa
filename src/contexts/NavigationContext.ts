import { createContext } from "react";
import Navigation from "src/viewModels/Navigation";

const navigationCtx = createContext<Navigation|null>(null)
export default navigationCtx;