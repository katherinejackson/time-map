import { colours, manualIntervals, radianPerDay, radianPerMonth, rectValues, spiralValues, months, yearIndicators, monthColours, abbreviatedMonths } from "./constants";
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
    hover, 
    yearIndication,
    fillMissing,
) => {
    const daysPerRow = Math.ceil(365 / selections[rectValues.NUM_ROWS])
    const rowWidth = daysPerRow * selections[rectValues.DAY_WIDTH]
    const pinHeight = ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * locationData.length - selections[rectValues.SPACE_BETWEEN_ROWS])
    if (hover && (yearIndication === yearIndicators.MONTHS.val || yearIndication === yearIndicators.MONTHS_TICKS.val) ) {
        p5.fill(255, 255, 255)
        p5.rect(x - 2, y - 10, rowWidth + 4, pinHeight + 10, 5)
    }
    
    if (mapPin) {
        p5.stroke(50)
        p5.fill(50)
        p5.triangle(locationX, locationY, locationX - 5, locationY - 5, locationX + 5, locationY - 5)
        if (opaque) {
            p5.fill(255)
        } else {
            p5.noFill()
        }
        p5.rect(x - 2, y - 2, rowWidth + 4, pinHeight + 4, 5)
        p5.noStroke()
    } else if (opaque) {
        p5.fill(255)
        p5.rect(x - 2, y - 2, rowWidth + 4, pinHeight + 4, 5)
    } 

    let startX = x
    let startY = y
    let rowCounter = 1
    locationData.forEach(year => {
        year.forEach(pt => {
            if (pt) {
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
            } else {
                if (fillMissing) {
                    p5.fill(150, 150, 150, 100)
                    p5.rect(x, y, 1, selections[rectValues.ROW_HEIGHT])
                }
            }
            
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

    if (yearIndication === yearIndicators.TICKS.val) {
        p5.stroke(50)
        
        const tickSpace = rowWidth/12
        for (let i = startX; i <= startX + rowWidth; i = i + tickSpace) {
            p5.line(i, startY - 3, i, startY - 1)
        } 

        p5.noStroke()
    } else if (yearIndication === yearIndicators.COLOURS.val) {
        const tickSpace = rowWidth/12
        for (let i = 0; i < 12; i++) {
            p5.fill(monthColours[i])
            p5.rect(startX + i * tickSpace, startY - 4, tickSpace, 2)
        } 

        p5.noStroke()
    } else if (yearIndication === yearIndicators.MONTHS.val && hover) {
        const tickSpace = rowWidth/12
        for (let i = 0; i < 12; i++) {
            p5.textSize(6)
            p5.fill(0)
            p5.text(abbreviatedMonths[i],startX + i * tickSpace + tickSpace/2, startY - 6)
        } 
    } else if (yearIndication === yearIndicators.MONTHS_TICKS.val && hover) {
        const tickSpace = rowWidth/12
        for (let i = 0; i < 12; i++) {
            p5.textSize(6)
            p5.fill(0)
            p5.text(abbreviatedMonths[i], startX + i * tickSpace + tickSpace/2, startY - 6)
            p5.stroke(0, 0, 0, 150)
            p5.line(startX + i * tickSpace, startY - 10, startX + i * tickSpace, startY + pinHeight)
            p5.noStroke()
        } 
    }
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
    fillMissing,
) => {
    let spiralWidth = selections[spiralValues.SPIRAL_WIDTH]
    let spiralTightness = selections[spiralValues.SPACE_BETWEEN_SPIRAL]
    let angle = -Math.PI / 2
    let coreSize = selections[spiralValues.CORE_SIZE];

    if (hover && (yearIndicator === yearIndicators.MONTHS.val || yearIndicator === yearIndicators.MONTHS_TICKS.val)) {
        let tempData = locationData
        tempData.push([])
        let newRadius = getRadius(selections, tempData)

        p5.fill(255, 255, 255, 150)
        p5.ellipse(startX, startY, newRadius * 2 + 20, newRadius * 2 + 20)
    } else {
        if (mapPin) {
            if (yearIndicator !== yearIndicators.COLOURS.val) {
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
            if (pt) {
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
    
                p5.arc(x, y, spiralWidth, spiralWidth, angle, angle + radianPerDay * 10, p5.PIE)
            } else {
                if (fillMissing) {
                    p5.fill(150, 150, 150, 100)
                    p5.arc(x, y, spiralWidth, spiralWidth, angle, angle + radianPerDay * 10, p5.PIE)
                }
            }

            angle += radianPerDay
            coreSize += spiralTightness
        })
    })

    if (hover && yearIndicator === yearIndicators.MONTHS.val) {
        p5.fill("black")
        let hoverCore = coreSize
        hoverCore += spiralTightness * 365
        angle = -Math.PI/2
        for (let i = 0; i < 12; i++) {
            let textCore = hoverCore
            textCore += spiralTightness/2 * 365
            let xText = startX + p5.cos(angle) * textCore
            let yText = startY + p5.sin(angle) * textCore

            p5.text(months[i], xText, yText)

            angle += radianPerMonth
            coreSize += spiralTightness
        }
    }

    if (hover && yearIndicator === yearIndicators.MONTHS_TICKS.val) {
        p5.fill("black")
        let innerCore = selections[spiralValues.CORE_SIZE]
        let outerCore = coreSize
        outerCore += spiralTightness/2 * 365
        let textCore = coreSize
        textCore += spiralTightness/2 * 365
        angle = -Math.PI/2
        for (let i = 0; i < 24; i++) {
            if (i % 2 === 0) {
                let x1 = startX + p5.cos(angle) * innerCore
                let y1 = startY + p5.sin(angle) * innerCore
                let x2 = startX + p5.cos(angle) * outerCore
                let y2 = startY + p5.sin(angle) * outerCore
    
                p5.stroke(0, 0, 0, 100)
                p5.line(x1, y1, x2, y2)
                p5.noStroke()
            } else {
                let xText = startX + p5.cos(angle) * textCore
                let yText = startY + p5.sin(angle) * textCore
    
                p5.textSize(6)
                p5.text(abbreviatedMonths[Math.floor(i/2)], xText, yText)
            }

            angle += radianPerMonth/2

            innerCore += (spiralTightness * 15)
            outerCore += (spiralTightness * 15)
            textCore += (spiralTightness * 15)
        }
    }

    if (yearIndicator === yearIndicators.COLOURS.val) {
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

