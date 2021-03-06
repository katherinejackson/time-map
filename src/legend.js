import { scaleLog, min, max } from 'd3';
import { colours, manualIntervals, themeColours, abbreviatedMonths, migrationYears, radianPerDay, legendRadianPerYear, radianPerMonth } from './constants'
import { fillColourGradient, setColour } from "./helpers/colours";
import { formatNumbers, formatTradeNumbers } from './helpers/format';
import { doubleSpiral, legendGraphSpiral, singleSpiral } from './shapes';


export const drawLegend = (p5, selections, dataBrackets, shape, encoding, interval, dataType, canvasWidth, increments) => {
    let legendWidth = encoding === 2 ? 150 : 240
    const legendHeight = 150
    const colourLegendHeight = 30
    let yearLegendWidth = encoding === 2 ? 150 : 240 / 3
    // increase size of row legend when encoding is colour
    if (encoding === 2 && shape === 2) {
        yearLegendWidth = 240 / 3
        legendWidth = 240
    }

    const colourLegendWidth = legendWidth + yearLegendWidth

    let legendGraphics = p5.createGraphics(legendWidth, legendHeight)
    drawShapeLegend(legendGraphics, legendWidth, legendHeight, selections, dataBrackets, shape, encoding, dataType, increments)
    p5.image(legendGraphics, canvasWidth - legendWidth, 0)

    let yearGraphics = p5.createGraphics(legendWidth, legendHeight)
    drawYearLegend(yearGraphics, yearLegendWidth, legendHeight, selections, shape, increments)
    p5.image(yearGraphics, canvasWidth - legendWidth - yearLegendWidth, 0)

    let extraSpace = 0
    if (dataType !== "TEMP") {
        extraSpace = 15
        let infoGraphics = p5.createGraphics(colourLegendWidth, 15)
        drawInfoLegend(infoGraphics, colourLegendWidth, legendHeight, selections)
        p5.image(infoGraphics, canvasWidth - colourLegendWidth, legendHeight)
    }

    if (encoding !== 1) {
        let colourLegendGraphics = p5.createGraphics(colourLegendWidth, colourLegendHeight)
        drawColourLegend(colourLegendGraphics, colourLegendWidth, colourLegendHeight, selections, interval, dataType, dataBrackets, increments)
        p5.image(colourLegendGraphics, canvasWidth - colourLegendWidth, legendHeight + extraSpace)

    }
}

export const drawInfoLegend = (p5, width, height, selections) => {
    const { theme } = selections
    const textColour = themeColours[theme].textColour
    const backgroundColour = themeColours[theme].pinBackground

    p5.fill(backgroundColour)
    p5.noStroke()
    p5.rect(0, 0, width, 30)

    p5.fill(textColour)
    p5.text("K = thousands      M = millions", width / 4, 10)
}

export const drawMigrationLegend = (p5, selections, dataBrackets, shape, encoding, interval, dataType, canvasWidth, dataLength, increments) => {
    const legendWidth = shape === 1 ? 300 : 350
    const legendHeight = shape === 1 ? 200 : 80
    const colourLegendWidth = shape === 1 ? 300 : 350
    const colourLegendHeight = 30
    let legendGraphics = p5.createGraphics(legendWidth, legendHeight)
    drawShapeMigrationLegend(legendGraphics, legendWidth, legendHeight, selections, dataBrackets, shape, encoding, dataType, dataLength, increments)
    p5.image(legendGraphics, canvasWidth - legendWidth, 0)

    let infoGraphics = p5.createGraphics(colourLegendWidth, 15)
    drawInfoLegend(infoGraphics, colourLegendWidth, legendHeight, selections)
    p5.image(infoGraphics, canvasWidth - colourLegendWidth, legendHeight)

    if (encoding !== 1) {
        let colourLegendGraphics = p5.createGraphics(colourLegendWidth, colourLegendHeight)
        drawColourLegend(colourLegendGraphics, colourLegendWidth, colourLegendHeight, selections, interval, dataType, dataBrackets, increments)
        p5.image(colourLegendGraphics, canvasWidth - colourLegendWidth, legendHeight + 10)
    }


}
export const drawShapeLegend = (p5, width, height, selections, brackets, shape, encoding, dataType, increments) => {
    const { theme } = selections
    const textColour = themeColours[theme].textColour
    const backgroundColour = themeColours[theme].pinBackground

    p5.fill(backgroundColour)
    p5.stroke(backgroundColour)
    p5.rect(0, 0, width, height)

    if (shape === 2) {
        drawRowLegend(p5, width, height, brackets, textColour, encoding, dataType, increments)
    } else if (shape === 1) {
        drawSpiralLegend(p5, width, height, selections, brackets, encoding, dataType, increments)
    }
}

