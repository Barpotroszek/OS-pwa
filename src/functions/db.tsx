import Reader from "./fileReader";
import { DbItem as Item, TitlesListElem } from "./interfaces";

/**
 * Integracja z lokalną bazą danych przechowującą pieśni
 */
export default class Database {
  private static instance: Database;
  private DBname: string;
  public version: number = 1;
  private db: IDBDatabase | undefined;
  private ready: boolean = false; //zmienia się po ukońzeniu initProcess
  private initProcess: Promise<any>;

  /** Konstruktor oparty na wzorcu Singleton
   *
   */
  public static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }

  private constructor() {
    //@ts-ignore
    let res, rej;
    this.initProcess = new Promise((_res, _rej) => {
      res = () => {
        _res(true);
        this.ready = true;
      };
      rej = _rej;
    });

    this.DBname = "songs";
    console.debug({ v: this.version });
    const openReq = indexedDB.open(this.DBname, this.version);
    if (!openReq) return;

    openReq.onerror = (e) => {
      console.error(e);
      alert("Problem z otwarciem bazy danych");
    };

    openReq.onupgradeneeded = (ev) => {
      // init DB
      console.debug("[OnUpgradeNeeded] FIRED");
      const db = openReq.result;
      this.db = db;
      let store;
      try {
        store = db.createObjectStore("songs", {
          keyPath: "id",
          // autoIncrement: true,
        });
      } catch (e) {
        db.deleteObjectStore("songs");
        db.deleteObjectStore("titles");
        store = db.createObjectStore("songs", {
          keyPath: "id",
          // autoIncrement: true,
        });
      }

      // ? Is that necessary? To think
      store.createIndex("title", "title");
      store.createIndex("tags", "tags");
      store.createIndex("lyrics", "lyrics");
      const store2 = db.createObjectStore("titles", {
        keyPath: "id",
        autoIncrement: true,
      });
      store2.createIndex("title", "title");
    };

    openReq.onsuccess = () => {
      console.debug("[INIT] Finished");
      this.db = openReq.result;
      //@ts-ignore
      this.uploadLatestData(res);
    };
  }

  /**
   * Parsowanie elementów do interface'u T
   * @param {Array} data - Lista elementów typu Object
   * @returns {T[]} list  - przekonwertowane elementy
   */
  private parseItems<T>(data: Array<Object>): T[] {
    const items: T[] = [];

    data.forEach((item) => {
      //@ts-ignore
      item["id"] = Number(item["id"]);
      items.push(item as T);
    })

    return items;
  }

  /**
   * ! Funkcja prawdopodobnie wyparta
   * Konwersja elementów do interfejsu "Item"
   *
  //  * @param {Array} data - elementy w typie ogólnym
  //  * @returns {Item[]} - przekonwertowane elementy
   */

  /** Pobieranie danych z predefiniowanego źródła */
  private getData() {
    return new Reader().getData();
  }

  /**
   * Wypełnianie bazy podaną listą elementów
   *
   * @param {Item[]} data - lista elementów
   */
  private fillData(data: Item[], callback?: any) {
    let r: any;

    // To run callback after doing all the processes
    new Promise((_r, j) => {
      r = _r;
    }).then(() => {
      if (callback) callback();
    });

    console.debug("[FillData] Start");
    const transaction = this.db!.transaction(["songs", "titles"], "readwrite");
    transaction.oncomplete = () => {
      console.debug("[FillData] Loading songs complete!");
      r(); // set state as resolved
    };

    transaction.onerror = console.error;
    const store = transaction.objectStore("songs");
    console.debug("STORE:", {data, store})

    data.forEach((item) => {
      store.put(item);
    });

    const store2 = transaction.objectStore("titles");
    data.forEach((item) => {
      // console.log({ id: item.id, title: item.title, item })
      store2.put({ id: item.id, title: item.title });
    });
  }

  /**
   * Aktualizowanie bazy z najnowszymi danymi
   *
   */
  private async uploadLatestData(callback?: any) {
    try {
    const data = await this.getData();

    console.log("Data:", data)
    const items: Item[] = this.parseItems(Object(data)); 
    this.fillData(items, callback); 
    } catch (e) {
      
    }
  }

  /**
   * Iteracyjne wczytywanie elementów
   * 
   * @param storeName - nazwa tabeli
   * @param query - zapytanie
   * @param callback - [nie zaimplementowane] ewentualna funkcja do dodawania elementów
   * @returns - promise, wykona się po załadowaniu wszysktich elementów
   */
  private async lazyLoading<T>(
    storeName: string,
    query: string | null,
    callback: any
  ): Promise<T[]> {
    const clearText = (txt: string) => {
      return txt.replace(/[.;,]/g, "").toLocaleLowerCase();
    };
    if (!(this.db && this.ready)) {
      await this.initProcess;
    }

    return new Promise((res, rej) => {
      const transaction = this.db!.transaction(storeName, "readonly"),
        store = transaction.objectStore(storeName),
        req = store.openCursor(),
        results: T[] = [];

      const validator = (value: any) => {
        //if there is query -> check if matches the title
        // if query is null or maches the title -> add it

        if (query && !clearText(value.title + String(value.id)).includes(query))
          return;
        results.push(value);
      };
      if (query) query = clearText(query);
      req.onerror = console.error;
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) {
          console.log({ results });
          return res(results);
        }
        validator(cursor.value);
        cursor.continue();
      };
    });
  }

  /** Nie wiem czy to jest faktycznie potrzebne, 
   * @deprecated
   * 
   * @returns 
   */
  public async getAllItems(): Promise<any> {
    //idk if needed
    if (!this.db && this.ready) {
      console.debug("[getAllItems] Waiting for end of init...");
      await this.initProcess;
    }

    const items: Item[] = [];
    const promise: Promise<Item[]> = new Promise((res) => {
      const transaction = this.db!.transaction("songs", "readonly");
      transaction.oncomplete = () => {
        console.debug("[GetAllItems > ROTransaction] Loading complete!");
      };
      transaction.onerror = (e) => {
        console.error(e);
        alert("Something gone wrong");
      };

      const store = transaction.objectStore(this.DBname);
      const req = store.getAll();
    console.log("[REQ_getAll] ", req)

      req.onsuccess = () => {
        res(req.result as Item[])
      };
    });

    return promise;
  }

  /**
   * Zwraca listę elementów gotowych do wyświetlenia na stronie
   *
   * @returns {Item[]}
   */
  public async getOnlyTitles(): Promise<TitlesListElem[]> {
    if (!(this.db && this.ready)) {
      console.debug("[getOnlyTitles] Waiting for end of init...");
      await this.initProcess;
    }
    console.debug("STATUS:", { db: this.db, ready: this.ready });
    const promise: Promise<TitlesListElem[]> = new Promise((res, rej) => {
      const transaction = this.db!.transaction("titles", "readonly");
      transaction.oncomplete = () => {
        console.debug("[getOnlyTitles] Loading complete!");
      };
      transaction.onerror = (e) => {
        console.error(e);
        alert("Something gone wrong");
        return rej();
      };

      const store = transaction.objectStore("titles");
      const req = store.getAll();
      console.debug({ req });
      req.onerror = console.error;
      // TODO: Kursory....
      req.onsuccess = () => {
        res(this.parseItems(req.result));
      };
    });

    return promise;
  }

  /**
   * Wyszukiwarka tytułów
   * 
   * @param query - fraza do znalezienia
   * @param callback - dodawanie każdego elementu, jak w lazyLoading
   * @returns 
   */
  async search(query: string, callback?: any): Promise<TitlesListElem[]> {
    return this.lazyLoading<TitlesListElem>("titles", query, callback);
  }

  /** Zwraca element dla podanego ID
   * 
   * @param id 
   * @returns 
   */
  async getItem(id: number) {
    if (!(this.db && this.ready)) {
      console.debug("[getOnlyTitles] Waiting for end of init...");
      await this.initProcess;
    }
    return new Promise((res, rej) => {
      const transaction = this.db!.transaction("songs", "readonly"),
        store = transaction.objectStore("songs");
      console.debug(store.keyPath, id);
      const req = store.get(id);
      req.onerror = console.error;
      req.onsuccess = () => {
        res(req.result);
      };
    });
  }
}
