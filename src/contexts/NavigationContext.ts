import { createContext } from "react";
import Navigation from "src/viewModels/Navigation";

/** Kontekst slużący do nawiwgacji między widokami aplikacji */
const navigationCtx = createContext<Navigation|null>(null)
export default navigationCtx;