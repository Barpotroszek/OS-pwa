export type Tag = {
    id: number;
    name: string
    // items: Tag[]
}

export const liturgical_tags = {
    1: "[Msza Święta] Wejście i dary",
    2: "[Msza Święta] Komunia",
    4: "[Msza Święta] Uwielbienie",
    8: "Adwent (do 16. grudnia)",
    16: "Adwent (od 17. grudnia)",
    32: "Narodzenie Pańskie",
    64: "Wielki Post (do 5. niedzieli)",
    128: "Wielki Post (od 5. niedzieli)",
    256: "Wielkanoc",
    512: "Zesłanie Ducha Świętego",
    1024: "ku czci Matki Bożej  ",
}

export const other_tags = {
    2048: "dziękczynienie i uwielbienie",
    4096: "pieśni i piosenki próśb",
    8192: "do Ducha Świętego",
    16384: "medytacyjne",
    32768: "drogi krzyżowe i nabożeństwa pokutne",
    65536: "maryjne",
    131072: "kolędy domowe",
    262144: "dla dzieci",
    524288: "pogodne wieczory",

}

