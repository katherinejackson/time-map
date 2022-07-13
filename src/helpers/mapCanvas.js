import { averageData, getLocationData } from "./data";
import { row, spiral } from "../shapes";
import { shapes } from "../constants";

export const getGlyph = (p5, pin, data, dataType, interval, shape, selections, encoding) => {
    let width = 500
    let height = 500

    let pg = p5.createGraphics(width, height)

    pg.clear()
    pg.noStroke()
    
    let locationData = []
    const ids = pin.locations
    const numLocations = ids.length
    if (ids.length === 1) {
        locationData = getLocationData(ids[0], selections.numYears, data)
    } else {
        locationData = averageData(ids, selections.numYears, data)
    }

    if (shape === shapes.SPIRAL.id) {
        spiral(pg, dataType, interval, locationData, width/2, height/2, selections, encoding, numLocations, pin.name)
    } else if (shape === shapes.ROW.id) {
        let increments = [-35, -25, -15, -5, 0, 5, 15, 25, 30]
        row(pg, dataType, interval, locationData, width/2, height/2, selections, encoding, numLocations, pin.name, increments)
    }

    return { pg, width, height }
}