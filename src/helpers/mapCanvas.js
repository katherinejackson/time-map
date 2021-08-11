import { averageData, getLocationData } from "./data";
import { row, spiral, spark, radialSpark, radialBarSpark, getSpiralSize, getRowSize, getPinAdjustment } from "../shapes";
import { shapes, rectValues, spiralValues, sparkValues } from "../constants";

export const getGlyph = (p5, pin, data, dataType, interval, shape, selections, encoding) => {
    let width = 500
    let height = 500

    let pg = p5.createGraphics(width, height)

    pg.clear()
    pg.noStroke()

    if (shape === shapes.SPIRAL.id && encoding === 2) {
        drawSpiral(p5, pg, width / 2, height / 2, pin.locations, data, dataType, interval, selections, encoding)
    } else if (shape === shapes.RECT.id) {
        drawRow(p5, pg, width / 2, height / 2, pin.locations, data, dataType, interval, selections, encoding)
    }

    return { pg, width, height }
}

export const getHoverTransform = (numLocations) => {
    return numLocations + 5
}

const drawSpiral = (p5, pg, x, y, ids, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, pin, hover = false) => {
    let dataType = 'TEMP'
    let locationData = []
    if (ids.length === 1) {
        locationData = getLocationData(ids[0], selections, data)
    } else {
        locationData = averageData(ids, selections, data)
    }

    let numLocations = hover ? getHoverTransform(ids.length) : ids.length
    let { spiralWidth, spiralTightness } = getSpiralSize(selections, numLocations)

    const newSelections = {
        ...selections,
        [spiralValues.SPIRAL_WIDTH]: spiralWidth,
        [spiralValues.SPACE_BETWEEN_SPIRAL]: spiralTightness
    }

    let startY = y
    if (mapPin) {
        startY = startY - getPinAdjustment(newSelections, shapes.SPIRAL.id, locationData)
    }

    spiral(dataType, interval, locationData, x, y, mapPin, pg, newSelections, x, startY, opaque, hover, yearIndication, fillMissing, theme)

    if (pin) {
        pg.fill(theme.textColour)
        pg.textSize(10)
        if (hover) {
            pg.textSize(15)
        }
        pg.textAlign(p5.CENTER, p5.CENTER)
        pg.text(ids.length, x - 2, startY + 1)
    }
}

const drawRow = (p5, pg, x, y, ids, data, dataType, interval, selections, encoding) => {
    let locationData = []
    const theme = selections.theme
    if (ids.length === 1) {
        locationData = getLocationData(ids[0], selections, data)
    } else {
        locationData = averageData(ids, selections, data)
    }

    const numLocations = ids.length
    const { rowWidth, pinHeight } = getRowSize(selections, numLocations)
    const startX = x - rowWidth / 2;
    const startY = y - pinHeight / 2
    if (selections.mapPin) {
        startY = y - getPinAdjustment(selections, shapes.RECT.id, locationData)
    }

    row(pg, dataType, interval, locationData, x, y, startX, startY, selections, encoding)

    pg.fill(theme.textColour)
    pg.textSize(10)
    pg.textAlign(p5.CENTER, p5.CENTER)

    if (selections.cluster) {
        if (selections.mapPin) {
            pg.fill(theme.pinBackground)
            pg.ellipse(x, y + 8, 16, 16)
            pg.fill(theme.textColour)
            pg.text(ids.length, x, y + 8)
        } else {
            pg.fill(theme.pinBackground)
            pg.ellipse(x, y + pinHeight / 2 + 8, 16, 16)
            pg.fill(theme.textColour)
            pg.text(ids.length, x, y + pinHeight / 2 + 8)
        }
    }

}

const drawSpark = (p5, pg, x, y, ids, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, encoding) => {
    let dataType = 'TEMP'
    let locationData = []
    if (ids.length === 1) {
        locationData = getLocationData(ids[0], selections, data)
    } else {
        locationData = averageData(ids, selections, data)
    }

    let startY;
    if (mapPin) {
        startY = y - selections[sparkValues.SPARK_HEIGHT] / 2 - getPinAdjustment(selections, shapes.SPARK.id, locationData)
    } else {
        startY = y - selections[sparkValues.SPARK_HEIGHT] / 2
    }

    const lineWidth = 365 * selections[sparkValues.DAY_WIDTH]
    const startX = x - lineWidth / 2

    spark(dataType, interval, locationData, x, y, mapPin, pg, selections, startX, startY, opaque, true, yearIndication, fillMissing, theme, encoding)

}

const drawRadialSpark = (p5, pg, x, y, ids, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, encoding) => {
    let dataType = 'TEMP'
    let locationData = []
    if (ids.length === 1) {
        locationData = getLocationData(ids[0], selections, data)
    } else {
        locationData = averageData(ids, selections, data)
    }

    let startY = y
    if (mapPin) {
        startY = y - getPinAdjustment(selections, shapes.RADIAL_SPARK.id, locationData)
    }

    radialSpark(dataType, interval, locationData, x, y, mapPin, pg, selections, x, startY, opaque, true, yearIndication, fillMissing, theme, encoding)

}

const drawRadialBarSpark = (p5, pg, x, y, ids, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, hover = false) => {
    let dataType = 'TEMP'
    let locationData = []
    if (ids.length === 1) {
        locationData = getLocationData(ids[0], selections, data)
    } else {
        locationData = averageData(ids, selections, data)
    }

    let startY = y
    if (mapPin) {
        startY = y - getPinAdjustment(selections, shapes.RADIAL_SPARK.id, locationData)
    }

    radialBarSpark(dataType, interval, locationData, x, y, mapPin, pg, selections, x, startY, opaque, true, yearIndication, fillMissing, theme)

}