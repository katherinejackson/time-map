import { colours, manualIntervals, themeColours, shapes, abbreviatedMonths } from './constants'
import { fillColourGradient, setColour } from "./helpers/colours";
import { formatNumbers, formatTradeNumbers } from './helpers/format';
import { drawSpiralMonth, getShapeSize, spiralOutline, legendGraphSpiral } from './shapes';


export const drawLegend = (p5, selections, dataBrackets, shape, encoding, interval, dataType, canvasWidth) => {
    const legendWidth = 220
    const legendHeight = shape === 1 ? 80 : 50
    const colourLegendWidth = 220
    const colourLegendHeight = 30
    let legendGraphics = p5.createGraphics(legendWidth, legendHeight)
    drawShapeLegend(legendGraphics, legendWidth, legendHeight, selections, dataBrackets, shape, encoding)
    p5.image(legendGraphics, canvasWidth - legendWidth, 0)

    if (encoding !== 1) {
        let colourLegendGraphics = p5.createGraphics(colourLegendWidth, colourLegendHeight)
        drawColourLegend(colourLegendGraphics, colourLegendWidth, colourLegendHeight, selections, interval, dataType, dataBrackets, shape, encoding)
        p5.image(colourLegendGraphics, canvasWidth - colourLegendWidth, legendHeight)
    }
}
export const drawShapeLegend = (p5, width, height, selections, brackets, shape, encoding) => {
    const { theme } = selections
    const textColour = themeColours[theme].textColour
    const backgroundColour = themeColours[theme].pinBackground

    p5.fill(backgroundColour)
    p5.stroke(backgroundColour)
    p5.rect(0, 0, width, height)

    if (shape === 2) {
        drawRowLegend(p5, width, height, brackets, textColour, encoding)
    } else if (shape === 1) {
        drawSpiralLegend(p5, width, height, selections, brackets, encoding)
    }
}

export const drawColourLegend = (p5, legendWidth, legendHeight, selections, interval, dataType, brackets) => {
    const { theme, numColours } = selections
    const textColour = themeColours[theme].textColour
    const backgroundColour = themeColours[theme].pinBackground
    const width = legendWidth * 0.85
    const height = legendHeight * 0.3

    p5.fill(backgroundColour)
    p5.stroke(backgroundColour)
    p5.rect(0, 0, legendWidth, legendHeight)

    if (dataType === 'COVID' && numColours === 6) {
        drawManualIntervalLegend(p5, width, height, legendWidth, legendHeight, numColours, interval, dataType, textColour)
    } else if (numColours <= 2 || numColours > 10) {
        drawGradientLegend(p5, width, height, legendWidth, legendHeight, numColours, brackets, textColour)
    } else {
        drawIntervalLegend(p5, width, height, legendWidth, legendHeight, numColours, interval, dataType, textColour)
    }
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

    // p5.fill(200)
    // p5.rect(x + numColours * length / 2 + 50, yStart, 40, 10)
    // p5.fill(textColour)
    // p5.text('No Data', x + numColours * length / 2 + 50 + 20, yStart + 15)
}

const drawGradientLegend = (p5, width, height, legendWidth, legendHeight, numColours, brackets, textColour) => {
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

    p5.textSize(10)
    p5.fill(textColour)
    p5.textAlign(p5.CENTER, p5.TOP)
    p5.text(formatNumbers(displayLow || low), xStart, legendHeight / 2)
    p5.text(formatNumbers(displayHigh || high), xStart + width, legendHeight / 2)
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

export const drawRowLegend = (p5, width, height, brackets, textColour, encoding) => {
    const lowString = formatNumbers(brackets.displayLow || brackets.low)
    const highString = formatNumbers(brackets.displayHigh || brackets.high)
    const rectWidth = width * 0.7
    const rectHeight = height * 0.7
    const startX = (width - rectWidth) / 2
    const startY = (height - rectHeight) / 3

    p5.stroke(textColour)
    p5.noFill()
    p5.rect(startX, startY, rectWidth, rectHeight)

    p5.noStroke()
    p5.fill(textColour)
    p5.textSize(10)

    if (encoding === 1 || encoding === 3) {
        p5.textAlign(p5.RIGHT, p5.BOTTOM)
        p5.text(lowString, startX - 5, startY + rectHeight)
        p5.textAlign(p5.RIGHT, p5.TOP)
        p5.text(highString, startX - 5, startY)
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
        p5.textSize(6)
        p5.text(abbreviatedMonths[i], x, startY + rectHeight / 2)
    }
}

export const drawSpiralLegend = (p5, legendWidth, legendHeight, selections, brackets, encoding) => {
    const lowString = formatNumbers(brackets.displayLow || brackets.low)
    const highString = formatNumbers(brackets.displayHigh || brackets.high)
    selections = { ...selections, ['coreSize']: 0, ['spiralWidth']: 20 }
    const { rightRadius, maxRadius, width, height } = getShapeSize(selections, shapes.SPIRAL.id)

    const startX = encoding === 1 || encoding === 3 ? legendWidth * 0.33 : legendWidth / 2
    const startY = legendHeight / 2
    const textColour = themeColours[selections.theme].textColour


    spiralOutline(p5, startX, startY, selections)
    drawSpiralMonth(p5, startX, startY, selections)

    if (encoding === 1 || encoding === 3) {
        const x = legendWidth * 0.66
        const textColour = themeColours[selections.theme].textColour
        spiralOutline(p5, x, startY, selections)
        p5.stroke(textColour, 150)
        p5.line(x, startY, x + maxRadius, startY - 20)
        p5.line(x + rightRadius, startY, x + maxRadius, startY)

        p5.fill(textColour)
        p5.noStroke()
        p5.textAlign(p5.LEFT, p5.CENTER)
        p5.textSize(10)
        p5.text(lowString, x + maxRadius + 3, startY - 20)
        p5.text(highString, x + maxRadius + 3, startY)
    }
}

export const drawImportYearLegend = (p5, x, y, data, spiralSelections, background) => {
    p5.fill(background)
    p5.rect(x, y, 125, 150)

    legendGraphSpiral(p5, x +  60, y + 50, data['World']['data'], spiralSelections, background)

    // show legend for the trade balance colours
    p5.noStroke()
    p5.textSize(12)
    p5.fill("#59a14f")
    p5.ellipse(x + 10, y + 100, 10, 10)
    p5.fill(0)
    p5.text("+ trade balance", x + 60, y + 100)

    p5.fill('#e15759')
    p5.ellipse(x + 10, y + 115, 10, 10)
    p5.fill(0)
    p5.text("- trade balance", x + 60, y + 115)

}