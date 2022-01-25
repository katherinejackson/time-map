from datetime import datetime, date
import re

file = open('/Users/norahr/Desktop/owid-covid-data.csv')
covidData = open("/Users/norahr/Desktop/data.txt", "w")

bigCount = 0
smallCount = 0
lines = []
bigData = {}
smallData = {}
for line in file:
	lines.append(re.split(',', line))

print(lines[3])

for line in lines[1:]:
	if line[1] != '' and line[48] != '' and line[5] != '' and line[61] != '' and line[62] != '':
		if line[0] not in bigData:
			bigCount = bigCount + 1
			bigData[line[0]] = {
			'continent': line[1],
			'location': line[2],
			'human_development_index': float(line[62]),
			'life_expectancy': float(line[61]),
			'population': float(line[48]),
			'cases': {
						'2020': [''] * 365,
						'2021': [''] * 365,
						'2022': [''] * 365,
					},
			}

		day = re.split('-| ', line[3])
		dayOfYear = date(int(day[0]), int(day[1]), int(day[2])).timetuple().tm_yday

		if (dayOfYear <= 365 and line[5] != ''):
			bigData[line[0]]['cases'][day[0]][dayOfYear -1] = float(line[5])


		# bigData[line[0]] = newData
		
		# if float(line[44]) > 1000000:
		# 	smallData[line[0]] = newData
			

# covidData.write('export const smallData = ' + str(smallData) + '\n')
covidData.write('export const bigData = ' + str(bigData))
print(str(bigCount) + ' countries')
# print(str(smallCount) + ' countries')


file.close()