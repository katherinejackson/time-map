import { shapes, rectValues, spiralValues, sparkValues } from "../constants";
import {getSpiralSize, getRadius, getRowSize, getRadialSparkRadius} from "../shapes";

const averageCoords = (ids, map, locations) => {
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

    if (shape === shapes.SPIRAL.id) {
        let radius = getRadius(selections)

        if (mapPin) {
            radius = radius + 4
        }

        minDistanceX = radius * 2
        minDistanceY = radius * 2
    } else if (shape === shapes.ROW.id) {
        const daysPerRow = 365
        minDistanceX = daysPerRow * selections.dayWidth
        minDistanceY = (selections.spaceBetween + selections.rowHeight) * selections.numYears

        if (mapPin) {
            minDistanceY = minDistanceY + 12
        } else {
            minDistanceY = minDistanceY + 4
        }
    }

    return { minDistanceX, minDistanceY }
}

export const updateClusters = (map, locationClusters) => {
    let newClusters = []
    locationClusters.forEach((cluster, index) => {
        let updated = map.latLngToContainerPoint([cluster.lat, cluster.long])
        newClusters[index] = { ...cluster, x: updated.x, y: updated.y }
    })

    return newClusters
}

export const addLocations = (locations, selections, shape, mapPin, map) => {
    const locationPins = []

    locations.forEach((item) => {
        let { minDistanceX, minDistanceY } = getMinDistance(selections, shape, mapPin)
        const location = map.latLngToContainerPoint([item.x, item.y])
        locationPins.push({
            x: location.x,
            y: location.y,
            lat: item.x,
            long: item.y,
            locations: [item.id],
            minDistanceX,
            minDistanceY,
            name: item.name,
        })
    })

    return locationPins
}

export const calculateClusters = (locations, selections, shape, mapPin, map) => {
    const newClusters = addLocations(locations, selections, shape, mapPin, map)

    let shouldCluster = true

    while (shouldCluster) {
        shouldCluster = cluster(newClusters)

        if (!!shouldCluster) {
            let newSelections;
            let numLocations = (shouldCluster[0].locations.concat(shouldCluster[1].locations)).length
            if (shape === shapes.SPIRAL.id) {
                let { spiralWidth, spiralTightness } = getSpiralSize(selections, numLocations)

                newSelections = {
                    ...selections,
                    [spiralValues.SPIRAL_WIDTH]: spiralWidth,
                    [spiralValues.SPACE_BETWEEN_SPIRAL]: spiralTightness
                }
            } else if (shape === shapes.ROW.id) {
                let { dayWidth, rowHeight } = getRowSize(selections, numLocations, selections[rectValues.NUM_YEARS])

                newSelections = {
                    ...selections,
                    [rectValues.DAY_WIDTH]: dayWidth,
                    [rectValues.ROW_HEIGHT]: rowHeight,
                }
            } else if (shape === shapes.SPARK.id) {
                newSelections = {
                    ...selections
                }
            } else if (shape === shapes.RADIAL_SPARK.id) {
                newSelections = {
                    ...selections
                }
            } else if (shape === shapes.RADIAL_BAR_SPARK.id) {
                newSelections = {
                    ...selections
                }
            }

            let { minDistanceX, minDistanceY } = getMinDistance(newSelections, shape, mapPin)
            let newLocations = shouldCluster[0].locations.concat(shouldCluster[1].locations)
            let { x, y, lat, long } = averageCoords(newLocations, map, locations)

            let newCluster = {
                x: x,
                y: y,
                lat: lat,
                long: long,
                locations: newLocations,
                minDistanceX,
                minDistanceY,
            }

            newClusters.splice(newClusters.indexOf(shouldCluster[0]), 1)
            newClusters.splice(newClusters.indexOf(shouldCluster[1]), 1)
            newClusters.push(newCluster)
        }
    }

    return newClusters
}


const cluster = (clusters) => {
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