export const drawYearLegend = (p5, width, height, selections, shape) => {
    const { theme } = selections
    const textColour = themeColours[theme].textColour
    const backgroundColour = themeColours[theme].pinBackground

    p5.fill(backgroundColour)
    p5.stroke(backgroundColour)
    p5.rect(0, 0, width, height)

    if (shape === 2) {
        drawRowYearLegend(p5, width, height, textColour)
    } else if (shape === 1) {
        drawSpiralYearLegend(p5, width, height, selections)
    }
}



export const drawShapeMigrationLegend = (p5, width, height, selections, brackets, shape, encoding, dataType, dataLength, increments) => {
    const { theme } = selections
    const textColour = themeColours[theme].textColour
    const backgroundColour = themeColours[theme].pinBackground

    p5.fill(backgroundColour)
    p5.stroke(backgroundColour)
    p5.rect(0, 0, width, height)

    if (shape === 2) {
        drawMigrationRowLegend(p5, width, height, brackets, textColour, encoding, dataLength, increments)
    } else if (shape === 1) {
        drawMigrationSpiralLegend(p5, width, height, selections, brackets, encoding, dataType, dataLength, increments)
    }
}

export const drawColourLegend = (p5, legendWidth, legendHeight, selections, interval, dataType, brackets, increments) => {
    const { theme, numColours } = selections
    const textColour = themeColours[theme].textColour
    const backgroundColour = themeColours[theme].pinBackground
    const width = legendWidth * 0.85
    const height = legendHeight * 0.3

    p5.fill(backgroundColour)
    p5.stroke(backgroundColour)
    p5.rect(0, 0, legendWidth, legendHeight)

    drawGradientLegend(p5, width, height, legendWidth, legendHeight, numColours, brackets, textColour, increments, dataType)
}

export const drawIntervalLegend = (p5, width, height, legendWidth, legendHeight, numColours, interval, dataType, textColour) => {
    const length = width / numColours
    const xStart = (legendWidth - width) / 2
    const y = legendHeight / 2 - height
    let counter = 0

    p5.textSize(10)
    p5.noStroke()
    for (let i = interval.low; i < interval.high; i = Math.ceil((i + interval.interval) * 100) / 100) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        setColour(p5, i, numColours, interval, dataType)
        p5.rect(xStart + counter * length, y, length, height)
        p5.fill(0)

        p5.fill(textColour)
        p5.textAlign(p5.CENTER, p5.TOP)
        p5.text(Math.ceil(i), xStart + counter * length, legendHeight / 2)
        counter = counter + 1
    }

    p5.noStroke()
    p5.text(Math.ceil(interval.high), xStart + counter * length, legendHeight / 2)
}

