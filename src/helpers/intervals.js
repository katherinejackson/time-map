import { manualIntervals } from '../constants'

export const getManualInterval = (dataBrackets, numColours, dataType) => {
    if (numColours === 0) {
        numColours = 8
    }

    let high = dataBrackets.high
    let low = dataBrackets.low
    let range = dataBrackets.high - dataBrackets.low

    return { intervals: manualIntervals[dataType][numColours], high, low, range }
}

export const getInterval = (dataBrackets) => {
    const range = dataBrackets.high - dataBrackets.low

    return { range, high: dataBrackets.high, low: dataBrackets.low, range }
}

export const getRoundedInterval = (dataBrackets, numColours) => {
    const range = dataBrackets.high - dataBrackets.low
    const interval = Math.ceil((range) / 5) * 5
    const difference = interval - (dataBrackets.high - dataBrackets.low)
    const newHigh = Math.ceil((dataBrackets.high + difference / 2) / 5) * 5
    const newLow = Math.ceil((dataBrackets.low - difference / 2) / 5) * 5

    return { interval, high: newHigh, low: newLow, range }
}