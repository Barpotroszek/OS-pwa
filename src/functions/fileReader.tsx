//@ts-nocheck
// inaczej mnie coś trafi z tym poprawianiem

export default class Reader {
  filePath: string;
  data: any;
  resp: Promise<string>;
  constructor() {
    this.filePath = window.homepage + "json/data-3.json";
    
    // to make this .. url work as should, as relative :')
    console.log("FILEPATH:",{ filePath: this.filePath });
    
    this.resp = fetch(this.filePath)
      // Retrieve its body as ReadableStream
      .then((response) => {
        const reader = response.body?.getReader();
        return new ReadableStream({
          start(controller) {
            function pump() {
              return reader?.read().then(({ done, value }) => {
                // When no more data needs to be consumed, close the stream
                if (done) {
                  controller.close();
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
              });
            }
            return pump();
          },
        });
      })
      // Create a new response out of the stream
      .then((stream) => new Response(stream))
      // Create an object URL for the response
      .then((response) => response.blob())
      .then((blob) => blob.text());
  }

  getData() {
    return new Promise((res) => {
      this.resp.then((text) => {
        console.log({ text });
        try {
          res(JSON.parse(text));
        } catch (error) {
          console.error(error);
        }
      });
    });
  }
}
