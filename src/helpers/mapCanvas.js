import { averageData, getLocationData } from "./data";
import { row, spiral } from "../shapes";
import { shapes } from "../constants";

export const getGlyph = (p5, pin, data, dataType, interval, shape, selections, encoding) => {
    let width = 500
    let height = 500

    let pg = p5.createGraphics(width, height)

    pg.clear()
    pg.noStroke()

    console.log("data ", data)

    let locationData = []
    const ids = pin.locations
    const numLocations = ids.length
    if (ids.length === 1) {
        locationData = getLocationData(ids[0], selections, data)
    } else {
        locationData = averageData(ids, selections, data)
    }

    if (shape === shapes.SPIRAL.id) {
        spiral(pg, dataType, interval, locationData, width/2, height/2, selections, encoding, numLocations)
    } else if (shape === shapes.ROW.id) {
        row(pg, dataType, interval, locationData, width/2, height/2, selections, encoding, numLocations)
    }

    return { pg, width, height }
}