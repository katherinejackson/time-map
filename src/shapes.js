import { colours, manualIntervals, radianPerDay, radianPerMonth, rectValues, spiralValues, months, yearIndicators, monthColours } from "./constants";
import { fillColourGradient, getColour, getManualIntervalColour } from "./helpers";

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
    opaque,
) => {
    const daysPerRow = Math.ceil(365 / selections[rectValues.NUM_ROWS])
    if (mapPin) {
        p5.stroke(50)
        p5.fill(50)
        p5.triangle(locationX, locationY, locationX - 5, locationY - 5, locationX + 5, locationY - 5)
        if (opaque) {
            p5.fill(255)
        } else {
            p5.noFill()
        }
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
    opaque,
    hover,
    yearIndicator,
) => {
    let spiralWidth = selections[spiralValues.SPIRAL_WIDTH]
    let spiralTightness = selections[spiralValues.SPACE_BETWEEN_SPIRAL]
    let angle = -Math.PI / 2
    let coreSize = selections[spiralValues.CORE_SIZE];

    if (hover && yearIndicator === yearIndicators.CLOCK.val) {
        let tempData = locationData
        tempData.push([])
        let newRadius = getRadius(selections, tempData)

        p5.fill(255, 255, 255, 150)
        p5.ellipse(startX, startY, newRadius * 2 + 20, newRadius * 2 + 20)
    } else {
        if (mapPin) {
            if (yearIndicator !== yearIndicators.CIRCLE.val) {
                p5.stroke(50)
            }
            p5.fill(50)
            p5.triangle(locationX, locationY, locationX - 5, locationY - 15, locationX + 5, locationY - 15)
    
            if (opaque) {
                p5.fill(255)
            } else {
                p5.noFill()
            }
    
            p5.ellipse(startX, startY, radius * 2, radius * 2 + 2)
            p5.noStroke()
        } else if (opaque) {
            p5.fill(255, 255, 255, 200)
            p5.ellipse(startX, startY, radius * 2, radius * 2 + 2)
        }
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

    if (hover && yearIndicator === yearIndicators.CLOCK.val) {
        p5.fill("black")
        coreSize += spiralTightness * 365
        angle = -Math.PI/2
        for (let i = 0; i < 12; i++) {
            let textCore = coreSize
            textCore += spiralTightness/4 * 365
            let xText = startX + p5.cos(angle) * textCore
            let yText = startY + p5.sin(angle) * textCore

            p5.text(months[i], xText, yText)

            angle += radianPerMonth
            coreSize += spiralTightness
        }
    }

    if (yearIndicator === yearIndicators.CIRCLE.val) {
        coreSize += spiralTightness * 365
        angle = -Math.PI/2
        p5.stroke(50)
        for (let i = 0; i < 12; i++) {
            p5.noFill()
            p5.stroke(monthColours[i])
            p5.arc(startX, startY, radius * 2 + 2, radius * 2 + 2, angle, angle + radianPerMonth, p5.PI)
            angle += radianPerMonth
        }

        p5.noStroke()
    } else if (yearIndicator === yearIndicators.TICKS.val) {
        p5.fill("black")
        coreSize += spiralTightness * 365
        angle = -Math.PI/2
        for (let i = 0; i < 12; i++) {
            let lineCore = coreSize
            lineCore += spiralTightness/4 * 365
            let x1 = startX + p5.cos(angle) * coreSize
            let y1 = startY + p5.sin(angle) * coreSize
            let x2 = startX + p5.cos(angle) * lineCore
            let y2 = startY + p5.sin(angle) * lineCore

            p5.stroke(50)
            p5.line(x1, y1, x2, y2)
            p5.noStroke()

            angle += radianPerMonth
            coreSize += spiralTightness
        }
    }

}

export const getSpiralSize = (selections, numLocations) => {
    let spiralWidth = selections[spiralValues.SPIRAL_WIDTH] + (numLocations * 3)
    let spiralTightness = spiralWidth / 600
    return { spiralWidth, spiralTightness }
}

export const getRadius = (selections, locationData) => {
    let numYears = locationData ? locationData.length : selections[rectValues.NUM_YEARS]
    return Math.abs(Math.sin(-1.5 + radianPerDay * 365 * numYears)
        * (selections[spiralValues.CORE_SIZE] + selections[spiralValues.SPACE_BETWEEN_SPIRAL] * 365 * numYears))
        + selections[spiralValues.SPIRAL_WIDTH] / 2
}

export const getRowSize = (selections, numLocations) => {
    const daysPerRow = Math.ceil(365 / selections[rectValues.NUM_ROWS])
    const dayWidth = selections[rectValues.DAY_WIDTH] + numLocations / 25
    const rowWidth = daysPerRow * dayWidth
    const rowHeight = selections[rectValues.ROW_HEIGHT] + numLocations * 1.5

    return { dayWidth, rowWidth, rowHeight }
}

