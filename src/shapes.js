import { colours, manualIntervals, radianPerDay, radianPerMonth, rectValues, spiralValues, months, yearIndicators, monthColours, abbreviatedMonths, shapes, sparkValues, radialSparkValues } from "./constants";
import { fillColourGradient, strokeColourGradient, getColour, getManualIntervalColour, fillLogColourGradient } from "./helpers/colours";

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
    theme,
) => {
    const daysPerRow = Math.ceil(365 / selections[rectValues.NUM_ROWS])
    const rowWidth = daysPerRow * selections[rectValues.DAY_WIDTH]
    const pinHeight = ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * locationData.length - selections[rectValues.SPACE_BETWEEN_ROWS])
    if (hover && (yearIndication === yearIndicators.MONTHS.val || yearIndication === yearIndicators.MONTHS_TICKS.val)) {
        p5.fill(255, 255, 255)
        p5.rect(x - 2, y - 10, rowWidth + 4, pinHeight + 10, 5)
    }

    if (mapPin) {
        p5.stroke(50)
        p5.fill(theme.pinColour)
        p5.triangle(locationX, locationY, locationX - 5, locationY - 5, locationX + 5, locationY - 5)
        if (opaque) {
            p5.fill(theme.pinBackground)
        } else {
            p5.noFill()
        }
        p5.rect(x - 2, y - 2, rowWidth + 4, pinHeight + 4, 5)
        p5.noStroke()
    } else if (opaque) {
        p5.fill(theme.pinBackground)
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
                        const colour = getColour(pt, interval.high, interval.interval, colours[dataType][selections[spiralValues.NUM_COLOURS]])
                        p5.fill(colour)
                    }
                }

                p5.rect(x, y, 1, selections[rectValues.ROW_HEIGHT])
            } else {
                if (fillMissing) {
                    p5.fill(175, 175, 175, 100)
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
        const ticksRequired = 12 * selections[rectValues.NUM_ROWS]
        p5.stroke(50)

        const tickSpace = rowWidth / ticksRequired
        for (let i = startX; i <= startX + rowWidth; i = i + tickSpace) {
            p5.line(i, startY - 3, i, startY - 1)
        }

        p5.noStroke()
    } else if (yearIndication === yearIndicators.COLOURS.val) {
        const ticksRequired = 12 * selections[rectValues.NUM_ROWS]
        const tickSpace = rowWidth / ticksRequired
        for (let i = 0; i < ticksRequired; i++) {
            p5.fill(monthColours[i % 12])
            p5.rect(startX + i * tickSpace, startY - 4, tickSpace, 2)
        }

        p5.noStroke()
    } else if (yearIndication === yearIndicators.MONTHS.val && hover) {
        const ticksRequired = 12 * selections[rectValues.NUM_ROWS]
        const tickSpace = rowWidth / ticksRequired
        for (let i = 0; i < ticksRequired; i++) {
            p5.textSize(6)
            p5.fill(0)
            p5.text(abbreviatedMonths[i % 12], startX + i * tickSpace + tickSpace / 2, startY - 6)
        }
    } else if (yearIndication === yearIndicators.MONTHS_TICKS.val && hover) {
        const ticksRequired = 12 * selections[rectValues.NUM_ROWS]
        const tickSpace = rowWidth / ticksRequired
        for (let i = 0; i < ticksRequired; i++) {
            p5.textSize(6)
            p5.fill(theme.textColour)
            p5.text(abbreviatedMonths[i % 12], startX + i * tickSpace + tickSpace / 2, startY - 6)
            p5.stroke(0, 0, 0, 150)
            p5.line(startX + i * tickSpace, startY - 10, startX + i * tickSpace, startY + pinHeight)
            p5.noStroke()
        }
    }
}

