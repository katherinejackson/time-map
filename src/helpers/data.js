import { bigData as covidData } from "../data/covidData";
import { data as tradeData } from "../data/tradeData"
import {data as mapData} from "../data/weatherData"
import { views, dataSets } from "../constants";
import { alaska } from "../data/locationCoords";

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
        Object.keys(data[id].data).forEach(year => {
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
    })

    lowest = Math.round(lowest * 100) / 100
    highest = Math.round(highest * 100) / 100

    return { low: lowest, high: highest }
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
        Object.keys(data[id][variable]).forEach(year => {
            data[id][variable][year].forEach(day => {
                if (!high || day > high) {
                    high = day
                }
            })
        })
    })

    return { high, low }
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

export const getData = (view) => {
    if (view === views.SCATTER.val) {
        const logData = getLogData(covidData)
        const dataBrackets = getDataBracketsMultiYear(logData, 'cases')
        const dataType = dataSets.COVID.val
        const yBrackets = getVariableBrackets(covidData, 'population')
        const categories = getDataCategories(covidData, 'continent')

        let total = 0
        Object.keys(categories).forEach(cat => {
            total += categories[cat]
        })

        return { data: logData, dataType, dataBrackets, yBrackets, categories, totalDataPts: total }

    } else if (view === views.GRAPH.val) {
        let var1 = 'import'
        let var2 = 'tradeBalance'
        const dataBrackets = getTradeDataBrackets(tradeData, var1)
        const dataType = dataSets.TRADE.val
        getAverage(tradeData, var2)

        return { data: tradeData, dataType, dataBrackets, variable: var1 }

    } else if (view === views.COMPARISON.val || view === views.MAP.val) {
        let data = mapData[dataSets.TEMP.id].data
        const dataType = dataSets.TEMP.val
        const dataBrackets = getDataBrackets(data)

        // getDataInfo(data, dataBrackets)

        return { data, dataType, dataBrackets }
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
    let highest = {val: 0, year: null}
    Object.keys(yearTotals).forEach(year => {
        if (!highest.year || yearTotals[year] > highest.val) {
            highest = {val: yearTotals[year], year}
        }
    }) 

    newData[highest.year] = data[highest.year]

    return newData
}

const getDataInfo = (data, dataBrackets) => {
    Object.keys(data).forEach((location, index) => {
        const locationData = data[location].data
        const years = Object.keys(locationData)
        const locationInfo = {}
    
        let numDaysAbove25 = 0
        let numDaysBelow30 = 0
        years.forEach(year => {
            const yearData = locationData[year]
    
            yearData.forEach(day => {
                if (day === dataBrackets.high) {
                    locationInfo['highestTemp'] = true
                }

                if (day === dataBrackets.low) {
                    locationInfo['lowestTemp'] = true
                }

                if (day >= 25) {
                    numDaysAbove25++
                }

                if (day < -30) {
                    numDaysBelow30++
                }
            })
        })

        locationInfo['daysAbove25'] = numDaysAbove25
        locationInfo['daysBelow30'] = numDaysBelow30

        console.log(alaska[index].name, locationInfo)
    })


}

const getLogData = (data) => {
    const logData = JSON.parse(JSON.stringify(data))

    Object.keys(data).forEach(id => {
       Object.keys( data[id]['cases']).forEach(year => {
        let yearData = data[id]['cases'][year]
        let logYear = []
        yearData.forEach(day => {
            if (day > 0) {
                logYear.push(Math.log10(day))
            } else if (day === ''){
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
