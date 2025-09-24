import { useEffect, useState } from "react";
import repertoire from "src/infrastructure/Repertoire";

export function useRepertoire() {
    const [t, forceUpdate] = useState<number>(0);
    useEffect(() => {
        repertoire.onUpdate = () => {
         //  console.log("[useRepertoire] setting onUpdate")
            forceUpdate(t + 1)
        };
    }, [])
    return repertoire
}