export const scatterRow = (p5, x, y, data, selections, dataType) => {
    let numColours = selections[rectValues.NUM_COLOURS]
    const daysPerRow = Math.ceil(365 / selections[rectValues.NUM_ROWS])
    let startX = x
    let startY = y
    let rowCounter = 1

    data.forEach(day => {
        if (day === '') {
            p5.fill(200)
        } else {
            if (numColours === 256 || numColours === 1) {
                fillLogColourGradient(p5, day, 6, numColours)
            } else if (numColours === 8) {
                let colour = getManualIntervalColour(day, colours[dataType][numColours], manualIntervals[dataType][numColours])
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
}

export const bridgeRow = (p5, startX, startY, endX, endY, data) => {
    const numColours = 6
    // p5.stroke(150)

    if (startX === endX) {
        let width = Math.abs(endY - startY) / data.length
        let height = 10
        let arrowHeight = 25

        let x = startX - height / 2
        let y = startY

        data.forEach(hour => {
            p5.fill(getManualIntervalColour(hour, colours['BRIDGE'][numColours], manualIntervals['BRIDGE'][numColours]))

            if (startY < endY) {
                p5.quad(x, y, x, y + width, x + height, y + width, x + height, y)
                y = y + width
            } else {
                p5.quad(x, y, x, y - width, x + height, y - width, x + height, y)
                y = y - width
            }
        })

    } else {
        let width = Math.abs(startX - endX) / data.length
        let height = 10
        let arrowHeight = 25
        let slope = (startY - endY) / (startX - endX)
        let b = startY - slope * startX

        let angle = Math.atan((endY - startY) / (endX - startX))
        let y1 = Math.tan(angle) * width
        let x2 = Math.sin(angle) * height
        let y2 = Math.cos(angle) * height

        let xArrow = Math.sin(angle) * arrowHeight
        let yArrow = Math.cos(angle) * arrowHeight

        let x = startX
        let y = startY

        data.forEach((hour, index) => {
            p5.fill(getManualIntervalColour(hour, colours['BRIDGE'][numColours], manualIntervals['BRIDGE'][numColours]))

            if (startX < endX) {
                p5.quad(x, y, x + width, y + y1, x + width + x2, y + y1 - y2, x + x2, y - y2)

                // if (index === Math.floor(data.length/2)) {
                //     drawArrow(p5, x + width + xArrow, y + y1 - yArrow, x + xArrow, y - yArrow)
                //     drawArrow(p5, x - xArrow, y + yArrow, x + width - xArrow, y + y1 + yArrow)
                // }

                x += width
            } else if (startX > endX) {
                p5.quad(x, y, x - x2, y + y2, x - width - x2, y + y2 - y1, x - width, y - y1)

                // if (index === Math.floor(data.length/2)) {
                //     drawArrow(p5, x - width - xArrow, y + yArrow - y1, x - xArrow, y + yArrow)
                //     drawArrow(p5, x - xArrow, y + yArrow, x + width - xArrow, y + y1 + yArrow)
                // }
                x -= width
            }

            y = slope * x + b
        })

        p5.noStroke()
    }
}

export const graphRow = (p5, startX, startY, endX, endY, data, selections, variable, dataBrackets) => {
    let var1 = 'import'
    let var2 = 'export'
    let numColours = 7
    let interval = (dataBrackets.high - dataBrackets.low) / numColours
    let width = Math.abs(startX - endX) / Object.keys(data).length
    let height = 10
    let arrowHeight = 25
    let slope = (startY - endY) / (startX - endX)
    let b = startY - slope * startX

    let angle = Math.atan((endY - startY) / (endX - startX))
    let y1 = Math.tan(angle) * width
    let x2 = Math.sin(angle) * height
    let y2 = Math.cos(angle) * height

    let xArrow = Math.sin(angle) * arrowHeight
    let yArrow = Math.cos(angle) * arrowHeight

    let x = startX
    let y = startY

    p5.stroke(150)
    Object.keys(data).forEach((year, index) => {

        if (startX < endX) {
            p5.fill(getManualIntervalColour(data[year][var1], colours['TRADE'][numColours], manualIntervals['TRADE'][numColours]))
            p5.quad(x, y, x + width, y + y1, x + width + x2, y + y1 - y2, x + x2, y - y2)

            p5.fill(getManualIntervalColour(data[year][var2], colours['TRADE'][numColours], manualIntervals['TRADE'][numColours]))
            p5.quad(x, y, x + width, y + y1, x + width - x2, y + y1 + y2, x - x2, y + y2)

            if (index === Math.floor(Object.keys(data).length / 2)) {
                drawArrow(p5, x + width + xArrow, y + y1 - yArrow, x + xArrow, y - yArrow)
                drawArrow(p5, x - xArrow, y + yArrow, x + width - xArrow, y + y1 + yArrow)
            }

            x += width
        } else {
            p5.fill(getManualIntervalColour(data[year][var1], colours['TRADE'][numColours], manualIntervals['TRADE'][numColours]))
            p5.quad(x, y, x - x2, y + y2, x - width - x2, y + y2 - y1, x - width, y - y1)

            p5.fill(getManualIntervalColour(data[year][var2], colours['TRADE'][numColours], manualIntervals['TRADE'][numColours]))
            p5.quad(x, y, x + x2, y - y2, x - width + x2, y - y2 - y1, x - width, y - y1)


            if (index === Math.floor(Object.keys(data).length / 2)) {
                drawArrow(p5, x - width - xArrow, y + yArrow - y1, x - xArrow, y + yArrow)
                drawArrow(p5, x + xArrow, y - yArrow, x - width + xArrow, y - yArrow - y1)
            }
            x -= width
        }

        y = slope * x + b
    })

}

const drawArrow = (p5, startX, startY, endX, endY) => {
    p5.fill(150)
    let theta = Math.abs(endY - startY) === 0 ? 0 : Math.tan(Math.abs(endX - startX) / Math.abs(endY - startY))
    let phi = Math.PI / 4 - theta

    let d1 = Math.cos(phi) * 10
    let d2 = Math.sin(phi) * 10
    p5.line(startX, startY, endX, endY)

    if (startX < endX && startY < endY) {
        p5.triangle(endX, endY, endX + d2, endY - d1, endX - d1, endY - d2)
    } else if (startX < endX && startY > endY) {
        p5.triangle(endX, endY, endX - d1, endY + d2, endX + d2, endY + d1)
    } else if (startX > endX && startY < endY) {
        p5.triangle(endX, endY, endX - d2, endY - d1, endX + d1, endY - d2)
    } else if (startX > endX && startY > endY) {
        p5.triangle(endX, endY, endX + d1, endY + d2, endX - d2, endY + d1)
    } else if (startX < endX && startY === endY) {
        p5.triangle(endX, endY, endX - d2, endY + d1, endX - d2, endY - d1)
    } else if (startX > endX && startY === endY) {
        p5.triangle(endX, endY, endX + d2, endY + d1, endX + d2, endY - d1)
    }

}

export const monthSpiral = (p5, startX, startY, data, highest, lowest) => {
    let spiralWidth = 30
    let spiralTightness = 0.25
    let angle = -Math.PI / 2
    let coreSize = 0

    data.forEach(month => {
        let x = startX + p5.cos(angle) * coreSize
        let y = startY + p5.sin(angle) * coreSize

        fillColourGradient(p5, month, { highest, lowest }, 360)
        p5.noStroke()

        p5.arc(x, y, spiralWidth, spiralWidth, angle, angle + radianPerMonth, p5.PIE)

        p5.fill('white')
        p5.ellipse(startX, startY, 15, 15)

        angle += radianPerMonth
        coreSize += spiralTightness
    })
}

export const scatterSpiral = (p5, startX, startY, data, selections, dataType) => {
    let spiralWidth = selections[spiralValues.SPIRAL_WIDTH]
    let spiralTightness = selections[spiralValues.SPACE_BETWEEN_SPIRAL]
    let angle = -Math.PI / 2
    let coreSize = selections[spiralValues.CORE_SIZE]
    let numColours = selections[spiralValues.NUM_COLOURS]

    p5.noStroke()
    data.forEach(day => {
        let x = startX + p5.cos(angle) * coreSize
        let y = startY + p5.sin(angle) * coreSize

        if (day === '') {
            p5.fill(200)
        } else {
            if (numColours === 256 || numColours === 1) {
                fillLogColourGradient(p5, day, 6, numColours)
            } else if (numColours === 8) {
                let colour = getManualIntervalColour(day, colours[dataType][numColours], manualIntervals[dataType][numColours])
                p5.fill(colour)
            }
        }

        p5.arc(x, y, spiralWidth, spiralWidth, angle, angle + radianPerDay * 5, p5.PIE)

        angle += radianPerDay
        coreSize += spiralTightness
    })
}

export const graphSpiral = (p5, startX, startY, data, selections, dataType, variable, backgroundColour) => {
    let spiralWidth = selections[spiralValues.SPIRAL_WIDTH]
    let spiralTightness = selections[spiralValues.SPACE_BETWEEN_SPIRAL]
    let angle = -Math.PI / 2
    let coreSize = selections[spiralValues.CORE_SIZE]
    let numColours = selections[spiralValues.NUM_COLOURS]
    let radianPer = Math.PI * 2 / Object.keys(data).length

    p5.noStroke()
    p5.fill(backgroundColour)
    p5.ellipse(startX, startY, coreSize + spiralWidth, coreSize + spiralWidth)
    Object.keys(data).forEach(year => {
        let x = startX + p5.cos(angle) * coreSize
        let y = startY + p5.sin(angle) * coreSize

        if (data[year][variable] === '') {
            p5.fill(200)
        } else {
            if (variable === 'tradeBalance') {
                if (data[year][variable] >= 0) {
                    p5.fill("#59a14f")
                } else {
                    p5.fill("#e15759")
                }

            } else if (numColours === 256 || numColours === 1) {
                fillLogColourGradient(p5, data[year][variable], 6, numColours)
            } else if (numColours === 7) {
                let colour = getManualIntervalColour(data[year][variable], colours[dataType][numColours], manualIntervals[dataType][numColours])
                p5.fill(colour)
            }
        }

        p5.stroke(backgroundColour)
        // p5.noStroke()
        p5.arc(x, y, spiralWidth, spiralWidth, angle, angle + radianPer, p5.PIE)
        p5.fill(backgroundColour)
        p5.arc(x, y, spiralWidth / 2, spiralWidth / 2, angle, angle + radianPer, p5.PIE)

        angle += radianPer
        coreSize += spiralTightness
    })
}

export const graphPerimeterSpiral = (p5, startX, startY, data, selections, dataType, variable, backgroundColour) => {
    let spiralWidth = selections[spiralValues.SPIRAL_WIDTH]
    let spiralTightness = 0
    let angle = -Math.PI / 2
    let coreSize = selections[spiralValues.CORE_SIZE]
    let numColours = selections[spiralValues.NUM_COLOURS]
    let radianPer = Math.PI * 2 / Object.keys(data).length

    p5.noStroke()
    p5.fill(backgroundColour)
    p5.ellipse(startX, startY, coreSize + spiralWidth, coreSize + spiralWidth)
    Object.keys(data).forEach(year => {
        let x = startX + p5.cos(angle) * coreSize
        let y = startY + p5.sin(angle) * coreSize

        if (data[year][variable] === '') {
            p5.fill(200)
        } else {
            if (variable === 'tradeBalance') {
                if (data[year][variable] >= 0) {
                    p5.fill("#59a14f")
                } else {
                    p5.fill("#e15759")
                }

            } else if (numColours === 256 || numColours === 1) {
                fillLogColourGradient(p5, data[year][variable], 6, numColours)
            } else if (numColours === 7) {
                let colour = getManualIntervalColour(data[year][variable], colours[dataType][numColours], manualIntervals[dataType][numColours])
                p5.fill(colour)
            }
        }

        p5.stroke(backgroundColour)
        p5.arc(x, y, spiralWidth, spiralWidth, angle, angle + radianPer, p5.PIE)
        p5.fill(backgroundColour)
        p5.arc(x, y, spiralWidth * 3 / 4, spiralWidth * 3 / 4, angle, angle + radianPer, p5.PIE)

        angle += radianPer
        coreSize += spiralTightness
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
    selections,
    startX,
    startY,
    opaque,
    hover,
    yearIndicator,
    fillMissing,
    theme,
) => {
    let spiralWidth = selections[spiralValues.SPIRAL_WIDTH]
    let spiralTightness = selections[spiralValues.SPACE_BETWEEN_SPIRAL]
    let angle = -Math.PI / 2
    let coreSize = selections[spiralValues.CORE_SIZE];
    let radius = getRadius(selections, locationData.length)

    if (hover && (yearIndicator === yearIndicators.MONTHS.val || yearIndicator === yearIndicators.MONTHS_TICKS.val)) {
        let tempData = locationData
        tempData.push([])
        let newRadius = getRadius(selections, tempData.length)

        p5.fill(255, 255, 255, 150)
        p5.ellipse(startX, startY, newRadius * 2 + 20, newRadius * 2 + 20)
    } else {
        if (mapPin) {
            if (yearIndicator !== yearIndicators.COLOURS.val) {
                p5.stroke(50)
            }
            p5.fill(theme.pinColour)
            p5.triangle(locationX, locationY, locationX - 5, locationY - 15, locationX + 5, locationY - 15)

            if (opaque) {
                p5.fill(theme.pinBackground)
            } else {
                p5.noFill()
            }

            p5.ellipse(startX, startY, radius * 2, radius * 2 + 2)
            p5.noStroke()
        } else if (opaque) {
            p5.fill(theme.pinBackground)
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
                        const colour = getColour(pt, interval.high, interval.interval, colours[dataType][selections[spiralValues.NUM_COLOURS]])
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
        p5.fill(theme.textColour)
        let hoverCore = coreSize
        hoverCore += spiralTightness * 365
        angle = -Math.PI / 2
        for (let i = 0; i < 12; i++) {
            let textCore = hoverCore
            textCore += spiralTightness / 2 * 365
            let xText = startX + p5.cos(angle) * textCore
            let yText = startY + p5.sin(angle) * textCore

            p5.text(months[i], xText, yText)

            angle += radianPerMonth
            coreSize += spiralTightness
        }
    }

    if (hover && yearIndicator === yearIndicators.MONTHS_TICKS.val) {
        p5.fill(theme.textColour)
        let innerCore = selections[spiralValues.CORE_SIZE]
        let outerCore = coreSize
        outerCore += spiralTightness / 2 * 365
        let textCore = coreSize
        textCore += spiralTightness / 2 * 365
        angle = -Math.PI / 2
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
                p5.text(abbreviatedMonths[Math.floor(i / 2)], xText, yText)
            }

            angle += radianPerMonth / 2

            innerCore += (spiralTightness * 15)
            outerCore += (spiralTightness * 15)
            textCore += (spiralTightness * 15)
        }
    }

    if (yearIndicator === yearIndicators.COLOURS.val) {
        coreSize += spiralTightness * 365
        angle = -Math.PI / 2
        p5.stroke(50)
        for (let i = 0; i < 12; i++) {
            p5.noFill()
            p5.stroke(monthColours[i])
            p5.arc(startX, startY, radius * 2 + 2, radius * 2 + 2, angle, angle + radianPerMonth, p5.PI)
            angle += radianPerMonth
        }

        p5.noStroke()
    } else if (yearIndicator === yearIndicators.TICKS.val) {
        p5.fill(theme.textColour)
        coreSize += spiralTightness * 365
        angle = -Math.PI / 2
        for (let i = 0; i < 12; i++) {
            let lineCore = coreSize
            lineCore += spiralTightness / 4 * 365
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
    let spiralWidth = Math.min(selections[spiralValues.SPIRAL_WIDTH] + (numLocations * 2), 30)
    let spiralTightness = spiralWidth / 600
    return { spiralWidth, spiralTightness }
}

export const getRadius = (selections, numYears = selections[spiralValues.NUM_YEARS]) => {
    return Math.abs(Math.sin(-1.5 + radianPerDay * 365 * numYears)
        * (selections[spiralValues.CORE_SIZE] + selections[spiralValues.SPACE_BETWEEN_SPIRAL] * 365 * numYears))
        + selections[spiralValues.SPIRAL_WIDTH] / 2
}

export const getGraphRadius = (selections, numSections) => {
    let numYears = selections[spiralValues.NUM_YEARS]
    let radianPer = Math.PI * 2 / numSections

    return Math.abs(Math.sin(-1.5 + radianPer * numSections * numYears)
        * (selections[spiralValues.CORE_SIZE] + selections[spiralValues.SPACE_BETWEEN_SPIRAL] * numSections * numYears))
        + selections[spiralValues.SPIRAL_WIDTH] / 2
}

export const getRowSize = (selections, numLocations, numYears = selections[rectValues.NUM_YEARS]) => {
    const daysPerRow = Math.ceil(365 / selections[rectValues.NUM_ROWS])
    const dayWidth = Math.min(selections[rectValues.DAY_WIDTH] + numLocations / 25, 0.75)
    const rowWidth = daysPerRow * dayWidth
    const rowHeight = Math.min(selections[rectValues.ROW_HEIGHT] + numLocations * 1.5, 20)
    const pinHeight = (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT]) * selections[rectValues.NUM_ROWS] * numYears

    return { dayWidth, rowWidth, rowHeight, pinHeight }
}

export const getPinAdjustment = (selections, shape, locationData) => {
    let numYears = locationData ? locationData.length : selections[rectValues.NUM_YEARS]
    let startY = 0

    if (shape === shapes.SPIRAL.id) {
        const radius = getRadius(selections, numYears)
        startY = radius + 15
    } else if (shape === shapes.RECT.id) {
        startY = 7 + ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * numYears)
    }

    return startY
}

export const spark = (
    dataType,
    interval,
    locationData,
    locationX,
    locationY,
    mapPin,
    p5,
    selections,
    startX,
    startY,
    opaque,
    hover,
    yearIndicator,
    fillMissing,
    theme,
) => {
    const numYears = Math.min(selections[sparkValues.NUM_YEARS], locationData.length)
    const dayWidth = selections[sparkValues.DAY_WIDTH]
    const sparkHeight = selections[sparkValues.SPARK_HEIGHT]
    const totalHeight = sparkHeight * ((1 + numYears) / 2)
    let baseline = locationY - totalHeight / 2 + sparkHeight
    let increment = sparkHeight / interval.range

    if (opaque) {
        let sparkLength = dayWidth * 365
        let border = 10
        p5.fill(theme.pinBackground)
        p5.rect(startX - border, locationY - totalHeight / 2 - border, sparkLength + border * 2, totalHeight + border * 2, 20)
    }

    locationData.forEach(year => {
        for (let day = 0; day < year.length - 1; day++) {
            if (selections[sparkValues.NUM_COLOURS] === 1
                || selections[sparkValues.NUM_COLOURS] === 2
                || selections[sparkValues.NUM_COLOURS] === 360
            ) {
                strokeColourGradient(p5, year[day], interval, selections[sparkValues.NUM_COLOURS])
            } else {
                const colour = getColour(year[day], interval.high, interval.interval, colours[dataType][selections[spiralValues.NUM_COLOURS]])
                p5.stroke(colour)
            }

            let val1 = baseline - ((year[day] - interval.low) * increment)
            let val2 = baseline - ((year[day + 1] - interval.low) * increment)

            p5.line(startX + day * dayWidth, val1, startX + (day + 1) * dayWidth, val2)
        }

        baseline = baseline + sparkHeight / 2
    })

    p5.noStroke()
}

export const radialSpark = (
    dataType,
    interval,
    locationData,
    locationX,
    locationY,
    mapPin,
    p5,
    selections,
    startX,
    startY,
    opaque,
    hover,
    yearIndicator,
    fillMissing,
    theme,
) => {
    let spiralWidth = selections[radialSparkValues.SPIRAL_WIDTH]
    let spiralTightness = selections[radialSparkValues.SPACE_BETWEEN_SPIRAL]
    let angle = -Math.PI / 2
    let innerRing = selections[radialSparkValues.CORE_SIZE]
    let outerRing = innerRing + spiralWidth
    let numColours = selections[radialSparkValues.NUM_COLOURS]
    let increment = spiralWidth/interval.range

    locationData.forEach(year => {
        for (let pt = 0; pt < year.length - 1; pt++) {
            let x1 = startX + p5.cos(angle) * (innerRing + year[pt] * increment)
            let y1 = startY + p5.sin(angle) * (innerRing + year[pt] * increment)

            angle += radianPerDay
            innerRing += spiralTightness

            let x2 = startX + p5.cos(angle) * (innerRing + year[pt + 1] * increment)
            let y2 = startY + p5.sin(angle) * (innerRing + year[pt + 1] * increment)

            if (pt) {
                if (numColours === 1
                    || numColours === 2
                    || numColours === 360
                ) {
                    strokeColourGradient(p5, year[pt], interval, numColours)
                } else {
                    const colour = getColour(year[pt], interval.high, interval.interval, colours[dataType][numColours])
                    p5.stroke(colour)
                }


                p5.line(x1, y1, x2, y2)
            } 
        }
    })

    p5.noStroke()
}