export const drawGraphLegend = (p5, x, y, selections, dataType, textColour) => {
    p5.stroke(1)
    const numColours = Object.keys(manualIntervals[dataType])[0]
    const length = 75
    const xStart = x - numColours * length / 2
    const intervals = manualIntervals[dataType][numColours]
    let counter = 0

    p5.textSize(10)

    for (let i = 1; i < intervals.length; i++) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.fill(colours[dataType][numColours][i - 1])
        p5.rect(xStart + counter * length, y, length, 5)
        p5.fill(0)
        p5.line(xStart + counter * length, y, xStart + counter * length, y + 8)

        p5.noStroke()
        p5.fill(textColour)
        if (dataType === 'TRADE') {
            p5.text(formatTradeNumbers(intervals[i - 1]), xStart + counter * length, y + 15)
        } else {
            p5.text(intervals[i - 1], xStart + counter * length, y + 15)
        }

        p5.stroke(1)
        counter = counter + 1
    }

    p5.line(xStart + counter * length, y, xStart + counter * length, y + 8)
    p5.noStroke()
    p5.fill(textColour)

    if (dataType === 'TRADE') {
        p5.text(formatTradeNumbers(intervals[intervals.length - 1]), xStart + counter * length, y + 15)
    } else {
        p5.text(intervals[intervals.length - 1], xStart + counter * length, y + 15)
    }

}

export const drawManualIntervalLegend = (p5, width, height, legendWidth, legendHeight, numColours, interval, dataType, textColour) => {
    p5.stroke(1)
    const length = width / numColours
    const xStart = (legendWidth - width) / 2
    const yStart = legendHeight / 2 - height
    const intervals = manualIntervals[dataType][numColours]
    let counter = 0

    p5.textSize(10)

    for (let i = 1; i < intervals.length; i++) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        setColour(p5, i, numColours, interval, dataType)
        p5.rect(xStart + counter * length, yStart, length, height)
        p5.fill(0)
        p5.line(xStart + counter * length, yStart, xStart + counter * length, yStart + 8)

        p5.noStroke()
        p5.fill(textColour)
        p5.textAlign(p5.CENTER, p5.TOP)
        if (dataType === 'TRADE') {
            p5.text(formatTradeNumbers(intervals[i - 1]), xStart + counter * length, yStart + 15)
        } else {
            p5.text(formatNumbers(intervals[i - 1]), xStart + counter * length, legendHeight / 2)
        }

        p5.stroke(1)
        counter = counter + 1
    }

    p5.line(xStart + counter * length, yStart, xStart + counter * length, yStart + 8)
    p5.noStroke()
    p5.fill(textColour)

    if (dataType === 'TRADE') {
        p5.text(formatTradeNumbers(intervals[intervals.length - 1]), xStart + counter * length, yStart + 15)
    } else {
        p5.text(formatNumbers(intervals[intervals.length - 1]), xStart + counter * length, legendHeight / 2)
    }
}

const drawGradientLegend = (p5, width, height, legendWidth, legendHeight, numColours, brackets, textColour, increments, dataType) => {
    const { high, low, range, displayLow, displayHigh } = brackets

    const rectWidth = 1
    const xStart = (legendWidth - width) / 2
    const yStart = legendHeight / 2 - height

    const increase = range / width
    let counter = 0

    p5.noStroke()
    for (let i = low; i < high; i = i + increase) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        fillColourGradient(p5, i, brackets, numColours)
        p5.rect(xStart + counter, yStart, rectWidth, height)
        counter = counter + rectWidth
    }

    let newLow, newHigh;
    if (typeof (displayHigh) === 'undefined' || typeof (displayLow) === 'undefined') {
        newLow = low
        newHigh = high
    }
    else {
        newLow = displayLow
        newHigh = displayHigh
    }


    p5.textSize(10)
    p5.fill(textColour)
    p5.textAlign(p5.CENTER, p5.TOP)

    increments.forEach(num => {
        if (dataType === 'COVID') {
            let logVal = Math.log10(num)
            let x = ((logVal / brackets.range) * width) + xStart
            p5.text(formatNumbers((Math.round(num * 10) / 10)), x, legendHeight / 2 + 3)
        } else if (dataType === 'TEMP') {
            let x = calcX(num, xStart, width, newLow, newHigh)
            p5.text(formatNumbers((Math.round(num * 10) / 10)), x, legendHeight / 2 + 3)
        } else {
            let x = (((Math.log10(num) - low) * width) / range) + xStart
            p5.text(formatNumbers((Math.round(num * 10) / 10)), x, legendHeight / 2 + 3)

        }

    })
}

