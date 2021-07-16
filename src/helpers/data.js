import { rectValues, spiralValues } from "../constants";

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

        data[id]['averages'] = {...data[id]['averages'], [variable]: total/num}
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

    for (let year = 0; year < selections[rectValues.NUM_YEARS]; year++) {
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
    if (years.length - selections[spiralValues.NUM_YEARS] > 0) {
        years = years.slice(years.length - selections[spiralValues.NUM_YEARS], years.length)
    }

    years.forEach(year => {
        newData.push(data[id].data[year])
    })

    return newData
}


