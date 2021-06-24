import {manualIntervals} from '../constants'

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