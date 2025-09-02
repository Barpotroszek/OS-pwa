//@ts-nocheck

export default class MyFileReader {
  filePath: string;
  data: any;
  resp: Promise<Response>;

  public createRequest(url: String | Number = null): Promise<Response>{
    console.debug("[MyFileReader] Createing request\nReader:", {url})
    
    const path = new URL(window.location.href)
    path.pathname = path.pathname.replace(/\/$/,'')
    this.filePath = path.pathname + (url == null ? "/store/storage.json":"/store/" + url);
    
    // to make this .. url work as should, as relative :')
    // console.log("FILEPATH:",{ filePath: this.filePath });
    
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
