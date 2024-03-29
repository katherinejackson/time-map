import { colours, manualIntervals, radianPerDay, radianPerMonth, radianPerYear, shapes, themeColours, pinSize, dataSets } from "./constants";
import { fillColourGradient, getManualIntervalColour, fillLogColourGradient, getCovidIntervalColour, setColour } from "./helpers/colours";
import { getShapeSelections } from "./helpers/selections";
import { calcY } from "./legend";

export const getShapeSize = (selections, shape, dataLength, numLocations = 1) => {
    if (shape === shapes.SPIRAL.id) {
        const topRadius = getRadius(selections, dataLength)
        const bottomRadius = getRadiusAtDay(dataLength / 2, selections)
        const rightRadius = getRadiusAtDay(dataLength / 4, selections)
        const leftRadius = getRadiusAtDay(dataLength * 0.75, selections)
        const wedgeArea = Math.pow(selections.spiralWidth, 2) * radianPerDay / 2
        const spiralArea = wedgeArea * dataLength

        return { width: leftRadius + rightRadius, height: topRadius + bottomRadius, maxRadius: topRadius, area: spiralArea, rightRadius: rightRadius }
    } else if (shape === shapes.ROW.id) {
        const { rowWidth, pinHeight } = getRowSize(selections, dataLength)

        return { width: rowWidth, height: pinHeight, area: rowWidth * pinHeight }
    }
}

export const getSpiralSize = (selections, numLocations) => {
    let spiralWidth = Math.min(selections.spiralWidth + (numLocations * 2), 30)
    let spiralTightness = spiralWidth / 600
    return { spiralWidth, spiralTightness }
}

export const getRadius = (selections, dataLength, numYears = selections.numYears) => {
    const { coreSize, spiralTightness, spiralWidth } = selections

    return (coreSize + spiralTightness * dataLength * numYears) + spiralWidth
}



export const getRadiusAtDay = (day, selections, numYears = selections.numYears) => {
    const { coreSize, spiralTightness, spiralWidth } = selections

    const numDays = 365 * (numYears - 1) + day

    if (selections.dataSet === dataSets.MIGRATION.val) {
        return (coreSize + spiralTightness * numDays) + spiralWidth
    } 
    
    return ((coreSize + (spiralTightness + 0.01) * numDays) + spiralWidth)
}

export const getGraphRadius = (selections, numSections) => {
    let numYears = selections.numYears
    let radianPer = Math.PI * 2 / numSections

    return Math.abs(Math.sin(-Math.PI / 2 + radianPer * numSections * numYears)
        * (selections.coreSize + selections.spiralTightness * numSections * numYears))
        + selections.spiralWidth / 2
}

export const getRowSize = (selections, daysPerRow) => {
    const dayWidth = selections.dayWidth
    const rowWidth = daysPerRow * dayWidth
    const rowHeight = selections.rowHeight
    const pinHeight = (selections.rowHeight * selections.numYears) + (selections.spaceBetween * (selections.numYears - 1))

    return { dayWidth, rowWidth, rowHeight, pinHeight }
}


export const getClusterRowSize = (selections, numLocations) => {
    const daysPerRow = 365
    const dayWidth = Math.min(selections.dayWidth + numLocations / 25, 0.75)
    const rowWidth = daysPerRow * dayWidth
    const rowHeight = Math.min(selections.rowHeight + numLocations * 1.5, 20)
    const pinHeight = (selections.spaceBetween + selections.rowHeight) * selections.numYears

    return { dayWidth, rowWidth, rowHeight, pinHeight }
}

export const getPinAdjustment = (selections, shape, locationData) => {
    let numYears = locationData ? locationData.length : selections.numYears
    let startY = 0

    if (shape === shapes.SPIRAL.id) {
        const radius = getRadius(selections, 365, numYears)
        startY = radius + 15
    } else if (shape === shapes.ROW.id) {
        startY = 7 + (selections.spaceBetween + selections.rowHeight) * numYears
    }

    return startY
}

