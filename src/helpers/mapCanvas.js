import { averageData, getLocationData } from "./data";
import { rectangle, spiral, getSpiralSize, getRadius, getRowSize, getPinAdjustment } from "../shapes";
import { shapes, rectValues, spiralValues, themeColours } from "../constants";

export const overlayImage = (p5, width, height, clusters, data, interval, selections, theme, fillMissing, mapPin, opaque, shape, yearIndication, hover) => {
    let pg  = p5.createGraphics(width, height)
    let outsideBounds = []

    pg.clear()
    pg.noStroke()

    if (clusters.length) {
        clusters.forEach((cluster, index) => {
            if (index !== hover) {
                if (cluster.x > 0 && cluster.x < width && cluster.y > 0 && cluster.y < height) {
                    if (shape === shapes.SPIRAL.id) {
                        drawSpiral(p5, pg, cluster.x, cluster.y, cluster.locations, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication)
                    } else {
                        drawRect(p5, pg, cluster.x, cluster.y, cluster.locations, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication)
                    }
                } else {
                    outsideBounds.push(cluster)
                }
            }
        })

        if (hover !== null && clusters[hover]) {
            if (shape === shapes.SPIRAL.id) {
                drawSpiral(p5, pg, clusters[hover].x, clusters[hover].y, clusters[hover].locations, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, true)
            } else {
                drawRect(p5, pg, clusters[hover].x, clusters[hover].y, clusters[hover].locations, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, true)
            }
        }
    }

    return {pg, outsideBounds}
}

export const getHoverTransform = (numLocations) => {
    return numLocations + 5
}

const drawSpiral = (p5, pg, x, y, ids, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, hover = false) => {
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
    pg.fill(theme.textColour)
    pg.textSize(10)
    if (hover) {
        pg.textSize(15)
    }
    pg.textAlign(p5.CENTER, p5.CENTER)
    pg.text(ids.length, x - 2, startY + 1)
}

const drawRect = (p5, pg, x, y, ids, data, interval, selections, theme, fillMissing, mapPin, opaque, yearIndication, hover = false) => {
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