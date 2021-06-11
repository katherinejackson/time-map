import { colours, rectValues } from './constants'
import { fillColourGradient, getColour } from "./helpers";

export const drawLegend = (p5, x, y, selections, interval, dataType) => {
    if (dataType === 'WIND' || dataType === 'PRECIP') {
        drawManualLegend(p5, x, y, selections, interval, dataType)
    } else if (selections[rectValues.NUM_COLOURS] <= 2 || selections[rectValues.NUM_COLOURS] > 10) {
        drawGradientLegend(p5, x, y, selections, interval, dataType)
    } else {
        p5.stroke(1)
        const length = 25
        const xStart = x - selections[rectValues.NUM_COLOURS]*length/2
        let counter = 0

        p5.textSize(10)
        for (let i =  interval.highest; i > interval.lowest; i = Math.round((i - interval.interval) * 100)/100) {
            p5.textAlign(p5.CENTER, p5.CENTER)
            p5.fill(getColour(i, interval.highest, interval.interval, colours[dataType][selections[rectValues.NUM_COLOURS]]))
            p5.rect(xStart + counter * length, y, length, 5)
            p5.fill(0)
            p5.line(xStart + counter * length, y, xStart + counter * length, y + 8)

            p5.noStroke()
            p5.text(i, xStart + counter * length, y + 15)
            p5.stroke(1)
            counter = counter + 1
        }

        p5.line(xStart + counter * length, y, xStart + counter * length, y + 8)
        p5.noStroke()

        p5.text(interval.lowest, xStart + counter * length, y + 15)
    }
}

const drawManualLegend = (p5, x, y, selections, interval, dataType) => {
    p5.stroke(1)
    const length = 25
    const xStart = x - selections[rectValues.NUM_COLOURS]*length/2
    let counter = 0

    p5.textSize(10)
    for (let i = 1; i < colours[dataType][selections[rectValues.NUM_COLOURS]].length; i++) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.fill(colours[dataType][selections[rectValues.NUM_COLOURS]][i])
        p5.rect(xStart + counter * length, y, length, 5)
        p5.fill(0)
        p5.line(xStart + counter * length, y, xStart + counter * length, y + 8)

        p5.noStroke()
        p5.text(interval.intervals[i - 1], xStart + counter * length, y + 15)
        p5.stroke(1)
        counter = counter + 1
    }

    p5.line(xStart + counter * length, y, xStart + counter * length, y + 8)
    p5.noStroke()
    p5.text(interval.highest, xStart + counter * length, y + 15)
}

const drawGradientLegend = (p5, x, y, selections, interval, dataType) => {
    const width = 2
    const xStart = x - interval.range/2 * width
    let counter = 0
    for (let i =  interval.highest; i > interval.lowest; i = i - 1) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        fillColourGradient(p5, i, interval, selections[rectValues.NUM_COLOURS])
        p5.rect(xStart + counter, y, width, 5)
        counter = counter + width
    }
    p5.textSize(10)
    p5.fill(0)
    p5.text(interval.highest, xStart, y + 15)
    p5.text(interval.lowest, xStart + interval.range * width, y + 15)
}