export const row = (
    p5,
    dataType,
    interval,
    locationData,
    x,
    y,
    selections,
    encoding,
    numLocations,
    id,
    increments
) => {
    const { numColours, mapPin, opaque, dayWidth, theme, rowHeight, fillMissing, cluster, spaceBetween } = selections
    const colourTheme = themeColours[theme]
    const { width, height } = getShapeSize(selections, shapes.ROW.id, 365)
    const startX = x - width / 2
    const startY = mapPin ? y - height - pinSize : y - height / 2
    let baseline = startY + height
    const increment = rowHeight / interval.range

    if (mapPin) {
        p5.stroke(50)
        p5.fill(colourTheme.pinColour)
        p5.triangle(x, y, x - pinSize, y - pinSize, x + pinSize, y - pinSize)
        if (opaque) {
            p5.fill(colourTheme.pinBackground)
        } else {
            p5.noFill()
        }
        p5.rect(startX, startY, width, height)
        p5.noStroke()
    }

    p5.fill(colourTheme.pinBackground)
    p5.rect(startX - 2, startY - 2, width + 4, height + 4)

    locationData.forEach(year => {
        // draw guidelines
        for (let i = 0; i < increments.length; i++) {
            let val = calcY(increments[i], baseline, rowHeight, Math.min(...increments), Math.max(...increments))
            p5.stroke(255)
            p5.strokeWeight(0.25)
            p5.line(startX, val - rowHeight, startX + width, val - rowHeight)
            p5.noStroke();

        }

        for (let day = 0; day < year.length - 1; day++) {
            if (year[day] !== '') {
                if (encoding === 1) {
                    p5.fill(249, 231, 159)
                } else {
                    setColour(p5, year[day], numColours, interval, dataType)
                }

                if (encoding === 2) {
                    p5.rect(startX + day * dayWidth, baseline - rowHeight, 1, rowHeight)
                } else {
                    let val = baseline - ((year[day] - interval.low) * increment)

                    p5.ellipse(startX + day * dayWidth, val, 1, 1)
                }
            } else if (fillMissing) {
                p5.noStroke()

                if (encoding === 2) {
                    p5.fill(150, 100)
                    p5.rect(startX + day * dayWidth, baseline - rowHeight, 1, rowHeight)
                } else {
                    if (encoding === 1) p5.fill(133, 193, 233)
                    else if (encoding === 3) p5.fill(255)
                    let val = baseline - ((rowHeight) / 2)
                    p5.ellipse(startX + day * dayWidth, val, 1, 1)
                }
            }
        }
        if (encoding !== 2) {
            // draw baseline reference
            p5.stroke(colourTheme.textColour)
            p5.strokeWeight(0.5)
            p5.line(startX - 2, baseline, (startX - 2) + (width + 4), baseline)
            p5.noStroke()
        }
        baseline = baseline - rowHeight - spaceBetween

    })

    // draw border around multi year pins + highlight the key pins
    if (selections.highlightOptions[dataType].includes(id)) {
        p5.stroke(255, 0, 0)
        p5.strokeWeight(1.5)
        p5.noFill()
        p5.rect(startX - 3, startY - 3, width + 6, height + 6)
    }

    p5.stroke(255)
    p5.strokeWeight(1.5)
    p5.noFill()
    p5.rect(startX - 1, startY - 1, width + 2, height + 2)
    p5.noStroke()

    if (cluster) {
        p5.fill(colourTheme.textColour)
        p5.textSize(10)
        p5.textAlign(p5.CENTER, p5.CENTER)

        if (mapPin) {
            p5.fill(colourTheme.pinBackground)
            p5.ellipse(x, y + 8, 16, 16)
            p5.fill(colourTheme.textColour)
            p5.text(numLocations, x, y + 8)
        } else {
            p5.fill(colourTheme.pinBackground)
            p5.ellipse(x, y + height / 2 + 8, 16, 16)
            p5.fill(colourTheme.textColour)
            p5.text(numLocations, x, y + height / 2 + 8)
        }
    }
}

