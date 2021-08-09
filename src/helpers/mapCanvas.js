import { averageData, getLocationData } from "./data";
import { rectangle, spiral, spark, radialSpark, radialBarSpark, getSpiralSize, getRowSize, getPinAdjustment, getRadius } from "../shapes";
import { shapes, rectValues, spiralValues, sparkValues } from "../constants";

const getBounds = (clusters) => {
    let width = 0
    let height = 0

    clusters.forEach(item => {
        if (item.x > width) {
            width = item.x
        }

        if (item.y > height) {
            height = item.y
        }
    })

    return { width: width + 100, height: height + 100 }
}

export const getGlyph = (p5, pin, data, interval, selections, theme, fillMissing, mapPin, opaque, shape, yearIndication, cluster, hover) => {
    let width = 500
    let height = 500

    let pg = p5.createGraphics(width, height)

    pg.clear()
    pg.noStroke()

    if (shape === shapes.SPIRAL.id) {
        drawSpiral(p5, pg, width / 2, height / 2, pin.locations, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, cluster, hover)
    } else if (shape === shapes.RECT.id) {
        drawRect(p5, pg, width / 2, height / 2, pin.locations, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, cluster, hover)
    } else if (shape === shapes.SPARK.id) {
        drawSpark(p5, pg, width / 2, height / 2, pin.locations, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, hover)
    } else if (shape === shapes.RADIAL_SPARK.id) {
        drawRadialSpark(p5, pg, width / 2, height / 2, pin.locations, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, hover)
    } else if (shape === shapes.RADIAL_BAR_SPARK.id) {
        drawRadialBarSpark(p5, pg, width / 2, height / 2, pin.locations, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, hover)
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

const drawRect = (p5, pg, x, y, ids, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, cluster, hover = false) => {
    let dataType = 'TEMP'
    let locationData = []
    if (ids.length === 1) {
        locationData = getLocationData(ids[0], selections, data)
    } else {
        locationData = averageData(ids, selections, data)
    }

    let numLocations = hover ? getHoverTransform(ids.length) : ids.length
    let { dayWidth, rowWidth, rowHeight } = getRowSize(selections, numLocations, locationData.length)
    const newSelections = {
        ...selections,
        [rectValues.DAY_WIDTH]: dayWidth,
        [rectValues.ROW_HEIGHT]: rowHeight,
    }

    let pinHeight = ((newSelections[rectValues.NUM_ROWS] * (newSelections[rectValues.SPACE_BETWEEN_ROWS] + newSelections[rectValues.ROW_HEIGHT])) * locationData.length)
    let startX = x - rowWidth / 2;
    let startY = y - pinHeight / 2
    if (mapPin) {
        startY = y - getPinAdjustment(newSelections, shapes.RECT.id, locationData)
    }

    rectangle(dataType, interval, locationData, x, y, mapPin, pg, newSelections, startX, startY, opaque, hover, yearIndication, fillMissing, theme)
    
    if (cluster) {
        pg.fill(theme.textColour)
        pg.textSize(10)
        pg.textAlign(p5.CENTER, p5.CENTER)
        if (hover) {
            pg.textSize(16)
        }
    
        if (mapPin) {
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

const drawSpark = (p5, pg, x, y, ids, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, hover = false) => {
    let dataType = 'TEMP'
    let locationData = []
    if (ids.length === 1) {
        locationData = getLocationData(ids[0], selections, data)
    } else {
        locationData = averageData(ids, selections, data)
    }

    let startY;
    if (mapPin) {
        startY = y - selections[sparkValues.SPARK_HEIGHT]/2 - getPinAdjustment(selections, shapes.SPARK.id, locationData)
    } else {
        startY = y - selections[sparkValues.SPARK_HEIGHT]/2
    }

    const lineWidth = 365 * selections[sparkValues.DAY_WIDTH]
    const startX = x - lineWidth / 2

    spark(dataType, interval, locationData, x, y, mapPin, pg, selections, startX, startY, opaque, true, yearIndication, fillMissing, theme)

}

const drawRadialSpark = (p5, pg, x, y, ids, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, hover = false) => {
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

    radialSpark(dataType, interval, locationData, x, y, mapPin, pg, selections, x, startY, opaque, true, yearIndication, fillMissing, theme)

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