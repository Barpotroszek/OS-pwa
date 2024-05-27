from bs4 import BeautifulSoup as bs
import json
import requests as r

f = open("output.json", "r")
dt = json.loads(f.read())

def quick_format(elem): 
    raw = str(elem).replace("<em>", "[em]").replace("</em>", "[/em]").replace("<br/>", "[br/]")
    return bs(raw, "html.parser")

def parse(id):
    # TODO: Zrobić tutaj konwertowanie tekstu na jakieś ładniejsze dane
    print("ID:", id)
    resp = r.get(dt[id]["href"]).content
    # print(dt[id])
#     print(resp)
    soup = bs(resp, "html.parser")
    # print(soup.section)
    # dt[id]["text"] = "\"" + soup.section + "\""
    section = soup.section
    # print(section.contents)

    output = ""
    section = quick_format(section)
    
    for kid in section.contents[0]:
        # print("KID:", kid, '\n\n')
        if(kid.name == None):
            continue
        if(kid.name == "p"):
            output += "[p]" + kid.text + "[/p]"
        elif kid.name == "ol":
            output += "[ol]"
            for li in kid.contents:
                if(kid.text == '\n'):
                    continue
                output += '[li]' + li.text + "[/li]"
            output += '[/ol]'
        else:
            continue
            # print("Tego nie znam: ", kid.name)
    dt[id]["lyrics"] = output
    # print("\n\n\n\n\tOUTPUT:\n",output)

# for a in range(1, 1292):
    # parse(a)
parse(0)
print("Work done!")
json.dump(dt, open("output.json", "w", encoding="utf-8"), ensure_ascii=False)
# parse(14)
