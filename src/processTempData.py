import io, json, re
from collections import defaultdict

base_dir = "/Users/norahr/Desktop/"
fname = base_dir + "climate-daily-6.csv"

lines = list()
try:
    with io.open(fname, 'r', encoding='utf-8') as waf:
        for line in waf:
            lines.append(line.strip("\n").split(","))
    ok_open = True
except Exception as e:
    ok_open = False

if not ok_open:
    raise AssertionError("File couldn't be opened")


#print(lines)
temp = dict()
for l in lines[1:]:
    temp[l[2]] = defaultdict(list)

for l in lines[1:]:
    try:
        temp[l[2]][l[7]].append(float(l[10]))
    except Exception as e:
        temp[l[2]][l[7]].append(l[10])


print(temp['REGINA RCS']["2018"])

# dict_keys(['SWIFT CURRENT CDA', 'PRINCE ALBERT A', 'NORTH BATTLEFORD RCS', 'YORKTON RCMP SNOW', 'PRINCE ALBERT GLASS FIELD'])