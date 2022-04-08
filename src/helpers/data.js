import { scaleLinear } from "d3";
import { bigData as covidData } from "../data/covidData2022";
import { data as tradeData } from "../data/tradeData"
import { tempData as mapData, tempData } from "../data/tempData"
import { views, dataSets } from "../constants";
import { alaska } from "../data/locationCoords";
import { migrationData } from "../data/migrationData";

export const sortData = (pt) => {
    if (pt < -15) {
        return 0
    } else if (pt < 0) {
        return 1
    } else if (pt > 15) {
        return 3
    } else if (pt >= 0) {
        return 2
    }
}

export const getDataBrackets = (data) => {
    let highest;
    let lowest;

    Object.keys(data).forEach(id => {
        const years = Object.keys(data[id].data)
        const year = years[0]
        data[id].data[year].forEach(pt => {
            if (pt) {
                if (!highest || pt > highest) {
                    highest = pt
                }

                if (!lowest || pt < lowest) {
                    lowest = pt
                }
            }
        })
    })


    lowest = Math.round(lowest * 100) / 100
    highest = Math.round(highest * 100) / 100

    return { low: lowest, high: highest, range: highest - lowest }
}

export const getVariableBrackets = (data, variable) => {
    let high;
    let low;

    Object.keys(data).forEach(id => {
        if (!high || data[id][variable] > high) {
            high = data[id][variable]
        }

        if ((!low || data[id][variable] < low) && data[id][variable] > 0) {
            low = data[id][variable]
        }
    })

    return { high, low }
}

export const getDataBracketsMultiYear = (data, variable) => {
    let high;
    let low = 0;

    Object.keys(data).forEach(id => {
        //console.log("id ", data[id] )
        Object.keys(data[id][variable]).forEach(year => {
            data[id][variable][year].forEach(day => {
                //console.log("day ", day)
                if (!high || day > high) {
                    high = day
                }
            })
        })
    })

    //console.log(variable)

    //console.log("h ", high, low)

    return { high, low, range: high - low }
}

export const getTradeDataBrackets = (data, variable) => {
    let high;
    let low;

    Object.keys(data).forEach(id => {
        Object.keys(data[id]['data']).forEach(year => {
            let value = parseFloat(data[id]['data'][year][variable])
            if (!high || value > high) {
                high = value
            }

            if (!low || value < low) {
                low = value
            }
        })
    })

    return { high, low }
}

export const getMigrationDataBrackets = (data) => {
    let highest;
    let lowest;

    Object.keys(data).forEach(id => {
        Object.keys(data[id]["data"]).forEach(year => {
            let value = data[id]["data"][year];
            // ignore -1 since it indicates missing data and not a value
            if (value !== -1) {
                if (!highest || value > highest) {
                    highest = value
                }
                if (!lowest || value < lowest) {
                    lowest = value
                }
            }
        });
    });

    return { low: lowest, high: highest, range: highest - lowest }
}

export const getAverage = (data, variable) => {
    let total = 0
    let num = 0

    Object.keys(data).forEach(id => {
        Object.keys(data[id]['data']).forEach(year => {
            let value = parseFloat(data[id]['data'][year][variable])
            total = total + value
            num++
        })

        data[id]['averages'] = { ...data[id]['averages'], [variable]: total / num }
    })
}

export const getDataCategories = (data, variable) => {
    let categories = {}

    Object.keys(data).forEach(id => {
        if (!Object.keys(categories).includes(data[id][variable])) {
            categories[data[id][variable]] = 1
        } else {
            categories[data[id][variable]] = categories[data[id][variable]] + 1
        }
    })

    return categories
}

export const averageData = (locations, selections, allData) => {
    let data = []
    let newData = []

    locations.forEach(id => {
        data.push(getLocationData(id, selections, allData))
    })

    for (let year = 0; year < selections.numYears; year++) {
        let newYear = []
        for (let day = 0; day < 365; day++) {
            let sum = 0
            let counter = 0

            for (let loc = 0; loc < data.length; loc++) {
                if (data[loc] && data[loc][year] && data[loc][year].length > day) {
                    if (data[loc][year][day] !== '') {
                        sum += data[loc][year][day]
                        counter++
                    }
                }
            }

            if (counter !== 0) {
                newYear.push(Math.ceil(sum / counter * 100) / 100)
            } else {
                newYear.push('')
            }
        }

        if (newYear.length) {
            newData.push(newYear)
        }
    }

    return newData
}

