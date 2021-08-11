import { colours, manualIntervals, radianPerDay, radianPerMonth, rectValues, spiralValues, months, yearIndicators, monthColours, abbreviatedMonths, shapes, sparkValues, radialSparkValues, themeColours } from "./constants";
import { fillColourGradient, getManualIntervalColour, fillLogColourGradient, getCovidIntervalColour, setColour } from "./helpers/colours";

export const row = (
    p5,
    dataType,
    interval,
    locationData,
    locationX,
    locationY,
    startX,
    startY,
    selections,
    encoding,
) => {
    const { numColours, mapPin, opaque, dayWidth, theme, spaceBetween, rowHeight, fillMissing } = selections
    const daysPerRow = 365
    const rowWidth = daysPerRow * dayWidth
    const glyphHeight = (spaceBetween + rowHeight) * locationData.length - spaceBetween
    let baseline = startY + glyphHeight
    const increment = glyphHeight / interval.range
    const middle = baseline - (interval.range / 2 * increment)

    if (mapPin) {
        p5.stroke(50)
        p5.fill(theme.pinColour)
        p5.triangle(locationX, locationY, locationX - 5, locationY - 5, locationX + 5, locationY - 5)
        if (opaque) {
            p5.fill(theme.pinBackground)
        } else {
            p5.noFill()
        }
        p5.rect(startX - 2, startY - 2, rowWidth + 4, glyphHeight + 4, 5)
        p5.noStroke()
    } else if (opaque) {
        p5.fill(theme.pinBackground)
        p5.rect(startX - 2, startY - 2, rowWidth + 4, glyphHeight + 4, 5)
    }

    if (encoding !== 2) {
        p5.stroke(theme.lineColour)
        p5.noFill()
        p5.rect(startX, startY, rowWidth, glyphHeight)
        p5.noStroke()
    }

    locationData.forEach(year => {
        for (let day = 0; day < year.length - 1; day++) {
            if (year[day] !== '') {
                if (encoding === 1) {
                    p5.fill(theme.textColour)
                } else {
                    setColour(p5, year[day], numColours, interval, dataType)
                }

                if (encoding === 2) {
                    p5.rect(startX + day * dayWidth, baseline, 1, rowHeight)
                } else {
                    let val = baseline - ((year[day] - interval.low) * increment)
                    p5.ellipse(startX + day * dayWidth, val, 1, 1)
                }
            } else if (fillMissing) {
                p5.fill(theme.missingData, 100)

                if (encoding === 2) {
                    p5.rect(startX + day * dayWidth, baseline, 1, rowHeight)
                } else {
                    p5.ellipse(startX + day * dayWidth, middle, 1, 1)
                }
            }
        }

        baseline = baseline + glyphHeight / 2
    })
}

