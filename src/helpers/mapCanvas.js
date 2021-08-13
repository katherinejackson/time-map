import { averageData, getLocationData } from "./data";
import { row, spiral, getSpiralSize, getRowSize, getPinAdjustment } from "../shapes";
import { shapes } from "../constants";
import { getMinDistance } from "./cluster";

export const getGlyph = (p5, pin, data, dataType, interval, shape, selections, encoding) => {
    let width = 500
    let height = 500
    const { minDistanceX, minDistanceY } = getMinDistance(selections, shape)

    let pg = p5.createGraphics(width, height)

    pg.clear()
    pg.noStroke()

    let locationData = []
    const ids = pin.locations
    if (ids.length === 1) {
        locationData = getLocationData(ids[0], selections, data)
    } else {
        locationData = averageData(ids, selections, data)
    }

    if (shape === shapes.SPIRAL.id) {
        drawSpiral(p5, pg, width / 2, height / 2, ids, locationData, dataType, interval, selections, encoding)
    } else if (shape === shapes.ROW.id) {
        drawRow(p5, pg, width / 2 - minDistanceX/2, height / 2 - minDistanceY / 2, ids, locationData, dataType, interval, selections, encoding)
    }

    return { pg, width, height }
}

const drawSpiral = (p5, pg, x, y, ids, data, dataType, interval, selections, encoding) => {
    const numLocations = ids.length
    const { spiralWidth, spiralTightness } = getSpiralSize(selections, numLocations)
    const {mapPin, theme, hover} = selections

    const newSelections = {
        ...selections,
        spiralWidth,
        spiralTightness
    }

    let startY = y
    if (mapPin) {
        startY = startY - getPinAdjustment(newSelections, shapes.SPIRAL.id, data)
    }

    spiral(pg, dataType, interval, data, x, y, x, startY, selections, encoding)

    if (mapPin) {
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
    const {theme, mapPin, cluster} = selections

    const numLocations = ids.length
    const { rowWidth, pinHeight } = getRowSize(selections, numLocations)
    if (mapPin) {
        y = y - getPinAdjustment(selections, shapes.ROW.id, data)
    }

    row(pg, dataType, interval, data, x, y, x, y, selections, encoding)

    pg.fill(theme.textColour)
    pg.textSize(10)
    pg.textAlign(p5.CENTER, p5.CENTER)

    if (cluster) {
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