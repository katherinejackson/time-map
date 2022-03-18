import io
from statistics import mean

fname = "/Users/norahr/Desktop/Norah/CSPIP/projects/time-map/time-map/src/data/ts-positions-graph-2.csv"
destFile = "/Users/norahr/Desktop/migrationData.js"
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

years = ['1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989',
     '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', 
     '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', 
     '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']

data = dict()
for l in lines[1:]:
    id = l[0] + ">" + l[1]

    migration = [float(x) for x in l[4:]]
    tempSet = set(migration)
    sortedSet = sorted(tempSet)
    sub_2014 = mean(sortedSet[1:5])
    sub_2016 = mean(sortedSet[3:-2])
    sub_2018 = mean(sortedSet[:-1])
    
    migration[-3] = sub_2018
    migration[-5] = sub_2016
    migration[-7] = sub_2014

    print(migration)

    if len(migration) != len(years):
        raise AssertionError("Migration and years are not the same length")
    else:
        temp = dict(zip(years, migration))

    # temp["start"] = l[0]
    # temp["end"] = l[1]
    # temp["x"] = float(l[2])
    # temp["y"] = float(l[3])

    # data[id] = temp

    newTemp = {
        "data": temp,
        "start": l[0],
        "end": l[1],
        "x": float(l[2]),
        "y": float(l[3])
    }

    data[id] = newTemp

#print(data)

with io.open(destFile, "w") as waf:
    waf.write("export const migrationData = " + str(data))