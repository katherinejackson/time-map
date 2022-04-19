import { colours, manualIntervals } from "../constants";

export const setColour = (p5, pt, numColours, interval, dataType) => {
    if (numColours === 1
        || numColours === 2
        || numColours === 256
        || numColours === 360
    ) {
        fillColourGradient(p5, pt, interval, numColours)
    } else if (dataType === 'COVID') {
        numColours = 6
        const colour = getCovidIntervalColour(pt, colours[dataType][numColours], manualIntervals[dataType][numColours])
        p5.fill(colour)
    } else {
        const colour = getColourFromSet(pt, interval, colours[dataType][numColours])
        p5.fill(colour)
    }
}

export const getManualIntervalColour = (pt, colourSet, intervalSet) => {
    let counter = 0

    //console.log(intervalSet)

    while (pt > intervalSet[counter + 1]) {
        counter++
    }

    if (colourSet[counter] === undefined) {
        console.log('error', pt, colourSet, counter)
    }

    return colourSet[counter]
}

export const getColourFromSet = (pt, interval, colourSet) => {
    const bracket = Math.floor((pt - interval.low)/ interval.interval)
    const length = colourSet.length

    if (colourSet[length - bracket - 1]) {
        return colourSet[length - bracket - 1]
    } else {
        return 'white'
    }
}

export const fillColourGradient = (p5, pt, brackets, numColours) => {
    const { high, low, range } = brackets
    //console.log(brackets)
    if (numColours === 1) {
        const scaledPt = Math.abs(-1 * low + pt)
        p5.colorMode(p5.HSB, 255, range, 1)
        p5.fill(0, scaledPt, 1)
    } else if (numColours === 2) {
        const middle = low + range / 2
        p5.colorMode(p5.HSB, 360, range / 2, 1)
        if (pt > middle) {
            p5.fill(0, Math.abs(middle - pt), 1)
        } else {
            p5.fill(220, Math.abs(middle - pt), 1)
        }
    } else if (numColours === 256) {
        const newPt = Math.floor(pt / high * 256)
        p5.fill(colours['COVID'][256][newPt])
    } else if (numColours === 360) {
        const newPt = Math.floor((range - (-1 * low + pt)) * 255 / range)
        //sconsole.log(pt, newPt)
        p5.colorMode(p5.HSB, 360, 100, 100)
        p5.fill(newPt, 100, 95)
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