export const getLocationData = (id, selections, data) => {
    let newData = []

    let years = Object.keys(data[id].data)
    console.log(id)
    console.log(data[id])
    let currentYearIndex = years.indexOf('2021')
    if (currentYearIndex > -1) {
        years.splice(currentYearIndex, 1)
    }

    if (years.length - selections.numYears > 0) {
        years = years.slice(years.length - selections.numYears, years.length)
    }

    years.forEach(year => {
        newData.push(data[id].data[year])
    })

    return newData
}

const getDataByPopulation = (data, population) => {
    const newData = {}

    Object.keys(data).forEach(country => {

        if (data[country]['population'] >= population) {
            newData[country] = data[country]
        }
    })

    //console.log(Object.keys(newData).length + ' countries')

    return newData
}

const getDataByContinent = (data, continents) => {
    const newData = {}

    Object.keys(data).forEach(country => {
        if (continents.includes(data[country]['continent'])) {
            newData[country] = data[country]
        }
    })

    //console.log(Object.keys(newData).length + ' countries')

    return newData
}

export const filterMigrationData = (data, countries, isPractice) => {
    const newData = {}
    Object.keys(data).forEach(country => {
        if (countries.includes(country)) {
            if (isPractice) newData[country] = data[country]
        }
        else if (!countries.includes(country)) {
            if (!isPractice) newData[country] = data[country]
        }
    })
    return newData
}

export const getData = (view, practice) => {
    if (view === views.SCATTER.val) {
        let data = covidData

        if (practice) {
            data = getDataByContinent(data, ['Europe'])
            data = getDataByPopulation(data, 60000000)
        } else {
            data = getDataByContinent(data, ['North America', 'Asia'])
            //console.log("d ", data)
            data = getDataByPopulation(data, 10000000)
        }

        const dataBrackets = getDataBracketsMultiYear(data, 'cases')
        const logData = getLogData(data)
        const logDataBrackets = getDataBracketsMultiYear(logData, 'cases')
        const dataType = dataSets.COVID.val
        const yBrackets = getVariableBrackets(data, 'population')
        const xBrackets = getVariableBrackets(data, 'human_development_index')
        const combinedBrackets = {...logDataBrackets, displayHigh: dataBrackets.high, displayLow: dataBrackets.low}

        // getCovidDataInfo(data)
        //console.log(Object.keys(data).length + ' countries')

        return { data: logData, dataType, dataBrackets: combinedBrackets, yBrackets, xBrackets }

    } else if (view === views.GRAPH.val) {
        let var1 = 'import'
        let var2 = 'tradeBalance'
        const dataBrackets = getTradeDataBrackets(tradeData, var1)
        const dataType = dataSets.TRADE.val
        getAverage(tradeData, var2)

        return { data: tradeData, dataType, dataBrackets, variable: var1 }

    } else if (view === views.COMPARISON.val || view === views.MAP.val || view === views.MULTI_COMPARISON.val) {
        


        const data = mapData
        const dataType = dataSets.TEMP.val
        const unscaledDataBrackets = getDataBrackets(data)

        // scale the data so it begins evenly at -35 and ends at 30
        const newScale = scaleLinear()
        .domain([unscaledDataBrackets.low, unscaledDataBrackets.high])
        .range([-35, 30]);

        data.forEach(d => {
            for (let val in d.data) {
                let temp = []
                let tempData = d.data[val]
                for (let i=0; i<tempData.length; i++) {
                    if (val !== '') temp.push(newScale(tempData[i]))
                    else temp.push(tempData[i])
                }
                d.data[val] = temp
            }
        })

        const dataBrackets = getDataBrackets(data)


        // mapData.forEach(i => {
        //     console.log(i.name, Object.keys(i.data))
        // })

        // getMapDataInfo(data, dataBrackets)

        //console.log({ data, dataType, dataBrackets })

        return { data, dataType, dataBrackets }
    }
    else if (view === views.MIGRATION_GRAPH.val) {
        const data = migrationData;
        const dataType = dataSets.MIGRATION.val
        const dataBrackets = getMigrationDataBrackets(data)
        const logData = getLogMigrationData(data);
        const logDataBrackets = getMigrationDataBrackets(logData)
        const combinedBrackets = {...logDataBrackets, displayHigh: dataBrackets.high, displayLow: dataBrackets.low}

        return { data: logData, dataType, dataBrackets: combinedBrackets }
    }

    return {}
}