export const scatterRow = (p5, x, y, data, selections, dataType) => {
    let numColours = selections[rectValues.NUM_COLOURS]
    const daysPerRow = Math.ceil(365 / selections[rectValues.NUM_ROWS])
    let startX = x
    let rowCounter = 1

    data.forEach(day => {
        if (day === '') {
            p5.fill(200)
        } else {
            if (numColours === 256 || numColours === 1) {
                fillLogColourGradient(p5, day, 6, numColours)
            } else if (numColours === 8) {
                let colour = getCovidIntervalColour(day, colours[dataType][numColours], manualIntervals[dataType][numColours])
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

    if (startX === endX) {
        let width = Math.abs(endY - startY) / data.length
        let height = 10

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
        let slope = (startY - endY) / (startX - endX)
        let b = startY - slope * startX

        let angle = Math.atan((endY - startY) / (endX - startX))
        let y1 = Math.tan(angle) * width
        let x2 = Math.sin(angle) * height
        let y2 = Math.cos(angle) * height

        // let xArrow = Math.sin(angle) * arrowHeight
        // let yArrow = Math.cos(angle) * arrowHeight

        let x = startX
        let y = startY

        data.forEach(hour => {
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
                let colour = getCovidIntervalColour(day, colours[dataType][numColours], manualIntervals[dataType][numColours])
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
    p5,
    dataType,
    interval,
    locationData,
    locationX,
    locationY,
    startX,
    startY,
    selections,
    encoding,
) => {
    const { spiralWidth, spiralTightness, coreSize, mapPin, opaque, theme, numColours, fillMissing } = selections
    const increment = (spiralWidth * 2) / interval.range
    let angle = -Math.PI / 2
    let radius = getRadius(selections, locationData.length)
    let innerRing = coreSize

    if (mapPin) {
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

        if (encoding === 2) {
            p5.ellipse(startX, startY, radius * 2, radius * 2 + 2)
        } else {
            locationData.forEach(year => {
                for (let pt = 0; pt < year.length - 1; pt++) {
                    p5.fill(theme.pinBackground)
                    p5.noStroke()
                    p5.arc(startX + p5.cos(angle) * innerRing, startY + p5.sin(angle) * innerRing, spiralWidth * 4, spiralWidth * 4, angle, angle + radianPerDay * 10, p5.PIE)
                    angle += radianPerDay
                    innerRing += spiralTightness
                }
            })
    
            angle = -Math.PI / 2
            innerRing = coreSize
        }
    }

    locationData.forEach(year => {
        for (let day = 0; day < year.length - 1; day++) {
            if (year[day] !== '') {
                if (encoding === 1) {
                    p5.fill(theme.textColour)
                } else {
                    setColour(p5, year[day], numColours, interval, dataType)
                }

                if (encoding === 2) {
                    const x = startX + p5.cos(angle) * innerRing
                    const y = startY + p5.sin(angle) * innerRing
                    p5.arc(x, y, spiralWidth, spiralWidth, angle, angle + radianPerDay * 10, p5.PIE)
                } else {
                    const val = year[day] - interval.low
                    const x = startX + p5.cos(angle) * (innerRing + val * increment)
                    const y = startY + p5.sin(angle) * (innerRing + val * increment)
                    p5.ellipse(x, y, 1, 1)
                }
            } else if (fillMissing) {
                p5.fill(theme.missingData, 100)

                if (encoding === 2) {
                    const x = startX + p5.cos(angle) * innerRing
                    const y = startY + p5.sin(angle) * innerRing
                    p5.arc(x, y, spiralWidth, spiralWidth, angle, angle + radianPerDay * 10, p5.PIE)
                } else {
                    const val = interval.range / 2
                    const x = startX + p5.cos(angle) * (innerRing + val * increment)
                    const y = startY + p5.sin(angle) * (innerRing + val * increment)
                    p5.fill(theme.missingData, 100)
                    p5.ellipse(x, y, 1, 1)
                }
            }

            if (encoding !== 2 && !opaque && !mapPin) {
                p5.fill(theme.textColour)
                p5.ellipse(startX + p5.cos(angle) * innerRing, startY + p5.sin(angle) * innerRing, 2, 2)
            }

            angle += radianPerDay
            innerRing += spiralTightness
        }
    })
}

// export const getShapeSize = (selections, shape, numLocations) => {
//     if (shape === shapes.SPIRAL.id) {
//         get
//     }
// }

export const getSpiralSize = (selections, numLocations) => {
    let spiralWidth = Math.min(selections.spiralWidth + (numLocations * 2), 30)
    let spiralTightness = spiralWidth / 600
    return { spiralWidth, spiralTightness }
}

export const getRadius = (selections, numYears = selections.numYears) => {
    const { coreSize, spiralTightness, spiralWidth } = selections

    return Math.abs(Math.sin(-Math.PI / 2 + radianPerDay * 365 * numYears)
        * (coreSize + spiralTightness * 365 * numYears)) + spiralWidth / 2
}

export const getGraphRadius = (selections, numSections) => {
    let numYears = selections[spiralValues.NUM_YEARS]
    let radianPer = Math.PI * 2 / numSections

    return Math.abs(Math.sin(-Math.PI / 2 + radianPer * numSections * numYears)
        * (selections[spiralValues.CORE_SIZE] + selections[spiralValues.SPACE_BETWEEN_SPIRAL] * numSections * numYears))
        + selections[spiralValues.SPIRAL_WIDTH] / 2
}

export const getRadialSparkRadius = (selections, numYears = selections[spiralValues.NUM_YEARS]) => {
    let startOuterRing = selections[radialSparkValues.CORE_SIZE] + selections[radialSparkValues.SPIRAL_WIDTH] * 4
    let endOuterRing = startOuterRing + selections[spiralValues.SPACE_BETWEEN_SPIRAL] * 365 * numYears

    return endOuterRing
}

export const getRowSize = (selections, numLocations) => {
    const daysPerRow = 365
    const dayWidth = Math.min(selections.dayWidth + numLocations / 25, 0.75)
    const rowWidth = daysPerRow * dayWidth
    const rowHeight = Math.min(selections.rowHeight + numLocations * 1.5, 20)
    const pinHeight = (selections.spaceBetween + selections.rowHeight) * selections.numYears

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
    } else if (shape === shapes.SPARK.id) {
        startY = 7 + selections[sparkValues.SPARK_HEIGHT] / 2 * ((1 + numYears) / 2)
    } else if (shape === shapes.RADIAL_SPARK.id) {
        const radius = getRadialSparkRadius(selections, numYears)
        startY = radius + 7
    } else if (shape === shapes.RADIAL_BAR_SPARK.id) {
        const radius = getRadialSparkRadius(selections, numYears)
        startY = radius + 7
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
    encoding,
) => {
    const numYears = Math.min(selections[sparkValues.NUM_YEARS], locationData.length)
    const dayWidth = selections[sparkValues.DAY_WIDTH]
    const sparkHeight = selections[sparkValues.SPARK_HEIGHT]
    const totalHeight = sparkHeight * ((1 + numYears) / 2)
    let baseline = startY + sparkHeight
    const increment = sparkHeight / interval.range
    const middle = baseline - (interval.range / 2 * increment)
    const sparkLength = dayWidth * 365
    const numColours = encoding === 1 ? 0 : 8

    if (dataType === 'COVID') {
        locationData = [[...locationData]]
    }

    if (mapPin) {
        p5.fill(theme.pinColour)
        p5.triangle(locationX, locationY, locationX - 7, locationY - 7, locationX + 7, locationY - 7)
    }

    if (opaque) {
        p5.fill(theme.pinBackground)
    } else {
        p5.noFill()
    }

    p5.stroke(theme.lineColour)
    p5.rect(startX, startY, sparkLength, totalHeight)
    p5.noStroke()

    locationData.forEach(year => {
        for (let day = 0; day < year.length - 1; day++) {
            if (year[day] !== '') {
                if (encoding === 1) {
                    p5.fill(theme.textColour)
                } else {
                    setColour(p5, year[day], numColours, interval)
                }

                let val = baseline - ((year[day] - interval.low) * increment)
                p5.ellipse(startX + day * dayWidth, val, 1, 1)
            } else if (fillMissing) {
                p5.fill(theme.missingData, 100)
                p5.ellipse(startX + day * dayWidth, middle, 1, 1)
            }
        }

        baseline = baseline + sparkHeight / 2
    })
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
    encoding
) => {
    const numYears = Math.min(selections[radialSparkValues.NUM_YEARS], locationData.length)
    let spiralWidth = selections[radialSparkValues.SPIRAL_WIDTH]
    let spiralTightness = selections[radialSparkValues.SPACE_BETWEEN_SPIRAL]
    let angle = -Math.PI / 2
    let innerRing = selections[radialSparkValues.CORE_SIZE]
    let outerRing = innerRing + spiralWidth * 2
    let numColours = encoding === 1 ? 0 : 8
    let increment = (spiralWidth * 2) / interval.range

    if (dataType === 'COVID') {
        locationData = [[...locationData]]
    }

    if (mapPin) {
        let radius = getRadialSparkRadius(selections, numYears)
        p5.fill(theme.pinColour)
        p5.triangle(locationX, locationY, locationX - 7, locationY - 7, locationX + 7, locationY - 7)

        p5.stroke(theme.lineColour)
        p5.noFill()
        p5.ellipse(startX, startY, radius * 2, radius * 2)
    }

    if (opaque) {
        locationData.forEach(year => {
            for (let pt = 0; pt < year.length - 1; pt++) {
                p5.fill(theme.pinBackground)
                p5.noStroke()
                p5.arc(startX + p5.cos(angle) * innerRing, startY + p5.sin(angle) * innerRing, spiralWidth * 4, spiralWidth * 4, angle, angle + radianPerDay * 10, p5.PIE)
                angle += radianPerDay
                innerRing += spiralTightness
            }
        })

        angle = -Math.PI / 2
        innerRing = selections[radialSparkValues.CORE_SIZE]
    }

    locationData.forEach(year => {
        for (let pt = 0; pt < year.length - 1; pt++) {
            let val1;
            let val2;

            if (year[pt] !== '') {
                val1 = year[pt] - interval.low
                val2 = year[pt + 1] - interval.low
            } else {
                val1 = interval.range / 2
                val2 = interval.range / 2
            }


            let x1 = startX + p5.cos(angle) * (innerRing + val1 * increment)
            let y1 = startY + p5.sin(angle) * (innerRing + val1 * increment)

            angle += radianPerDay
            innerRing += spiralTightness
            outerRing += spiralTightness

            if (!opaque && !mapPin) {
                p5.stroke(theme.pinBackground)
                p5.ellipse(startX + p5.cos(angle) * innerRing, startY + p5.sin(angle) * innerRing, 1, 1)
            }

            p5.noStroke()
            if (year[pt] !== '') {
                if (numColours === 0) {
                    p5.fill(theme.textColour)
                } else if (numColours === 1
                    || numColours === 2
                    || numColours === 256
                    || numColours === 360
                ) {
                    fillColourGradient(p5, year[pt], interval, numColours)
                } else if (dataType === 'COVID' && numColours === 8) {
                    const colour = getCovidIntervalColour(year[pt], colours[dataType][numColours], manualIntervals[dataType][numColours])
                    p5.fill(colour)
                } else {
                    // const colour = getColour(year[pt], interval.high, interval.interval, colours[dataType][numColours])
                    // p5.fill(colour)
                }
            } else if (fillMissing) {
                p5.fill(theme.missingData, 100)
            } else {
                p5.noStroke()
            }

            p5.ellipse(x1, y1, 1, 1)
        }
    })
}

export const radialBarSpark = (
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
    allPositive = false,
) => {
    const numYears = Math.min(selections[radialSparkValues.NUM_YEARS], locationData.length)
    let spiralWidth = selections[radialSparkValues.SPIRAL_WIDTH]
    let spiralTightness = selections[radialSparkValues.SPACE_BETWEEN_SPIRAL]
    let angle = -Math.PI / 2
    let innerRing = selections[radialSparkValues.CORE_SIZE]
    let outerRing = innerRing + spiralWidth * 2
    let numColours = selections[radialSparkValues.NUM_COLOURS]
    let increment = (spiralWidth * 2) / interval.range
    let zeroRing = innerRing + spiralWidth

    if (dataType === 'COVID') {
        locationData = [[...locationData]]
    }

    if (mapPin) {
        let radius = getRadialSparkRadius(selections, numYears)
        p5.fill(theme.pinColour)
        p5.triangle(locationX, locationY, locationX - 7, locationY - 7, locationX + 7, locationY - 7)

        p5.stroke(theme.lineColour)
        p5.noFill()
        p5.ellipse(startX, startY, radius * 2, radius * 2)
    }

    if (opaque) {
        locationData.forEach(year => {
            for (let pt = 0; pt < year.length - 1; pt++) {
                p5.fill(theme.pinBackground)
                p5.noStroke()
                p5.arc(startX + p5.cos(angle) * innerRing, startY + p5.sin(angle) * innerRing, spiralWidth * 4, spiralWidth * 4, angle, angle + radianPerDay * 10, p5.PIE)
                angle += radianPerDay
                innerRing += spiralTightness
            }
        })

        angle = -Math.PI / 2
        innerRing = selections[radialSparkValues.CORE_SIZE]
    }

    locationData.forEach(year => {
        for (let pt = 0; pt < year.length - 1; pt++) {
            let val1 = 0;
            let val2 = 0;

            if (year[pt] !== '') {
                if (allPositive) {
                    val1 = year[pt] - interval.low
                    val2 = year[pt + 1] - interval.low
                } else {
                    val1 = year[pt]
                    val2 = year[pt + 1]
                }
            }

            let x1 = startX + p5.cos(angle) * (zeroRing + val1 * increment)
            let y1 = startY + p5.sin(angle) * (zeroRing + val1 * increment)

            angle += radianPerDay
            zeroRing += spiralTightness
            innerRing += spiralTightness
            outerRing += spiralTightness

            let x2 = startX + p5.cos(angle) * (zeroRing + val2 * increment)
            let y2 = startY + p5.sin(angle) * (zeroRing + val2 * increment)

            if (year[pt] !== '') {
                if (numColours === 0) {
                    p5.fill(theme.textColour)
                } else if (numColours === 1
                    || numColours === 2
                    || numColours === 360
                ) {
                    fillColourGradient(p5, year[pt], interval, numColours)
                } else if (dataType === 'COVID' && numColours === 8) {
                    const colour = getCovidIntervalColour(year[pt], colours[dataType][numColours], manualIntervals[dataType][numColours])
                    p5.fill(colour)
                } else {
                    const colour = setColour(year[pt], interval.high, interval.interval, colours[dataType][numColours], dataType)
                    p5.fill(colour)
                }

                p5.noStroke()
                p5.quad(
                    startX + p5.cos(angle) * zeroRing, startY + p5.sin(angle) * zeroRing,
                    x1, y1,
                    x2, y2,
                    startX + p5.cos(angle + radianPerDay * 2) * zeroRing, startY + p5.sin(angle + radianPerDay * 2) * zeroRing,
                )
            } else if (fillMissing) {
                p5.fill(theme.missingData, 100)
                p5.ellipse(startX + p5.cos(angle) * zeroRing, startY + p5.sin(angle) * zeroRing, 3, 3)
            }
        }
    })

    p5.noStroke()
}


