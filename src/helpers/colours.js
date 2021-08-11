import { colours, manualIntervals } from "../constants";

export const setColour = (p5, pt, numColours, interval, dataType) => {
    if (numColours === 1
        || numColours === 2
        || numColours === 256
        || numColours === 360
    ) {
        fillColourGradient(p5, pt, interval, numColours)
    } else if (dataType === 'COVID' && numColours === 8) {
        const colour = getCovidIntervalColour(pt, colours[dataType][numColours], manualIntervals[dataType][numColours])
        p5.fill(colour)
    } else {
        const colour = getColourFromSet(pt, interval.high, interval.interval, colours[dataType][numColours])
        p5.fill(colour)
    }
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

export const getColourFromSet = (pt, highest, interval, colourSet) => {
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
        const scaledPt = Math.abs(-1 * interval.low + pt)
        p5.colorMode(p5.HSB, 255, interval.range, 1)
        p5.fill(0, scaledPt, 1)
    } else if (numColours === 2) {
        const middle = interval.low + interval.range / 2
        p5.colorMode(p5.HSB, 360, interval.range / 2, 1)
        if (pt > middle) {
            p5.fill(0, Math.abs(middle - pt), 1)
        } else {
            p5.fill(220, Math.abs(middle - pt), 1)
        }
    } else if (numColours === 256) {
        const newPt = Math.floor(pt / interval.high * 256)
        p5.fill(colours['COVID'][256][newPt])
    } else if (numColours === 360) {
        const newPt = Math.floor((interval.range - (-1 * interval.low + pt)) * 270 / interval.range)
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

    if (colourSet[counter] === undefined) {
        console.log('error', pt, colourSet, counter)
    }

    return colourSet[counter]
}