const getMaxData = (data) => {
    const years = Object.keys(data)
    const yearTotals = {}

    years.forEach(year => {
        const yearData = data[year]
        let numDayWithData = 0

        yearData.forEach(day => {
            if (day !== '') {
                numDayWithData++
            }
        })

        yearTotals[year] = numDayWithData
    })

    let newData = {}
    let highest = { val: 0, year: null }
    Object.keys(yearTotals).forEach(year => {
        if (!highest.year || yearTotals[year] > highest.val) {
            highest = { val: yearTotals[year], year }
        }
    })

    newData[highest.year] = data[highest.year]

    return newData
}

const getMapDataInfo = (data, dataBrackets) => {
    let mapInfo = {}

    const locations = []

    Object.keys(data).forEach((location, index) => {
        const locationData = data[location].data
        const years = Object.keys(locationData)
        
        let currentYearIndex = years.indexOf('2021')
        if (currentYearIndex > -1) {
            years.splice(currentYearIndex, 1)
        }

        const year = years[years.length - 1]
        const locationInfo = {}

        let numDaysAbove30 = 0
        let numDaysBelow30 = 0
        let numDaysAbove0 = 0
        let numDaysBelow0 = 0
        const yearData = locationData[year]

        yearData.forEach(day => {
            if (day === dataBrackets.high) {
                mapInfo['highestTemp'] = { name: alaska[index].name, value: day }
            }

            if (day === dataBrackets.low) {
                mapInfo['lowestTemp'] = { name: alaska[index].name, value: day }
            }

            if (day >= 30) {
                numDaysAbove30++
            }

            if (day < -30) {
                numDaysBelow30++
            }

            if (day > 0) {
                numDaysAbove0++
            } else {
                numDaysBelow0++
            }
        })

        locationInfo['daysAbove30'] = numDaysAbove30
        locationInfo['daysBelow30'] = numDaysBelow30
        locationInfo['daysAbove0'] = numDaysAbove0
        locationInfo['daysBelow0'] = numDaysBelow0
        locationInfo['name'] = alaska[index].name

        locations.push(locationInfo)

        // console.log(alaska[index].name, locationInfo)

    })

    mapInfo = { ...mapInfo, ...getTotals(locations) }
    console.log(mapInfo)
}

const getTotals = (locations) => {
    const findLargest = (variable) => {
        let current = null
        locations.forEach(location => {
            if (!current || current.value < location[variable]) {
                current = { name: location.name, value: location[variable] }
            }
        })

        return current
    }

    return {
        mostDaysAbove0: findLargest('daysAbove0'),
        mostDaysBelow0: findLargest('daysBelow0'),
        mostDaysAbove30: findLargest('daysAbove30'),
        mostDaysBelow30: findLargest('daysBelow30'),

    }
}

const getCovidDataInfo = (data) => {
    const info = {
        above100K: {},
        latestDay: null
    }

    Object.keys(data).forEach(country => {
        const countryData = data[country].cases
        let numDaysAbove100K = 0
        let firstDay = 0
        let year = '2020'

        const yearData = countryData[year]
        yearData.forEach((day, index) => {
            if (day > 100000) {
                numDaysAbove100K++
            }

            if (day && !firstDay) {
                firstDay = index
            }
        })

        if (numDaysAbove100K) {
            info['above100K'][country] = numDaysAbove100K
        }

        if (!info['latestDay'] || info['latestDay'].day < firstDay) {
            info['latestDay'] = { country, day: firstDay }
        }

    })
}

const getLogData = (data) => {
    const logData = JSON.parse(JSON.stringify(data))

    Object.keys(data).forEach(id => {
        Object.keys(data[id]['cases']).forEach(year => {
            let yearData = data[id]['cases'][year]
            let logYear = []
            yearData.forEach(day => {
                if (day > 0) {
                    logYear.push(Math.log10(day))
                } else if (day === '') {
                    logYear.push('')
                } else {
                    logYear.push(0)
                }
            })

            logData[id]['cases'][year] = logYear
        })

    })

    return logData
}

const getLogMigrationData = (data) => {
    const logData = JSON.parse(JSON.stringify(data))
    Object.keys(data).forEach(id => {
        Object.keys(data[id]["data"]).forEach(year => {
            let val = data[id]["data"][year]
            let logVal;
            //console.log(val)
            if (val > 0) {
                logVal = Math.log10(val)
            } else if (val === -1) {
                logVal = -1
            } else {
                logVal = 0
            }
            logData[id]["data"][year] = logVal
        })
    })

    return logData
}