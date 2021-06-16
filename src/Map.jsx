import Sketch from "react-p5";
import React, { useEffect, useState } from "react";

import { drawLegend } from "./legend"
import { formats, rectValues, spiralValues } from './constants'
import { getDefaultSelections, getInterval, getManualInterval } from "./helpers";
import { rectangle, spiral, getSpiralSize, getRadius, getRowSize } from "./shapes";

const Mappa = window.Mappa;
const mapWidth = window.innerWidth * 0.95
const mapHeight = window.innerHeight * 0.75

const options = {
    lat: 52,
    lng: -103,
    zoom: 6,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

const getMinDistance = (selections, shape, mapPin = false) => {
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

const getPinAdjustment = (selections, shape, locationData) => {
    let numYears = locationData ? locationData.length : selections[rectValues.NUM_YEARS]
    let startY = 0

    if (shape === formats.SPIRAL.id) {
        const radius = getRadius(selections, locationData)
        startY = radius + 15
    } else {
        startY = 7 + ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * numYears)
    }

    return startY
}

const Map = (
    {
        data,
        dataBrackets,
        dataType,
        fillMissing,
        locations,
        mapPin,
        opaque,
        selections,
        shape,
        yearIndication,
    }) => {
    const interval = dataType === 'TEMP'
        ? getInterval(dataBrackets, selections[rectValues.NUM_COLOURS])
        : getManualInterval(dataBrackets, selections[rectValues.NUM_COLOURS], dataType)
    const [p5, setP5] = useState(null)
    const [map, setMap] = useState(null)
    const [clusters, setClusters] = useState([])
    const [detailed, setDetailed] = useState([])
    const [detailedHeight, setDetailedHeight] = useState(0)
    const [hover, setHover] = useState(null)
    const [animated, setAnimated] = useState({ index: null, x: 0, y: 0, numDays: 0, width: selections[spiralValues.SPIRAL_WIDTH] })
    const [redrawMap, setRedrawMap] = useState(null)
    const mappa = new Mappa('Leaflet');

    useEffect(() => {
        if (p5) {
            drawLocationClusters()
        }

    }, [selections, p5, map, mapPin, hover, opaque, yearIndication, fillMissing])

    useEffect(() => {
        if (redrawMap) {
            drawLocationClusters()
        }
    }, [redrawMap])

    useEffect(() => {
        if (animated.index !== null) {
            draw(p5)
        }
    }, [animated.index])

    useEffect(() => {
        if (p5) {
            draw(p5)
        }
    }, [detailed])

    const getLocationData = (id) => {
        let newData = []
        let years = Object.keys(data[id].data)
        if (years.length - selections[spiralValues.NUM_YEARS] > 0) {
            years = years.slice(years.length - selections[spiralValues.NUM_YEARS], years.length)
        } 

        years.forEach(year =>  {
            newData.push(data[id].data[year])
        })

        return newData
    }

    const getHoverTransform = (numLocations) => {
        return numLocations + 5
    }

    const drawPin = (x, y, ids, hover = false) => {
        if (shape === formats.SPIRAL.id) {
            drawSpiral(x, y, ids, hover)
        } else {
            drawRect(x, y, ids, hover)
        }
    }

    const drawSpiral = (x, y, ids, hover = false) => {
        let locationData = []
        if (ids.length === 1) {
            locationData = getLocationData(ids[0])
        } else {
            locationData = averageData(ids)
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
            startY = startY - getPinAdjustment(newSelections, shape, locationData)
        }

        spiral(dataType, interval, locationData, x, y, mapPin, p5, getRadius(newSelections), newSelections, x, startY, opaque, hover, yearIndication, fillMissing)
        p5.fill('black')
        p5.textSize(10)
        if (hover) {
            p5.textSize(15)
        }
        p5.text(ids.length, x - 2, startY + 1)
    }

    const drawRect = (x, y, ids, hover = false) => {
        let locationData = []
        if (ids.length === 1) {
            locationData = getLocationData(ids[0])
        } else {
            locationData = averageData(ids)
        }

        let numLocations = hover ? getHoverTransform(ids.length) : ids.length
        let { dayWidth, rowWidth, rowHeight } = getRowSize(selections, numLocations)
        const newSelections = {
            ...selections,
            [rectValues.DAY_WIDTH]: dayWidth,
            [rectValues.ROW_HEIGHT]: rowHeight,
        }

        let pinHeight = ((newSelections[rectValues.NUM_ROWS] * (newSelections[rectValues.SPACE_BETWEEN_ROWS] + newSelections[rectValues.ROW_HEIGHT])) * locationData.length)
        let startX = x - rowWidth / 2;
        let startY = y - pinHeight / 2
        if (mapPin) {
            startY = y - getPinAdjustment(newSelections, shape, locationData)
        }

        rectangle(dataType, interval, locationData, x, y, mapPin, p5, newSelections, startX, startY, opaque, hover, yearIndication, fillMissing)
        p5.fill('black')
        p5.textSize(10)
        if (hover) {
            p5.textSize(16)
        }

        if (mapPin) {
            p5.fill(255, 255, 255, 250)
            p5.ellipse(x, y + 8, 16, 16)
            p5.fill(0)
            p5.text(ids.length, x, y + 8)
        } else {
            p5.fill(255, 255, 255, 250)
            p5.ellipse(x, y + pinHeight/2 + 8, 16, 16)
            p5.fill(0)
            p5.text(ids.length, x, y + pinHeight/2 + 8)
        }

    }

    const drawHoverRect = (x, y, id, hoverSelections) => {
        let locationData = getLocationData(id)
        const daysPerRow = Math.ceil(365 / hoverSelections[rectValues.NUM_ROWS])

        let startX = x - daysPerRow * hoverSelections[rectValues.DAY_WIDTH] / 2;
        let startY = y - ((hoverSelections[rectValues.NUM_ROWS] * (hoverSelections[rectValues.SPACE_BETWEEN_ROWS] + hoverSelections[rectValues.ROW_HEIGHT])) * locationData.length) / 2

        rectangle(dataType, interval, locationData, x, y, false, p5, hoverSelections, startX, startY, opaque, hover, yearIndication, fillMissing)
    }

    const drawAnimatedRect = (x, y, ids, animSelections, numDays) => {
        let locationData = []
        if (ids.length === 1) {
            locationData = getLocationData(ids[0])
        } else {
            locationData = averageData(ids)
        }

        let newData = []
        locationData.forEach(year => {
            if (numDays < year.length) {
                newData.push(year.slice(year.length - numDays))
            } else {
                newData.push(year)
            }
        })

        let startX = x;
        let startY = y - ((animSelections[rectValues.NUM_ROWS] * (animSelections[rectValues.SPACE_BETWEEN_ROWS] + animSelections[rectValues.ROW_HEIGHT])) * newData.length) / 2

        rectangle(dataType, interval, newData, x, y, false, p5, animSelections, startX, startY, opaque, hover, yearIndication, fillMissing)
    }

    const setup = (p5, parent) => {
        setP5(p5)

        let tileMap = mappa.tileMap(options)
        tileMap.overlay(p5.createCanvas(mapWidth, mapHeight).parent(parent))
        tileMap.onChange(() => setRedrawMap(true))
        setMap(tileMap)
    }

    const draw = (p5) => {
        drawLocationClusters()

        if (animated.index !== null) {
            p5.loop()
            let cluster = clusters[animated.index]
            let newSelections = getDefaultSelections(formats.RECT.id, dataType)
            newSelections = {
                ...newSelections,
                [rectValues.NUM_COLOURS]: selections[rectValues.NUM_COLOURS],
                [rectValues.DAY_WIDTH]: 0.25,
                [rectValues.ROW_HEIGHT]: animated.width,
            }

            drawAnimatedRect(animated.x, animated.y, cluster.locations, newSelections, animated.numDays)
            if (animated.numDays < 365) {
                setAnimated({ ...animated, numDays: animated.numDays + 80 })
            } else if (animated.x < mapWidth - 125) {
                setAnimated({ ...animated, x: animated.x + 50 })
            } else {
                setAnimated({ ...animated, y: animated.y - 50 })
            }

            if (animated.y < detailedHeight * (detailed.length + 1)) {
                let newDetailed = [...detailed]
                clusters[animated.index].locations.forEach(id => {
                    if (!detailed.includes(id)) {
                        newDetailed.push(id)
                    }
                })

                setAnimated({ index: null, x: 0, y: 0, numDays: 0 })
                setDetailed(newDetailed)
            }
        } else {
            p5.noLoop()
        }
    }

    const mouseMoved = (p5) => {
        let hoverFound = false
        let pinAdjustment = 0

        if (mapPin) {
            pinAdjustment = getPinAdjustment(selections, shape)
        }

        clusters.forEach((cluster, index) => {
            if (Math.abs(p5.mouseX - cluster.x) < cluster.minDistanceX && Math.abs(p5.mouseY - cluster.y + pinAdjustment) < cluster.minDistanceY) {
                setHover(index)
                hoverFound = true
            }
        })

        if (!hoverFound) {
            setHover(null)
        }
    }

    const mouseClicked = (p5) => {
        let pinAdjustment = 0

        if (mapPin) {
            pinAdjustment = getPinAdjustment(selections, shape)
        }

        clusters.forEach((cluster, index) => {
            if (Math.abs(p5.mouseX - cluster.x) < cluster.minDistanceX && Math.abs(p5.mouseY - cluster.y + pinAdjustment) < cluster.minDistanceY) {
                let allDisplayed = true
                cluster.locations.forEach(id => {
                    if (!detailed.includes(id)) {
                        allDisplayed = false
                    }
                })

                if (allDisplayed) {
                    let newDetailed = [...detailed]
                    cluster.locations.forEach(id => {
                        let index = newDetailed.indexOf(id)
                        newDetailed.splice(index, 1)
                    })
                    setDetailed(newDetailed)
                } else {
                    let { spiralWidth, spiralTightness } = getSpiralSize(selections, getHoverTransform(clusters[index].locations.length))

                    const newSelections = {
                        ...selections,
                        [spiralValues.SPIRAL_WIDTH]: spiralWidth,
                        [spiralValues.SPACE_BETWEEN_SPIRAL]: spiralTightness
                    }
                    setAnimated({ ...animated, index, x: clusters[index].x, y: clusters[index].y - getRadius(newSelections), width: spiralWidth / 2 })
                }

            }
        })
    }

    const drawLocationClusters = () => {
        if (p5) {
            p5.clear()
            p5.noStroke()
            const newClusters = []

            if (map.ready) {
                locations.forEach((item) => {
                    let { minDistanceX, minDistanceY } = getMinDistance(selections, shape, mapPin)
                    const location = map.latLngToPixel(item.x, item.y)
                    newClusters.push({
                        x: location.x,
                        y: location.y,
                        locations: [item.id],
                        minDistanceX,
                        minDistanceY
                    })

                })

                let shouldCluster = true

                while (shouldCluster) {
                    shouldCluster = cluster(newClusters)

                    if (!!shouldCluster) {
                        let newSelections;
                        let numLocations = (shouldCluster[0].locations.concat(shouldCluster[1].locations)).length
                        if (shape === formats.SPIRAL.id) {
                            let { spiralWidth, spiralTightness } = getSpiralSize(selections, numLocations)

                            newSelections = {
                                ...selections,
                                [spiralValues.SPIRAL_WIDTH]: spiralWidth,
                                [spiralValues.SPACE_BETWEEN_SPIRAL]: spiralTightness
                            }
                        } else {
                            let { dayWidth, rowHeight } = getRowSize(selections, numLocations)

                            newSelections = {
                                ...selections,
                                [rectValues.DAY_WIDTH]: dayWidth,
                                [rectValues.ROW_HEIGHT]: rowHeight,
                            }
                        }

                        let { minDistanceX, minDistanceY } = getMinDistance(newSelections, shape, mapPin)
                        let newLocations = shouldCluster[0].locations.concat(shouldCluster[1].locations)
                        let {x, y} = averageCoords(newLocations)
                        let newCluster = {
                            x: x,
                            y: y,
                            locations: newLocations,
                            minDistanceX,
                            minDistanceY,
                        }

                        newClusters.splice(newClusters.indexOf(shouldCluster[0]), 1)
                        newClusters.splice(newClusters.indexOf(shouldCluster[1]), 1)
                        newClusters.push(newCluster)
                    }
                }

                setClusters(newClusters)

                newClusters.forEach((cluster, index) => {
                    let withinBounds = cluster.x > 0 && cluster.x < mapWidth && cluster.y > 0 && cluster.y < mapHeight
                    if (index !== hover && withinBounds) {
                        drawPin(cluster.x, cluster.y, cluster.locations)
                    }

                })

                if (hover !== null) {
                    drawPin(clusters[hover].x, clusters[hover].y, clusters[hover].locations, true)
                }

                if (detailed.length) {
                    drawDetailed()
                }
            }
        }

        drawLegend(p5, mapWidth / 2, mapHeight - 40, selections, interval, dataType)

        setRedrawMap(false)
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

    const drawDetailed = () => {
        let newSelections = getDefaultSelections(formats.RECT.id, dataType)
        newSelections = {
            ...newSelections,
            [rectValues.NUM_COLOURS]: selections[rectValues.NUM_COLOURS],
            [rectValues.DAY_WIDTH]: 0.25,
        }
        const ids = detailed
        const { minDistanceY } = getMinDistance(newSelections, formats.RECT.id)
        const rowHeight = 20 + minDistanceY * 2

        p5.fill('white')
        p5.rect(mapWidth - 150, 0, 150, ids.length * rowHeight)
        p5.textAlign(p5.LEFT, p5.TOP)

        ids.forEach((id, index) => {
            p5.fill('black')
            p5.textSize(10)
            p5.text(locations[id].name, mapWidth - 150, index * rowHeight)
            drawHoverRect(mapWidth - 75, index * rowHeight + 20, id, newSelections)
        })

        setDetailedHeight(rowHeight)
    }

    const averageData = (locations) => {
        let data = []
        let newData = []

        locations.forEach(id => {
            data.push(getLocationData(id))
        })

        for (let year = 0; year < selections[rectValues.NUM_YEARS]; year++) {
            let newYear = []
            for (let day = 0; day < 365; day++) {
                let sum = 0
                let counter = 0

                for (let loc = 0; loc < data.length; loc++) {
                    if (data[loc] && data[loc][year] && data[loc][year].length > day) {
                        if (data[loc][year][day] !== '') {
                            sum += data[loc][year][day]
                            counter++
                        }
                    }
                }

                if (counter !== 0) {
                    newYear.push(Math.ceil(sum / counter * 100) / 100)
                } else {
                    newYear.push('')
                }
            }

            if (newYear.length) {
                newData.push(newYear)
            }
        }

        return newData
    }

    const averageCoords = (ids) => {
        let x = 0
        let y = 0

        ids.forEach(id => {
            x = x + locations[id].x
            y = y + locations[id].y
        })

        let newLocation = map.latLngToPixel(x/ids.length, y/ids.length)

        return {x: newLocation.x, y: newLocation.y}
    }


    return <Sketch draw={draw} mouseClicked={mouseClicked} mouseMoved={mouseMoved} setup={setup} />
}

export default Map