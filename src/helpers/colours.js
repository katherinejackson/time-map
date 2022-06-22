import { colours, magma, redBlue, viridis } from "../constants";

export const setColour = (p5, pt, numColours, interval, dataType) => {
    fillColourGradient(p5, pt, interval, numColours)
}

export const getManualIntervalColour = (pt, colourSet, intervalSet) => {
    let counter = 0

    while (pt > intervalSet[counter + 1]) {
        counter++
    }

    if (colourSet[counter] === undefined) {
        console.log('error', pt, colourSet, counter)
    }

    return colourSet[counter]
}

export const getColourFromSet = (pt, interval, colourSet) => {
    const bracket = Math.floor((pt - interval.low) / interval.interval)
    const length = colourSet.length

    if (colourSet[length - bracket - 1]) {
        return colourSet[length - bracket - 1]
    } else {
        return 'white'
    }
}

export const fillColourGradient = (p5, pt, brackets, numColours) => {
    const { low, range } = brackets
    if (numColours === 'rainbow') {
        const newPt = Math.floor((range - (-1 * low + pt)) * 270 / range)
        p5.colorMode(p5.HSB, 360, 100, 100)
        p5.fill(newPt, 100, 95)
    } else if (numColours === 'viridis') {
        const newPt = Math.floor(Math.max((pt - low), 0) * 256 / range)
        if (newPt >= 0 && newPt <= 255) {
            p5.fill(p5.color(viridis[newPt]))
        } else {
            console.log(low, pt, newPt)
            p5.fill(0)
        }
    } else if (numColours === 'magma') {
        const newPt = Math.floor(Math.max((pt - low), 0) * 256 / range)
        if (newPt >= 0 && newPt <= 255) {
            p5.fill(p5.color(magma[newPt]))
        } else {
            console.log(low, pt, newPt)
            p5.fill(0)
        }
    } else if (numColours === 'redBlue') {
        const newPt = Math.floor(Math.max((pt - low), 0) * 256 / range)
        if (newPt >= 0 && newPt <= 255) {
            p5.fill(p5.color(redBlue[255 - newPt]))
        } else {
            console.log(low, pt, newPt)
            p5.fill(0)
        }
    }

    p5.colorMode(p5.RGB)
}

export const strokeColourGradient = (p5, pt, interval, numColours) => {
    if (numColours === 1) {
        const scaledPt = Math.abs(-1 * interval.low + pt)
        p5.colorMode(p5.HSB, 255, interval.range, 1)
        p5.stroke(0, scaledPt, 1)
    } else if (numColours === 2) {
        const middle = interval.low + interval.range / 2
        p5.colorMode(p5.HSB, 360, interval.range / 2, 1)
        if (pt > middle) {
            p5.stroke(0, Math.abs(middle - pt), 1)
        } else {
            p5.stroke(220, Math.abs(middle - pt), 1)
        }
    } else if (numColours === 256) {
        const newPt = Math.floor(pt / interval.high * 256)
        p5.stroke(colours['COVID'][256][newPt])
    } else if (numColours === 360) {
        const newPt = Math.floor((interval.range - (-1 * interval.low + pt)) * 270 / interval.range)
        p5.colorMode(p5.HSB, 360, 100, 100)
        p5.stroke(newPt, 100, 95)
    }

    p5.colorMode(p5.RGB)
}

export const fillLogColourGradient = (p5, pt, max, numColours) => {
    let scaledPt = 0
    if (pt > 0) {
        scaledPt = Math.floor(pt / max * 256)
    }

    if (numColours === 1) {
        p5.colorMode(p5.HSB, 255, 255, 1)
        p5.fill(0, scaledPt, 1)
        p5.colorMode(p5.RGB)
    } else if (numColours === 256) {
        p5.fill(colours['COVID'][256][scaledPt])
    }
}

export const getCovidIntervalColour = (pt, colourSet, intervalSet) => {
    let counter = 0

    while (pt > Math.log10(intervalSet[counter + 1])) {
        counter++
    }

    return colourSet[colourSet.length - counter - 1]
}