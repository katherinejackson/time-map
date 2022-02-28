from collections import defaultdict
import os, math, csv
import pandas as pd
import numpy as np

def processData(fname, sheet_num, start_line, end_line, header_line):
    df = pd.read_excel(fname, sheet_num)

    headers = list(df.iloc[header_line])
    df = df[start_line:end_line + 1]
    df.columns = headers

    # df.to_csv(base_dir + "test4.csv")

    data = dict()
    for row in df.itertuples(index=False):
        destination_country = row[2]
        labelled_data = row._asdict()
        for k in labelled_data:
            if k[0] != "_" and k != "Index":
                data[(k, destination_country)] = labelled_data[k]
                #data.append([k, destination_country, labelled_data[k]])

    return data

base_dir = "/Users/norahr/Downloads/"
un_2015_revision_dir = base_dir + "UN_MigFlow_All_CountryFiles"
un_2017_data_fname = base_dir + "undesa_pd_2017_migrant_stock_origin_destination_dataset.xlsx"
un_2019_data_fname = base_dir + "undesa_pd_2019_migrant_stock_origin_destination_dataset.xlsx"
un_2020_data_fname = base_dir +  "undesa_pd_2020_ims_stock_by_sex_destination_and_origin.xlsx"

ignored_keywords = ["Total", "Unknown"]
ignored_headers = ["Eastern Africa", "Middle Africa", "Southern Africa", 
                "Western Africa", "NORTHERN AFRICA AND WESTERN ASIA", "Northern Africa",
                "Western Asia", "CENTRAL AND SOUTHERN ASIA", "Central Asia", "Southern Asia",
                "EASTERN AND SOUTH-EASTERN ASIA", "Eastern Asia", "South-Eastern Asia",
                "LATIN AMERICA AND THE CARIBBEAN", "Caribbean", "Central America", "South America",
                "OCEANIA", "Australia / New Zealand", "Melanesia", "Micronesia", "Polynesia", 
                "EUROPE AND NORTHERN AMERICA", "EUROPE", "Eastern Europe", "Northern Europe",
                "Southern Europe", "Western Europe", "NORTHERN AMERICA", "WORLD", "Sub-Saharan Africa",
                "Northern Africa and Western Asia", "Central and Southern Asia", "  Eastern and South-Eastern Asia",
                "Latin America and the Caribbean", "Oceania (excluding Australia and New Zealand)",
                "Australia and New Zealand", "Europe and Northern America", "Developed regions",
                "Less developed regions", "Less developed regions, excluding least developed countries",
                "Less developed regions, excluding China", "Least developed countries", 
                "Land-locked Developing Countries (LLDC)", "Small island developing States (SIDS)",
                "High-income countries", "Middle-income countries", "Upper-middle-income countries",
                "Lower-middle-income countries", "Low-income countries", "AFRICA", "ASIA", "EUROPE",
                "Eastern and South-Eastern Asia"]

start_year = 1980
end_year = 2013

country_files = os.listdir(un_2015_revision_dir)

years = [str(x) for x in list(range(start_year, end_year + 1))]
new_headers = ["origin_country", "destination_country"]
new_headers.extend(years)
data = [new_headers]

# Get extra data to patch the existing data
data_2015 = processData(un_2019_data_fname, 1, 1453, 1712, 14)
data_2017 = processData(un_2017_data_fname, 1, 1648, 1904, 14)
data_2019 = processData(un_2019_data_fname, 1, 1736, 1995, 14)

df_2020 = pd.read_excel(un_2020_data_fname, 1)
headers = list(df_2020.iloc[9])
df_2020 = df_2020[6521:37062 + 1]
df_2020.columns = headers

# df_2020.to_csv(base_dir + "test4.csv")

data_2020 = dict()
for row in df_2020.itertuples(index=False):
    destination_country = row[1].strip()
    # some countries have * at the end, but we want the names to match
    if destination_country[-1] == "*":
        destination_country = destination_country[:-1]
    
    origin_country = row[5].strip()
    if origin_country[-1] == "*":
        origin_country = origin_country[:-1]

    if destination_country not in ignored_headers and origin_country not in ignored_headers:
        data_2020[(origin_country, destination_country)] = row[13]

for c in country_files:
    # ignore the extra files that are created when you open files
    if c[:2] != "~$":
        df = pd.read_excel("/".join([un_2015_revision_dir, c]), 1)

        reporting_country = df["Unnamed: 0"][15].split(":")[-1].strip()
        # put headers in string format (convert floats to ints if needed)
        headers = [str(int(x)) if isinstance(x, (np.floating, int)) and not math.isnan(x) else x for x in list(df.iloc[19])]
        # rename the columns and ignore all the decorative headers
        df.columns = headers
        df = df[20:]

        # determining origin and destination countries based on dataset documentation
        df["destination_country"] = ""
        df["origin_country"] = ""
        df.loc[df.Type == "Emigrants", "destination_country"] = df.OdName
        df.loc[df.Type == "Emigrants", "origin_country"] = reporting_country
        df.loc[df.Type == "Immigrants", "destination_country"] = reporting_country
        df.loc[df.Type == "Immigrants", "origin_country"] = df.OdName

        # just grab the necessary info
        filtered_df = df[new_headers].copy()
        temp = filtered_df.to_numpy().tolist()
        data.extend(temp)

extra_years = [str(x) for x in list(range(2014, 2021))]
data[0].extend(extra_years)

# add in the yearly data from the other spreadsheets
for d in data[1:]:
    # pad the years we don't have data for to keep the ordering consistent
    # 2014
    d.append("..")

    temp = (d[0], d[1])
    if temp in data_2015:
        d.append(data_2015[temp])
    else:
        d.append("..")

    # 2016
    d.append("..")

    if temp in data_2017:
        d.append(data_2017[temp])
    else:
        d.append("..")

    # 2018
    d.append("..")

    if temp in data_2019:
        d.append(data_2019[temp])
    else:
        d.append("..")

    if temp in data_2020:
        d.append(data_2020[temp])
    else:
        d.append("..")

try:
    with open(base_dir + "migration_data.csv", 'w', newline="") as waf:
        writer = csv.writer(waf)
        writer.writerows(data)
    ok_open = True
except Exception as e:
    ok_open = False

if not ok_open:
    raise AssertionError("File couldn't be written to.")

    