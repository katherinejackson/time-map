import {formats, manualIntervals, spiralValues, spiralVariables, rectValues, rectVariables} from './constants'

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

export const getManualIntervalColour = (pt, colourSet, intervalSet) => {
    let counter = 0
    let bracket;
    try{
        bracket = intervalSet[counter]
    } catch (e) {
        console.log('error', pt, colourSet, intervalSet)
    }


    while (pt > bracket && counter < colourSet.length - 1) {
        counter++
        bracket = intervalSet[counter]
    }

    if (colourSet[counter] === undefined) {
        console.log('error', pt, colourSet, counter)
    }

    return colourSet[counter]
}

export const getColour = (pt, highest, interval, colourSet) => {
    let bracket = Math.floor((highest - pt) / interval)

    //TODO: shouldnt need this; there is some kind of bug
    if (bracket < 0) {
        bracket = 0
    } else if (bracket >= colourSet.length) {
        bracket = colourSet.length - 1
    }

    if (colourSet[bracket]) {
        return colourSet[bracket]
    } else {
        return 'white'
    }


}

export const fillColourGradient = (p5, pt, interval, numColours) => {
    if (numColours === 1) {
        const scaledPt = Math.abs(-1 * interval.lowest + pt)
        p5.colorMode(p5.HSB, 255, interval.range, 1)
        p5.fill(0, scaledPt, 1)
    } else if (numColours === 2) {
        const middle = interval.lowest + interval.range/2
        p5.colorMode(p5.HSB, 360, interval.range/2, 1)
        if (pt > middle) {
            p5.fill(0, Math.abs(middle - pt), 1)
        } else {
            p5.fill(220, Math.abs(middle - pt), 1)
        }
    } else if (numColours === 360) {
        const range = interval.highest - interval.lowest
        const newPt = (range - (-1 * interval.lowest + pt)) * 270/range
        p5.colorMode(p5.HSB, 360, 100, 100)
        p5.fill(newPt, 100, 95)
    }

    p5.colorMode(p5.RGB)
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

    lowest = Math.round(lowest * 100) /100
    highest = Math.round(highest * 100) /100

    return { lowest, highest }
}

export const getManualInterval = (dataBrackets, numColours, dataType) => {
    return {intervals: manualIntervals[dataType][numColours], highest: dataBrackets.highest, lowest: dataBrackets.lowest, range: dataBrackets.highest - dataBrackets.lowest }
}

export const getInterval = (dataBrackets, numColours) => {
    if (numColours === 360) {
        numColours = 1
    }

    const range = dataBrackets.highest - dataBrackets.lowest
    const interval = Math.ceil(range/numColours)

    return {interval, highest: dataBrackets.highest, lowest: dataBrackets.lowest, range}
}

export const getRoundedInterval = (dataBrackets, numColours) => {
    if (numColours === 360) {
        numColours = 1
    }

    const range = dataBrackets.highest - dataBrackets.lowest
    const interval = Math.ceil((range/numColours)/5) * 5
    const coverage = numColours * interval
    const difference = coverage - (dataBrackets.highest - dataBrackets.lowest)
    const newHigh = Math.ceil((dataBrackets.highest + difference/2)/5) * 5
    const newLow = Math.ceil((dataBrackets.lowest - difference/2)/5) * 5

    return {interval, highest: newHigh, lowest: newLow, range}
}

export const getDefaultSelections = (format, dataType) => {
    let selections = {}
    if (format === formats.SPIRAL.id) {
        Object.keys(spiralValues).forEach(val => {
            selections[spiralValues[val]] = spiralVariables[dataType][spiralValues[val]].default
        })
    } else {
        Object.keys(rectValues).forEach(val => {
            selections[rectValues[val]] = rectVariables[dataType][rectValues[val]].default
        })
    }

    return selections
}