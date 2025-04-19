export default function HTMLconverter(txt) {
  console.log({txt})
  txt = txt
    .replaceAll("[em]", "<em>")
    .replaceAll("[/em]", "</em>")
    .replaceAll("[br/]", "<br/>");
  txt = txt.replaceAll("[/ol]", "</ol>").replaceAll("[ol]", "<ol>");
  txt = txt
    .replaceAll("[li]", "<li>")
    .replaceAll("[/li]", "</li>")
    .replaceAll("[p]", "<p>")
    .replaceAll("[/p]", "</p>");
  console.debug({ txt });
  if (txt.search("<br/>")) {
    try {
      let a = txt.split("<br/>");
      a[1] = "<p>" + a[1].replace("</li>", "</p>");
      // a[1].split("</li>");
      console.debug(a);
      txt = a.join("");
    } catch (error) {}
  }
  return txt;
}
