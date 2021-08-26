import { colours, manualIntervals } from './constants'
import { fillColourGradient, setColour } from "./helpers/colours";
import { formatNumbers, formatTradeNumbers } from './helpers/format';

export const drawLegend = (p5, x, y, selections, interval, dataType, brackets, textColour) => {
    if (dataType === 'COVID' && selections.numColours === 6) {
        drawManualLegend(p5, x, y, selections, interval, dataType, textColour)
    } else if (selections.numColours <= 2 || selections.numColours > 10) {
        drawGradientLegend(p5, x, y, selections, brackets, textColour)
    } else {
        p5.stroke(1)
        const length = 25
        const xStart = x - selections.numColours * length / 2
        let counter = 0

        p5.textSize(10)
        for (let i = interval.low; i < interval.high; i = Math.ceil((i + interval.interval) * 100) / 100) {
            p5.textAlign(p5.CENTER, p5.CENTER)
            setColour(p5, i, selections.numColours, interval, dataType)
            p5.rect(xStart + counter * length, y, length, 5)
            p5.fill(0)
            p5.line(xStart + counter * length, y, xStart + counter * length, y + 8)

            p5.noStroke()
            p5.fill(textColour)
            p5.text(Math.ceil(i), xStart + counter * length, y + 15)
            p5.stroke(1)
            counter = counter + 1
        }

        p5.line(xStart + counter * length, y, xStart + counter * length, y + 8)
        p5.noStroke()

        p5.text(Math.ceil(interval.high), xStart + counter * length, y + 15)
    }
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

export const drawManualLegend = (p5, x, y, selections, interval, dataType, textColour) => {
    p5.stroke(1)
    const numColours = selections.numColours
    const length = 75
    const xStart = x - numColours * length / 2
    const intervals = manualIntervals[dataType][numColours]
    let counter = 0

    p5.textSize(10)

    for (let i = 1; i < intervals.length; i++) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        setColour(p5, i, selections.numColours, interval, dataType)
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

    p5.fill(200)
    p5.rect(x + numColours * length / 2 + 50, y, 40, 10)
    p5.fill(textColour)
    p5.text('No Data', x + numColours * length / 2 + 50 + 20, y + 15)
}

const drawGradientLegend = (p5, x, y, selections, brackets, textColour) => {
    const { high, low, range, displayLow, displayHigh } = brackets
    const width = 1
    const legendWidth = 200
    const xStart = x - legendWidth/2

    const increase = range / legendWidth
    let counter = 0

    for (let i = low; i < high; i = i + increase) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        fillColourGradient(p5, i, brackets, selections.numColours)
        p5.rect(xStart + counter, y, width, 5)
        counter = counter + width
    }

    p5.textSize(10)
    p5.fill(textColour)
    p5.text(formatNumbers(displayLow || low), xStart, y + 15)
    p5.text(formatNumbers(displayHigh || high), xStart + legendWidth, y + 15)
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