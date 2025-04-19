import re
rgx2 = r'\# \d+\.[\w, ąęćńóśżźł().!]+\n-+\n(- [\w, &ąęćńóśż\?źł:\/.=-]+\n)+-+'
rgx = r'^\n\n'


with open('files.txt', 'r',encoding="utf-8") as file:
    txt = file.read()
    print(txt)
    lines = txt.split('\n')
    for line in lines:
        with open(line, 'r+', encoding="utf-8") as  f:
            t = f.read()
            t = re.sub(rgx, '', t)
            f.seek(0)
            f.truncate(0)
            f.write(t)
    