const calcX = (num, startX, width, low, high) => {
    const dataRange = high - low
    const increment = width / dataRange

    return startX + (num - low) * increment
}

export const calcY = (num, startY, height, low, high) => {
    const dataRange = high - low
    const increment = height / dataRange

    let newStart = startY + height

    // return startX + (num - low) * increment
    return newStart - (num - low) * increment
}


export const drawLogarithmicLegend = (p5, x, y, textColour) => {
    const width = 2
    let colourList = colours['COVID'][256]
    const range = colourList.length * width
    const xStart = x - colourList.length / 2 * width

    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.noStroke()

    let counter = 0
    colourList.forEach(colour => {
        p5.fill(colour)
        p5.rect(xStart + counter, y, width, 5)
        counter = counter + width
    })

    let intervals = [1, 10, 100, 1000, 10000, 100000, 1000000]

    intervals.forEach(pt => {
        p5.fill(textColour)
        p5.text(pt, xStart + Math.log10(pt) / 6 * range, y + 15)
    })

    p5.fill(200)
    p5.rect(x + colourList.length / 2 * width + 50, y, 40, 10)
    p5.fill(textColour)
    p5.text('No Data', x + colourList.length / 2 * width + 50 + 20, y + 15)

}

export const drawLogarithmicGradientLegend = (p5, x, y, brackets, textColour) => {
    const width = 2
    const height = 5
    const range = brackets.high - brackets.low
    const xStart = x - 270 / 2 * width
    let counter = 0
    let increase = Math.ceil(range / 270)
    let interval = { highest: brackets.high, lowest: brackets.low, range: brackets.high - brackets.low }

    p5.noStroke()
    for (let i = brackets.low; i < brackets.high; i = i + increase) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        fillColourGradient(p5, i, interval, 1)
        p5.rect(xStart + counter, y, width, height)
        counter = counter + width
    }

    let intervals = [1, 10, 100, 1000, 10000, 100000, 1000000]

    intervals.forEach(pt => {
        p5.fill(textColour)
        p5.text(pt, xStart + Math.log10(pt) / 6 * 270 * width, y + 15)
    })

    p5.fill(200)
    p5.rect(x + 270 / 2 * width + 50, y, 40, height)
    p5.fill(textColour)
    p5.text('No Data', x + 270 / 2 * width + 50 + 20, y + 15)
}

export const drawRowLegend = (p5, width, height, brackets, textColour, encoding, dataType, increments) => {
    const low = brackets.displayLow || brackets.low
    const high = brackets.displayHigh || brackets.high
    const rectWidth = width * 0.7
    const rectHeight = height * 0.8
    const startX = (width - rectWidth) / 2
    const startY = (height - rectHeight) / 3

    p5.stroke(textColour)
    p5.noFill()
    p5.rect(startX, startY, rectWidth, rectHeight)

    p5.noStroke()
    p5.fill(textColour)
    p5.textSize(10)

    // Logarithmic Scale
    let dataLogScale = scaleLog()
        .domain([min(increments), max(increments)])
        .range([startY + 5, rectHeight]);

    let positions;
    if (dataType === 'TEMP') {
        positions = increments.map(i => calcY(i, startY, rectHeight, low, high))
    }
    else {
        positions = increments.map(i => dataLogScale(i)).reverse()
    }

    if (encoding === 1 || encoding === 3) {
        p5.textAlign(p5.RIGHT, p5.BOTTOM)
        for (let i = 0; i < increments.length; i++) {
            if (typeof (displayHigh) === 'undefined' && typeof (displayLow) === 'undefined') {
                p5.text(formatNumbers((Math.round(increments[i] * 10) / 10)), startX - 5, positions[i] + 5)
            }
            else {
                p5.text(formatNumbers(increments[i]), startX - 5, positions[i] + 5)
            }

        }
    }

    const spacePerMonth = rectWidth / 12
    for (let i = 0; i < 13; i++) {
        let x = startX + i * spacePerMonth
        p5.stroke(textColour, 100)
        p5.line(x, startY, x, startY + rectHeight)
        p5.noStroke()
    }

    p5.textAlign(p5.CENTER, p5.CENTER)
    for (let i = 0; i < 12; i++) {
        let x = startX + i * spacePerMonth + spacePerMonth / 2
        p5.textSize(8)
        p5.text(abbreviatedMonths[i], x, startY + rectHeight / 2)
    }
}

