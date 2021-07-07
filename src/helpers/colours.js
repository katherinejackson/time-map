import { colours } from "../constants";

export const getManualIntervalColour = (pt, colourSet, intervalSet) => {
    let counter = 0
    let bracket;
    try {
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
        const middle = interval.lowest + interval.range / 2
        p5.colorMode(p5.HSB, 360, interval.range / 2, 1)
        if (pt > middle) {
            p5.fill(0, Math.abs(middle - pt), 1)
        } else {
            p5.fill(220, Math.abs(middle - pt), 1)
        }
    } else if (numColours === 360) {
        const range = interval.highest - interval.lowest
        const newPt = Math.floor((range - (-1 * interval.lowest + pt)) * 270 / range)
        p5.colorMode(p5.HSB, 360, 100, 100)
        p5.fill(newPt, 100, 95)
    }

    p5.colorMode(p5.RGB)
}

export const fillLogColourGradient = (p5, pt, max, numColours) => {
    let scaledPt = 0
    if (pt > 0) {
        scaledPt = Math.floor(Math.log10(pt) / max * 256)
    }

    if (numColours === 1) {
        p5.colorMode(p5.HSB, 255, 255, 1)
        p5.fill(0, scaledPt, 1)
        p5.colorMode(p5.RGB)
    } else if (numColours === 256) {
        p5.fill(colours['COVID'][256][scaledPt])
    }



}

