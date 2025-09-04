import { STORAGE_DIR, STORAGE_FILE } from "./infrastructure/constants";
import URLManager from "./infrastructure/URLManager";

export default class MyFileReader {
  filePath: string = "";
  data: any;
  // resp: Promise<Response> | undefined;

  public createRequest(url: String | Number = ""): Promise<Response>{
    // console.debug("[MyFileReader] Createing request\nReader:", {url})
    this.filePath = URLManager.relativePath(STORAGE_DIR + (url == null ? STORAGE_FILE: url));
    
    return fetch(this.filePath)
  }

  readToJSON(filepath: String): Promise<any>{
    // W teorii powinno zwrócić właściwy obiekt, tj. liste z piesniami
    return this.createRequest(filepath)
    .then(response => response.json())
  }

  readToText(filepath: String): Promise<string>{
    return this.createRequest(filepath).then((data) => data.text())
  }
}