export const drawRowYearLegend = (p5, width, height, textColour) => {
    const rectWidth = width * 0.7
    const rectHeight = height * 0.5
    const startX = (width - rectWidth) - 7
    const startY = (height - rectHeight) / 2
    const midX = startX + (((startX + rectWidth) - startX) / 2)
    const midY = startY + (((startY + rectHeight) - startY) / 2)

    p5.stroke(textColour)
    p5.rect(startX, startY, rectWidth, rectHeight)
    p5.line(startX, midY, startX + rectWidth, midY)

    p5.textSize(10)
    p5.fill(textColour)
    p5.noStroke()
    p5.text("2020", midX - 13, midY - 10)
    p5.text("2021", midX - 13, midY + 20)

}

export const drawSpiralYearLegend = (p5, width, height, selections) => {
    doubleSpiral(p5, width / 2 + 10, height / 2 + 10, selections, true)
    const { theme } = selections
    const textColour = themeColours[theme].textColour

    p5.textSize(12)

    p5.noStroke()
    p5.fill(255, 105, 180)
    p5.ellipse(width / 2 - 30, height - 15, 7.5, 7.5)
    p5.fill(230, 230, 250)
    p5.ellipse(width / 2 + 20, height - 15, 7.5, 7.5)
    p5.fill(textColour)
    p5.text("2020", width / 2 - 25, height - 10)
    p5.text("2021", width / 2 + 25, height - 10)
}

export const drawMigrationRowLegend = (p5, width, height, brackets, textColour, encoding, dataLength, increments) => {
    const rectWidth = width * 0.85
    const rectHeight = height * 0.8
    const startX = ((width - rectWidth) / 2) + 10
    const startY = (height - rectHeight) / 2

    p5.stroke(textColour)
    p5.noFill()
    p5.rect(startX, startY, rectWidth, rectHeight)

    p5.noStroke()
    p5.fill(textColour)
    p5.textSize(8)

    if (encoding === 1 || encoding === 3) {
        p5.textAlign(p5.RIGHT, p5.CENTER)
        let numStart = startY + rectHeight
        for (let i = 0; i < increments.length; i++) {
            let y = numStart - ((Math.log10(increments[i]) - brackets.low) / brackets.range) * rectHeight
            p5.text(formatNumbers(increments[i]), startX - 5, y)
        }
    }

    const spacePerMonth = rectWidth / (dataLength)
    for (let i = 0; i < dataLength; i++) {
        let x = startX + i * spacePerMonth
        p5.stroke(textColour, 100)
        p5.line(x, startY, x, startY + rectHeight)
        p5.noStroke()
    }

    p5.textAlign(p5.CENTER, p5.CENTER)

    for (let i = 0; i < dataLength; i++) {
        let x = startX + i * spacePerMonth + spacePerMonth / 2
        // draw year labels horizonally
        for (let j = 0; j < migrationYears[i]; j++) {
            p5.text(migrationYears[i][j], x, startY + (j * 6) + (rectHeight / 4))
        }
    }
}

