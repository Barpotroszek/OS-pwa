export interface DbItem {
    id: number;
    title: string;
    tags?: string[];
    lyrics?: string;
    href?: string;
    category: number
}

export interface TitlesListElem{
    id: number;
    title: string
}