export const migrationRow = (
    p5,
    dataType,
    interval,
    locationData,
    x,
    y,
    selections,
    encoding,
    numLocations,
    id,
    increments
) => {
    const { numColours, mapPin, opaque, dayWidth, theme, rowHeight, fillMissing, cluster, spaceBetween } = selections
    const colourTheme = themeColours[theme]
    const { width, height: temp } = getShapeSize(selections, shapes.ROW.id, locationData.length + 2)
    const height = temp + spaceBetween
    // Have to make the pins larger since we only have ~40 datapoints
    const magnification = 1;
    const startX = x - width / 2
    const startY = mapPin ? y - height - pinSize : y - height / 2
    let baseline = startY + height
    const increment = rowHeight / interval.range
    const middle = baseline - (interval.range / 2 * increment)

    if (mapPin) {
        p5.stroke(50)
        p5.fill(colourTheme.pinColour)
        p5.triangle(x, y, x - pinSize, y - pinSize, x + pinSize, y - pinSize)
        if (opaque) {
            p5.fill(colourTheme.pinBackground)
        } else {
            p5.noFill()
        }
        p5.rect(startX, startY, width, height)
        p5.noStroke()
    }

    if (encoding !== 2) {
        // this background will be visible 
        p5.fill(colourTheme.pinBackground)
        p5.rect(startX - 2, startY - 2, width + 4, height + 4)

        // draw baseline reference
        p5.stroke(colourTheme.textColour)
    }

    // draw guidelines
    for (let i = 0; i < increments.length; i++) {
        let val = baseline - ((Math.log10(increments[i]) - interval.low) / interval.range) * height
        p5.stroke(255)
        p5.strokeWeight(0.25)
        p5.line(startX, val, startX + width, val)
    }

    for (let i = 0; i < locationData.length; i++) {
        let year = locationData[i];
        if (year !== -1) {

            // distance
            if (encoding === 1) {
                // colour data points yellow
                p5.fill(249, 231, 159)
            } else {
                setColour(p5, year, numColours, interval, dataType)
            }
            // colour
            if (encoding === 2) {

                p5.rect(startX + i * dayWidth * magnification, baseline - height, magnification, rowHeight + spaceBetween)
            } else {
                let val = baseline - ((year - interval.low) / interval.range) * height
                p5.noStroke()
                p5.ellipse(startX + i * dayWidth * magnification, val + 1, 1, 1)
            }
        } else if (fillMissing) {
            p5.noStroke()

            if (encoding === 2) {
                p5.fill(150, 100)
                p5.rect(startX + i * dayWidth, baseline - height, 1, height)
            } else {
                if (encoding === 1) p5.fill(133, 193, 233)
                else if (encoding === 3) p5.fill(255, 100)
                p5.ellipse(startX + i * dayWidth, middle, 1, 1)
            }
        }
        // draw border around multi year pins + highlight the key pins
        if (selections.highlightOptions[dataType].includes(id)) {
            p5.stroke(255, 0, 0)
            p5.strokeWeight(1.5)
            p5.noFill()
            p5.rect(startX - 3, startY - 3, width + 6, height + 6)
        }

        p5.strokeWeight(1)
        p5.stroke(255)
        p5.noFill()
        p5.rect(startX - 1, startY - 1, width + 2, height + 2)
        p5.noStroke()
    }

    if (cluster) {
        p5.fill(colourTheme.textColour)
        p5.textSize(10)
        p5.textAlign(p5.CENTER, p5.CENTER)

        if (mapPin) {
            p5.fill(colourTheme.pinBackground)
            p5.ellipse(x, y + 8, 16, 16)
            p5.fill(colourTheme.textColour)
            p5.text(numLocations, x, y + 8)
        } else {
            p5.fill(colourTheme.pinBackground)
            p5.ellipse(x, y + height / 2 + 8, 16, 16)
            p5.fill(colourTheme.textColour)
            p5.text(numLocations, x, y + height / 2 + 8)
        }
    }

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

        let x = startX
        let y = startY

        data.forEach(hour => {
            p5.fill(getManualIntervalColour(hour, colours['BRIDGE'][numColours], manualIntervals['BRIDGE'][numColours]))

            if (startX < endX) {
                p5.quad(x, y, x + width, y + y1, x + width + x2, y + y1 - y2, x + x2, y - y2)

                x += width
            } else if (startX > endX) {
                p5.quad(x, y, x - x2, y + y2, x - width - x2, y + y2 - y1, x - width, y - y1)

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

export const legendGraphSpiral = (p5, startX, startY, data, selections, backgroundColour) => {
    let spiralWidth = 150;
    let angle = -Math.PI / 2
    let radianPer = Math.PI * 2 / Object.keys(data).length

    p5.noStroke();
    p5.fill(255);
    p5.ellipse(startX, startY, spiralWidth, spiralWidth);
    Object.keys(data).forEach((i) => {

        // draw arc that splits up the circle (like a pizza)
        p5.fill(225);
        p5.stroke(backgroundColour);
        p5.arc(startX, startY, spiralWidth, spiralWidth, angle, angle + radianPer, p5.PIE);

        // draw inner arc that looks like a smaller circle
        p5.fill(backgroundColour);
        p5.stroke(backgroundColour);
        p5.arc(startX, startY, spiralWidth / 2, spiralWidth / 2, angle, angle + radianPer, p5.PIE);

        // add label
        let textAngle = angle + radianPer / 2;

        p5.noStroke();
        p5.fill(0);
        p5.textSize(10);
        p5.text(
            i,
            startX + p5.cos(textAngle) * spiralWidth / 2 * 0.75,
            startY + p5.sin(textAngle) * spiralWidth / 2 * 0.75
        );

        angle += radianPer;
    });
}


export const graphSpiral = (p5, startX, startY, data, selections, dataType, variable, backgroundColour) => {
    let spiralWidth = selections.spiralWidth
    let spiralTightness = selections.spiralTightness
    let angle = -Math.PI / 2
    let coreSize = selections.coreSize
    let numColours = selections.numColours
    let radianPer = Math.PI * 2 / Object.keys(data).length

    p5.noStroke()
    p5.fill(backgroundColour)
    p5.ellipse(startX, startY, coreSize + spiralWidth, coreSize + spiralWidth)
    //console.log(data)
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
        p5.arc(x, y, spiralWidth / 2, spiralWidth / 2, angle, angle + radianPer, p5.PIE)


        angle += radianPer
        coreSize += spiralTightness
    })
}

export const graphPerimeterSpiral = (p5, startX, startY, data, selections, dataType, variable, backgroundColour) => {
    let spiralWidth = selections.spiralWidth
    let spiralTightness = 0
    let angle = -Math.PI / 2
    let coreSize = selections.coreSize
    let numColours = selections.numColours
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
    data,
    x,
    y,
    selections,
    encoding,
    numLocations,
    id
) => {
    let locationData = [data[1], data[0]]
    const { spiralWidth, spiralTightness, coreSize, mapPin, opaque, theme, numColours, fillMissing, cluster } = selections
    const colourTheme = themeColours[theme]
    const increment = spiralWidth / interval.range
    const { maxRadius } = getShapeSize(selections, shapes.SPIRAL.id, 365)
    const startX = x
    const startY = mapPin ? y - pinSize - maxRadius : y
    let angle = -Math.PI / 2
    let radius = getRadius(selections, 365, locationData.length)
    let innerRing = coreSize

    if (mapPin) {
        p5.fill(colourTheme.pinColour)
        p5.triangle(x, y, x - pinSize, y - pinSize, x + pinSize, y - pinSize)

        if (opaque) {
            p5.fill(colourTheme.pinBackground)
        } else {
            p5.noFill()
        }

        p5.stroke(colourTheme.pinColour)
        p5.ellipse(startX, startY, maxRadius * 2, maxRadius * 2)
        p5.noStroke()
    } else if (opaque) {
        p5.fill(colourTheme.pinBackground)

        if (encoding === 2) {
            p5.ellipse(startX, startY, radius * 2, radius * 2 + 2)
        } else {
            locationData.forEach(year => {
                for (let pt = 0; pt < year.length - 1; pt++) {
                    p5.fill(colourTheme.pinBackground)
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

    let tempAngle = angle;
    let tempInnerRing = innerRing;

    if (encoding !== 2) {
        locationData.forEach(year => {
            for (let pt = 0; pt < year.length - 1; pt++) {

                const a = startX + p5.cos(angle) * innerRing
                const b = startY + p5.sin(angle) * innerRing
                p5.fill(98, 101, 103)
                let mag = 2
                if (spiralWidth === 5) mag = 3
                else if (spiralWidth === 2) mag = 3
                p5.arc(a, b, spiralWidth * mag, spiralWidth * mag, angle, angle + radianPerDay * 10, p5.PIE)

                p5.fill(144, 148, 151)
                let val;
                if (interval.low < 0) {
                    val = -interval.low
                } else {
                    val = (interval.high - interval.low) / 2
                }
                const x = startX + p5.cos(angle) * (innerRing + val * increment)
                const y = startY + p5.sin(angle) * (innerRing + val * increment)
                p5.ellipse(x, y, 1, 1)

                angle += radianPerDay
                innerRing += (spiralTightness + 0.01)
            }
        })
    }
    angle = tempAngle;
    innerRing = tempInnerRing;

    locationData.forEach(year => {
        for (let day = 0; day < year.length - 1; day++) {
            if (year[day] !== '') {
                if (encoding === 1) {
                    p5.fill(249, 231, 159)
                } else {
                    setColour(p5, year[day], numColours, interval, dataType)
                }

                if (encoding === 2) {
                    const x = startX + p5.cos(angle) * innerRing
                    const y = startY + p5.sin(angle) * innerRing
                    p5.arc(x, y, spiralWidth * 2, spiralWidth * 2, angle, angle + radianPerDay * 10, p5.PIE)
                } else {
                    const val = year[day] - interval.low
                    const x = startX + p5.cos(angle) * (innerRing + val * increment)
                    const y = startY + p5.sin(angle) * (innerRing + val * increment)
                    p5.ellipse(x, y, 1, 1)
                }
            } else if (fillMissing) {
                p5.fill(255)

                if (encoding === 2) {
                    const x = startX + p5.cos(angle) * innerRing
                    const y = startY + p5.sin(angle) * innerRing
                    p5.arc(x, y, spiralWidth * 2, spiralWidth * 2, angle, angle + radianPerDay * 10, p5.PIE)
                }
                else {
                    if (encoding === 1) p5.fill(133, 193, 233)
                    else if (encoding === 3) p5.fill(255)
                    let val;
                    if (interval.low < 0) {
                        val = -interval.low
                    } else {
                        val = (interval.high - interval.low) / 2
                    }
                    const x = startX + p5.cos(angle) * (innerRing + val * increment)
                    const y = startY + p5.sin(angle) * (innerRing + val * increment)
                    p5.ellipse(x, y, 1, 1)
                }
            }


            angle += radianPerDay
            innerRing += (spiralTightness + 0.01)


        }
    })

    if (selections.highlightOptions[dataType].includes(id)) {
        p5.stroke(255, 0, 0)
        p5.strokeWeight(1.5)
        p5.noFill()
        let mag = 2.75
        if (spiralWidth === 5) mag = 3.5
        p5.ellipse(startX, startY, maxRadius * mag, maxRadius * mag)
    }
    else p5.noStroke()

    if (cluster) {
        p5.fill(colourTheme.textColour)
        p5.textSize(10)
        p5.textAlign(p5.CENTER, p5.CENTER)

        if (mapPin) {
            p5.fill(colourTheme.pinBackground)
            p5.ellipse(x, y - pinSize - maxRadius, 16, 16)
            p5.fill(colourTheme.textColour)
            p5.text(numLocations, x, y - pinSize - maxRadius / 2)
        } else {
            p5.fill(colourTheme.pinBackground)
            p5.ellipse(x, y, 16, 16)
            p5.fill(colourTheme.textColour)
            p5.text(numLocations, x, y)
        }
    }
}

export const migrationSpiral = (
    p5,
    dataType,
    interval,
    locationData,
    x,
    y,
    selections,
    encoding,
    numLocations,
    id
) => {
    const { spiralWidth, spiralTightness, coreSize, mapPin, opaque, theme, numColours, fillMissing, cluster } = selections
    const colourTheme = themeColours[theme]
    const increment = spiralWidth / interval.range
    const { maxRadius } = getShapeSize(selections, shapes.SPIRAL.id, locationData.length)
    const startX = x
    const startY = mapPin ? y - pinSize - maxRadius : y
    let angle = -Math.PI / 2
    let radius = getRadius(selections, locationData.length / 100, locationData.length / 100)
    let innerRing = coreSize

    if (mapPin) {
        p5.fill(colourTheme.pinColour)
        p5.triangle(x, y, x - pinSize, y - pinSize, x + pinSize, y - pinSize)

        if (opaque) {
            p5.fill(colourTheme.pinBackground)
        } else {
            p5.noFill()
        }

        p5.stroke(colourTheme.pinColour)
        p5.ellipse(startX, startY, maxRadius, maxRadius)
        p5.noStroke()
    } else if (opaque) {
        p5.fill(colourTheme.pinBackground)

        if (encoding === 2) {
            p5.ellipse(startX, startY, radius * 2, radius * 2 + 2)
        } else {
            for (let i = 0; i < locationData.length - 1; i++) {
                p5.fill(colourTheme.pinBackground)
                p5.noStroke()
                p5.arc(startX + p5.cos(angle) * innerRing, startY + p5.sin(angle) * innerRing, spiralWidth * 3, spiralWidth * 3, angle, angle + radianPerYear * 10, p5.PIE)
                angle += radianPerYear
                innerRing += spiralTightness
            }

            angle = -Math.PI / 2
            innerRing = coreSize
        }
    }
    let tempAngle = angle;
    let tempInnerRing = innerRing;

    if (encoding !== 2) {
        for (let i = 0; i < locationData.length; i++) {
            const a = startX + p5.cos(angle) * innerRing
            const b = startY + p5.sin(angle) * innerRing
            p5.fill(colourTheme.pinBackground)
            p5.arc(a, b, spiralWidth * 2, spiralWidth * 2, angle, angle + radianPerYear * 10, p5.PIE)

            p5.fill(215, 219, 221)
            let val;
            if (interval.low < 0) {
                val = -interval.low
            } else {
                val = (interval.high - interval.low) / 2
            }
            const x = startX + p5.cos(angle) * (innerRing + val * increment)
            const y = startY + p5.sin(angle) * (innerRing + val * increment)
            p5.ellipse(x, y, 1, 1)

            angle += radianPerYear
            innerRing += (spiralTightness)
        }
    }
    angle = tempAngle;
    innerRing = tempInnerRing;

    for (let i = 0; i < locationData.length - 1; i++) {
        let year = locationData[i]
        if (encoding !== 2 && !opaque && !mapPin) {
            p5.fill(colourTheme.missingData)
        }

        if (year !== -1) {
            if (encoding === 1) {
                p5.fill(249, 231, 159)
            } else {
                setColour(p5, year, numColours, interval, dataType)
            }
            if (encoding === 2) {
                const x = startX + p5.cos(angle) * innerRing
                const y = startY + p5.sin(angle) * innerRing
                p5.arc(x, y, spiralWidth * 2, spiralWidth * 2, angle, angle + radianPerYear * 10, p5.PIE)
            } else {
                const val = year - interval.low
                const x = startX + p5.cos(angle) * (innerRing + val * increment)
                const y = startY + p5.sin(angle) * (innerRing + val * increment)
                p5.ellipse(x, y, 1, 1)
            }
        } else if (fillMissing) {
            p5.fill(100, 100)

            if (encoding === 2) {
                const x = startX + p5.cos(angle) * innerRing
                const y = startY + p5.sin(angle) * innerRing
                p5.arc(x, y, spiralWidth * 2, spiralWidth * 2, angle, angle + radianPerYear * 10, p5.PIE)
            }
            else {
                if (encoding === 1) p5.fill(133, 193, 233)
                else if (encoding === 3) p5.fill(255, 100)
                let val;
                if (interval.low < 0) {
                    val = -interval.low
                } else {
                    val = (interval.high - interval.low) / 2
                }
                const x = startX + p5.cos(angle) * (innerRing + val * increment)
                const y = startY + p5.sin(angle) * (innerRing + val * increment)
                p5.ellipse(x, y, 1, 1)
            }
        }

        angle += radianPerYear
        innerRing += (spiralTightness)
    }

    if (selections.highlightOptions[dataType].includes(id)) {
        p5.stroke(255, 0, 0)
        p5.strokeWeight(1.5)
        p5.noFill()
        let mag = 2.5
        if (spiralWidth === 5 || spiralWidth === 6) mag = 3
        p5.ellipse(startX - 3, startY - 3, maxRadius * mag, maxRadius * mag)
    }
    else p5.noStroke()

    if (cluster) {
        p5.fill(colourTheme.textColour)
        p5.textSize(10)
        p5.textAlign(p5.CENTER, p5.CENTER)

        if (mapPin) {
            p5.fill(colourTheme.pinBackground)
            p5.ellipse(x, y - pinSize - maxRadius, 16, 16)
            p5.fill(colourTheme.textColour)
            p5.text(numLocations, x, y - pinSize - maxRadius / 2)
        } else {
            p5.fill(colourTheme.pinBackground)
            p5.ellipse(x, y, 16, 16)
            p5.fill(colourTheme.textColour)
            p5.text(numLocations, x, y)
        }
    }
}

export const doubleSpiral = (
    p5,
    x,
    y,
    selections,
    multicolor = false,
) => {
    const { spiralWidth, spiralTightness, coreSize } = getShapeSelections(1, 'xlarge')
    const startX = x
    const startY = y
    let angle = -Math.PI / 2
    let innerRing = coreSize

    if (multicolor) {
        p5.fill(255, 105, 180)
        p5.stroke(255, 105, 180)
    } else {
        p5.fill(255)
        p5.stroke(255)
    }

    for (let year = 1; year <= 2; year++) {
        if (year === 2) {
            p5.fill(255)
            p5.stroke(255)
        }

        for (let day = 1; day <= 365; day++) {

            const x1 = startX + p5.cos(angle) * innerRing
            const y1 = startY + p5.sin(angle) * innerRing
            p5.arc(x1, y1, spiralWidth * 1.25, spiralWidth * 1.25, angle, angle + radianPerDay * 10, p5.PIE)

            angle += radianPerDay
            innerRing += (spiralTightness + 0.02)
        }
    }
}

export const singleSpiral = (
    p5,
    x,
    y,
    selections,
) => {
    const { spiralWidth, spiralTightness, coreSize } = selections
    const startX = x
    const startY = y
    let angle = -Math.PI / 2
    let innerRing = coreSize

    for (let day = 1; day <= 365; day++) {

        const x1 = startX + p5.cos(angle) * innerRing
        const y1 = startY + p5.sin(angle) * innerRing
        p5.fill(255)
        p5.stroke(255)
        p5.arc(x1, y1, spiralWidth * 1.25, spiralWidth * 1.25, angle, angle + radianPerDay * 5, p5.PIE)

        angle += radianPerDay
        innerRing += (spiralTightness + 0.02)
    }
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
    const numYears = Math.min(selections.numYears, locationData.length)
    let spiralWidth = selections.spiralWidth
    let spiralTightness = selections.spiralTightness
    let angle = -Math.PI / 2
    let innerRing = selections.coreSize
    let numColours = selections.numColours
    let increment = (spiralWidth * 2) / interval.range
    let zeroRing = innerRing + spiralWidth

    if (dataType === 'COVID') {
        locationData = [[...locationData]]
    }

    if (mapPin) {
        let radius = getRadius(selections, 365, numYears)
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
        innerRing = selections.coreSize
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