export const drawSpiralLegend = (p5, legendWidth, legendHeight, selections, brackets, encoding, dataType, increments) => {
    selections = { ...selections, ['coreSize']: 0, ['spiralWidth']: 20, ['spiralTightness']: 0.03 }

    const startX = encoding === 1 || encoding === 3 ? legendWidth * 0.30 : legendWidth / 2
    const startY = legendHeight / 2 + 10

    doubleSpiral(p5, startX, startY, selections)
    drawSpiralMonth(p5, startX, startY, selections)

    if (encoding === 1 || encoding === 3) {
        const x = legendWidth * 0.75
        doubleSpiral(p5, x, startY, selections)
        drawDistanceSpiral(p5, x, startY, brackets, selections, dataType, increments)
    }
}

const drawDistanceSpiral = (p5, startX, startY, brackets, selections, dataType, increments) => {
    const { spiralWidth, spiralTightness, coreSize, theme } = selections
    let angle = -Math.PI / 2
    let innerRing = coreSize - 1
    let middleRing = coreSize + (spiralWidth * 1.25 / 4)
    let outerRing = coreSize + (spiralWidth * 1.25 / 2) + 1
    let x1, y1, x2, y2, x3, y3

    if (dataType === 'MIGRATION') {
        for (let day = 1; day <= 365; day++) {
            p5.fill(50)
            p5.noStroke()

            x1 = startX + p5.cos(angle) * innerRing
            y1 = startY + p5.sin(angle) * innerRing
            p5.ellipse(x1, y1, 1, 1)

            x2 = startX + p5.cos(angle) * middleRing
            y2 = startY + p5.sin(angle) * middleRing
            p5.ellipse(x2, y2, 1, 1)

            x3 = startX + p5.cos(angle) * outerRing
            y3 = startY + p5.sin(angle) * outerRing
            p5.ellipse(x3, y3, 1, 1)

            angle += radianPerDay
            innerRing += (spiralTightness + 0.02)
            middleRing += (spiralTightness + 0.02)
            outerRing += (spiralTightness + 0.02)
        }
    } else {
        for (let year = 1; year <= 2; year++) {
            for (let day = 1; day <= 365; day++) {
                p5.fill(50)
                p5.noStroke()

                x1 = startX + p5.cos(angle) * innerRing
                y1 = startY + p5.sin(angle) * innerRing
                p5.ellipse(x1, y1, 1, 1)

                x2 = startX + p5.cos(angle) * middleRing
                y2 = startY + p5.sin(angle) * middleRing
                p5.ellipse(x2, y2, 1, 1)

                x3 = startX + p5.cos(angle) * outerRing
                y3 = startY + p5.sin(angle) * outerRing
                p5.ellipse(x3, y3, 1, 1)

                angle += radianPerDay
                innerRing += (spiralTightness + 0.02)
                middleRing += (spiralTightness + 0.02)
                outerRing += (spiralTightness + 0.02)
            }
        }
    }

    const endPoints = calcPointIndicatorPosition(p5, x1, y1, x3, y3, dataType, increments)
    let textStart = y1 + 15
    let textEnd = y3 - 30
    let increment = (textStart - textEnd) / increments.length

    p5.fill(255)
    p5.textAlign(p5.LEFT, p5.CENTER)
    p5.textSize(10)
    for (let i = 0; i < increments.length; i++) {
        if (dataType !== 'TEMP' || i % 2 === 0) {
            p5.stroke(0)
            p5.line(x1 + spiralWidth * 1.5, textStart - increment * i, endPoints[increments[i]][0], endPoints[increments[i]][1])
            p5.noStroke()
            p5.text(formatNumbers(increments[i]), x1 + spiralWidth * 1.5 + 2, textStart - increment * i)
        }
    }
}

export const calcPointIndicatorPosition = (p5, startX, startY, endX, endY, dataType, increments) => {
    const incrementX = 2 / increments.length
    const incrementY = (startY - endY + 2) / increments.length

    let endPoints = {}

    // calculate where line ends inside spiral
    for (let i = 0; i < increments.length; i++) {
        endPoints[increments[i]] = [startX + incrementX * i, startY - incrementY * i]
    }

    return endPoints
}

