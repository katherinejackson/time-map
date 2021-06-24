import { formats, rectValues } from "../constants";
import { getRadius } from "../shapes";

export const cluster = (clusters) => {
    let result = false
    for (let c = 0; c < clusters.length; c++) {
        for (let i = c + 1; i < clusters.length; i++) {
            if (Math.abs(clusters[c].x - clusters[i].x) < Math.max(clusters[c].minDistanceX, clusters[i].minDistanceX)
                && Math.abs(clusters[c].y - clusters[i].y) < Math.max(clusters[c].minDistanceY, clusters[i].minDistanceY)) {
                result = [clusters[c], clusters[i]]
                break
            }
        }

        if (result !== false) {
            break
        }
    }

    return result
}

export const averageCoords = (ids, map, locations) => {
    let x = 0
    let y = 0

    ids.forEach(id => {
        x = x + locations[id].x
        y = y + locations[id].y
    })

    let newLocation = map.latLngToContainerPoint([x / ids.length, y / ids.length])


    return { x: newLocation.x, y: newLocation.y, lat: x / ids.length, long: y / ids.length }
}


export const getMinDistance = (selections, shape, mapPin = false) => {
    let minDistanceX;
    let minDistanceY;

    if (shape === formats.SPIRAL.id) {
        let radius = getRadius(selections)

        if (mapPin) {
            radius = radius + 4
        }

        minDistanceX = radius * 2
        minDistanceY = radius * 2
    } else {
        const daysPerRow = Math.ceil(365 / selections[rectValues.NUM_ROWS])
        minDistanceX = daysPerRow * selections[rectValues.DAY_WIDTH]
        minDistanceY = ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * selections[rectValues.NUM_YEARS])

        if (mapPin) {
            minDistanceY = minDistanceY + 12
        } else {
            minDistanceY = minDistanceY + 4
        }
    }

    return { minDistanceX, minDistanceY }
}
