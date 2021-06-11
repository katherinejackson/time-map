import {colours, manualIntervals, radianPerDay, rectValues, spiralValues} from "./constants";
import {fillColourGradient, getColour, getManualIntervalColour} from "./helpers";

export const rectangle = (
    dataType,
    interval,
    locationData,
    locationX,
    locationY,
    mapPin,
    p5,
    selections,
    x,
    y,
) => {
    const daysPerRow = Math.ceil(365/selections[rectValues.NUM_ROWS])
    if (mapPin) {
        p5.stroke(50)
        p5.fill(50)
        p5.triangle(locationX, locationY, locationX - 5, locationY - 5, locationX + 5, locationY - 5)
        p5.fill(225)
        p5.rect(x - 2, y - 2, daysPerRow * selections[rectValues.DAY_WIDTH] + 4, ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * locationData.length) + 4, 5)
        p5.noStroke()
    }

    let startX = x
    let rowCounter = 1
    locationData.forEach(year => {
        year.forEach(pt => {
            if (dataType === 'WIND' || dataType === 'PRECIP') {
                const colour = getManualIntervalColour(pt, colours[dataType][selections[rectValues.NUM_COLOURS]], manualIntervals[dataType][selections[rectValues.NUM_COLOURS]])
                p5.fill(colour)
            } else {
                if (selections[rectValues.NUM_COLOURS] === 1
                    || selections[rectValues.NUM_COLOURS] === 2
                    || selections[rectValues.NUM_COLOURS] === 360
                ) {
                    fillColourGradient(p5, pt, interval, selections[rectValues.NUM_COLOURS])
                } else {
                    const colour = getColour(pt, interval.highest, interval.interval, colours[dataType][selections[spiralValues.NUM_COLOURS]])
                    p5.fill(colour)
                }
            }
            

            p5.rect(x, y, 1, selections[rectValues.ROW_HEIGHT])

            if (rowCounter >= daysPerRow) {
                x = startX
                y = y + selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT]
                rowCounter = 1
            } else {
                x = x + selections[rectValues.DAY_WIDTH]
                rowCounter++
            }
        })
    })
}

export const spiral = (
    dataType,
    interval,
    locationData,
    locationX,
    locationY,
    mapPin,
    p5,
    radius,
    selections,
    startX,
    startY,
) => {
    let spiralWidth = selections[spiralValues.SPIRAL_WIDTH]
    let spiralTightness = selections[spiralValues.SPACE_BETWEEN_SPIRAL]
    let angle = -Math.PI/2
    let coreSize = selections[spiralValues.CORE_SIZE];
    if (mapPin) {
        p5.stroke(50)
        p5.fill(50)
        p5.triangle(locationX, locationY, locationX - 5, locationY - 15, locationX + 5, locationY - 15)
        p5.noFill()
        p5.ellipse(startX, startY, radius * 2, radius * 2 + 2)
        p5.noStroke()
    }

    locationData.forEach(year => {
        year.forEach(pt => {
            let x = startX + p5.cos(angle) * coreSize
            let y = startY + p5.sin(angle) * coreSize

            if (dataType === 'WIND' || dataType === 'PRECIP') {
                const colour = getManualIntervalColour(pt, colours[dataType][selections[spiralValues.NUM_COLOURS]], manualIntervals[dataType][selections[rectValues.NUM_COLOURS]])
                p5.fill(colour)
            } else {
                if (selections[spiralValues.NUM_COLOURS] === 1
                    || selections[spiralValues.NUM_COLOURS] === 2
                    || selections[spiralValues.NUM_COLOURS] === 360
                ) {
                    fillColourGradient(p5, pt, interval, selections[spiralValues.NUM_COLOURS])
                } else {
                    const colour = getColour(pt, interval.highest, interval.interval, colours[dataType][selections[spiralValues.NUM_COLOURS]])
                    p5.fill(colour)
                }
            }

            p5.arc(x, y, spiralWidth, spiralWidth, angle, angle + radianPerDay * 50, p5.PIE)
            angle += radianPerDay
            coreSize += spiralTightness
        })
    })
}

export const getSpiralSize = (selections, numLocations) => {
    let spiralWidth = selections[spiralValues.SPIRAL_WIDTH] + (numLocations * 3)
    let spiralTightness = spiralWidth/600
    return {spiralWidth, spiralTightness}
}

export const getRadius = (selections, locationData) => {
    let numYears = locationData ? locationData.length : selections[rectValues.NUM_YEARS]
    return Math.abs(Math.sin(-1.5 + radianPerDay * 365 * numYears)
        * (selections[spiralValues.CORE_SIZE] + selections[spiralValues.SPACE_BETWEEN_SPIRAL] * 365 * numYears))
        + selections[spiralValues.SPIRAL_WIDTH]/2
}

export const getRowSize = (selections, numLocations) => {
    const daysPerRow = Math.ceil(365/selections[rectValues.NUM_ROWS])
    const dayWidth = selections[rectValues.DAY_WIDTH] + numLocations/ 25
    const rowWidth = daysPerRow * dayWidth
    const rowHeight = selections[rectValues.ROW_HEIGHT] + numLocations * 1.5

    return {dayWidth, rowWidth, rowHeight}
}