export const drawMigrationSpiralLegend = (p5, legendWidth, legendHeight, selections, brackets, encoding, dataType, dataLength, increments) => {
    selections = { ...selections, ['coreSize']: 0, ['spiralWidth']: 20, ['spiralTightness']: 0.03 }

    const startX = encoding === 1 || encoding === 3 ? legendWidth * 0.33 : legendWidth / 2
    const startY = legendHeight / 2 + 10

    singleSpiral(p5, startX, startY, selections)
    drawMigrationSpiralYear(p5, startX, startY, selections, dataLength)



    if (encoding === 1 || encoding === 3) {
        singleSpiral(p5, legendWidth * 0.75, startY, selections)
        drawDistanceSpiral(p5, legendWidth * 0.75, startY, brackets, selections, dataType, increments)
    }
}

export const drawImportYearLegend = (p5, x, y, data, spiralSelections, background) => {
    p5.fill(background)
    p5.rect(x, y, 150, 150)

    legendGraphSpiral(p5, x + 60, y + 50, data['World']['data'], spiralSelections, background)

    // show legend for the trade balance colours
    p5.noStroke()
    p5.textSize(12)
    p5.fill("#59a14f")
    p5.ellipse(x, y + 135, 10, 10)
    p5.fill(0)
    p5.text("Positive trade balance", x + 70, y + 135)

    p5.fill('#e15759')
    p5.ellipse(x, y + 150, 10, 10)
    p5.fill(0)
    p5.text("Negative trade balance", x + 70, y + 150)
}

export const drawMigrationSpiralYear = (p5, x, y, selections, dataLength) => {
    const { spiralWidth, spiralTightness, coreSize, theme } = selections
    const colourTheme = themeColours[theme]
    let innerCore = coreSize
    let outerCore = coreSize + spiralWidth * 3.7
    let angle = -Math.PI / 2
    p5.fill(colourTheme.textColour)
    p5.textAlign(p5.CENTER, p5.CENTER)

    for (let i = 0; i < dataLength * 2; i++) {
        if (i % 2 === 0) {
            let x1 = x + p5.cos(angle) * innerCore
            let y1 = y + p5.sin(angle) * innerCore
            let x2 = x + p5.cos(angle) * outerCore
            let y2 = y + p5.sin(angle) * outerCore

            p5.stroke(0)
            p5.strokeWeight(0.5)
            p5.line(x1, y1, x2, y2)
            p5.noStroke()
        } else {
            let xText = x + p5.cos(angle) * outerCore
            let yText = y + p5.sin(angle) * outerCore

            p5.textSize(9)
            p5.text(migrationYears[Math.floor(i / 2)].slice(2), xText, yText)
        }

        angle += legendRadianPerYear / 2

        innerCore += (spiralTightness * 7)
        outerCore += (spiralTightness * 7)
    }
}

export const drawSpiralMonth = (p5, x, y, selections) => {
    const { spiralWidth, spiralTightness, coreSize } = selections
    let innerCore = coreSize
    let outerCore = coreSize + spiralTightness * 365 + spiralWidth * 1.5
    let angle = -Math.PI / 2

    p5.fill(255)
    p5.textAlign(p5.CENTER, p5.CENTER)

    for (let i = 0; i < 24; i++) {
        if (i % 2 === 0) {
            let x1 = x + p5.cos(angle) * innerCore
            let y1 = y + p5.sin(angle) * innerCore
            let x2 = x + p5.cos(angle) * outerCore
            let y2 = y + p5.sin(angle) * outerCore

            p5.stroke(0)
            p5.line(x1, y1, x2, y2)
            p5.noStroke()
        } else {
            let xText = x + p5.cos(angle) * outerCore
            let yText = y + p5.sin(angle) * outerCore

            p5.textSize(8)
            p5.text(abbreviatedMonths[Math.floor(i / 2)], xText, yText)
        }

        angle += radianPerMonth / 2

        innerCore += (spiralTightness * 25)
        outerCore += (spiralTightness * 25)
    }
}