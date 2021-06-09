import Sketch from "react-p5";
import React, {useEffect, useState} from "react";

import {canvasSize, colours, formats, radianPerDay, rectValues, spiralValues, views} from './constants'
import {fillColourGradient, getColour, getDefaultSelections, getInterval, getManualInterval} from "./helpers";
import {rectangle, spiral} from "./shapes";

const Mappa = window.Mappa;

const mapWidth = 800
const mapHeight = 600

const options = {
    lat: 52,
    lng: -103,
    zoom: 6,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

const getSpiralSize = (selections, ids) => {
    let spiralWidth = selections[spiralValues.SPIRAL_WIDTH] + (ids.length * 3)
    let spiralTightness = spiralWidth/600
    return {spiralWidth, spiralTightness}
}

const getRadius = (selections, locationData) => {
    let numYears = locationData ? locationData.length : selections[rectValues.NUM_YEARS]
    return Math.abs(Math.sin(-1.5 + radianPerDay * 365 * numYears)
        * (selections[spiralValues.CORE_SIZE] + selections[spiralValues.SPACE_BETWEEN_SPIRAL] * 365 * numYears))
        + selections[spiralValues.SPIRAL_WIDTH]/2
}

const getMinDistance = (selections, shape) => {
    let minDistanceX;
    let minDistanceY;

    if (shape === formats.SPIRAL.id) {
        const radius = getRadius(selections)
        minDistanceX = radius * 2
        minDistanceY = radius * 2
    } else {
        const daysPerRow = Math.ceil(365/selections[rectValues.NUM_ROWS])
        minDistanceX = daysPerRow * selections[rectValues.DAY_WIDTH]
        minDistanceY = ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * selections[rectValues.NUM_YEARS])
    }

    return {minDistanceX, minDistanceY}
}

const getPinAdjustment = (selections, shape, locationData) => {
    let numYears = locationData ? locationData.length : selections[rectValues.NUM_YEARS]
    let startY = 0

    if (shape === formats.SPIRAL.id) {
        const radius = getRadius(selections, locationData)
        startY = radius + 15
    } else {
        startY = 5 + ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * numYears)
    }

    return startY
}

const Tile = (
    {
        data,
        dataBrackets,
        dataType,
        locations,
        mapPin,
        selections,
        shape,
        view,
    }) => {
    const interval = dataType === 'TEMP' 
                        ? getInterval(dataBrackets, selections[rectValues.NUM_COLOURS]) 
                        : getManualInterval(dataBrackets, selections[rectValues.NUM_COLOURS], dataType)
    const [p5, setP5] = useState(null)
    const [map, setMap] = useState(null)
    const [clusters, setClusters] = useState([])
    const [hover, setHover] = useState(null)
    const [redrawMap, setRedrawMap] = useState(null)
    const mappa = new Mappa('Leaflet');

    useEffect(() => {
        if (p5) {
           if (view === views.MAP.val) {
                drawLocationClusters()
            } else {
                draw(p5)
            }
        }

    }, [selections, p5, map, view, mapPin, hover])

    useEffect(() => {
        if (redrawMap) {
            drawLocationClusters()
        }
    }, [redrawMap])

    const getLocationData = (id) => {
        return data[id].data.slice(
            data[id].data.length - selections[spiralValues.NUM_YEARS] > 0
                ? data[id].data.length - selections[spiralValues.NUM_YEARS]
                : 0,
            data[id].data.length)
    }

    const drawSpiral = (x, y, ids) => {
        let locationData = []
        if (ids.length === 1) {
            locationData = getLocationData(ids[0])
        } else {
            locationData = averageData(ids)
        }

        let {spiralWidth, spiralTightness} = getSpiralSize(selections, ids)

        const newSelections = {
            ...selections, 
            [spiralValues.SPIRAL_WIDTH]: spiralWidth,
            [spiralValues.SPACE_BETWEEN_SPIRAL]: spiralTightness
        }

        let startY = y
        if (mapPin) {
            startY = startY - getPinAdjustment(newSelections, shape, locationData)
        }
         
        spiral(dataType, interval, locationData, x, y, mapPin, p5, getRadius(newSelections), newSelections, x, startY)
    }

    const drawRect = (x, y, ids, manualSelections) => {
        let newSelections = manualSelections ? manualSelections : selections
        let locationData = []
        if (ids.length === 1) {
            locationData = getLocationData(ids[0])
        } else {
            locationData = averageData(ids)
        }

        const daysPerRow = Math.ceil(365/newSelections[rectValues.NUM_ROWS])

        let startX = x - daysPerRow * newSelections[rectValues.DAY_WIDTH]/2;
        let startY = y - ((newSelections[rectValues.NUM_ROWS] * (newSelections[rectValues.SPACE_BETWEEN_ROWS] + newSelections[rectValues.ROW_HEIGHT])) * locationData.length)/2
        let drawPin = false
        if (mapPin && !manualSelections) {
            startY = y - getPinAdjustment(newSelections, shape, locationData)
            drawPin = true
        }

        rectangle(dataType, interval, locationData, x, y, drawPin, p5, newSelections, startX, startY)
    }

    const setup = (p5, parent) => {
        if (view === views.MAP.val) {
            setP5(p5)

            let tileMap = mappa.tileMap(options)
            tileMap.overlay(p5.createCanvas(mapWidth, mapHeight).parent(parent))
            tileMap.onChange(() => setRedrawMap(true))
            setMap(tileMap)
        } else {
            setP5(p5)
            p5.createCanvas(canvasSize, canvasSize).parent(parent)
        }
    }

    const draw = (p5) => {
        if (view === views.MAP.val) {
            drawLocationClusters()
        } else {
            p5.clear()
            p5.stroke(0)
            p5.fill(255)
            p5.rect(0, 0, canvasSize, canvasSize)
            p5.noStroke()
            if (shape === formats.SPIRAL.id) {
                drawSpiral(canvasSize/2, canvasSize/2, [locations[0].id])
            } else {
                drawRect(canvasSize/2, canvasSize/2, [locations[0].id])
            }
    
            drawLegend(p5, canvasSize/2, 1)
        }

        p5.noLoop()
    }

    const mouseMoved = (p5) => {
        let hoverFound = false
        let pinAdjustment = 0

        if (mapPin) {
            pinAdjustment = getPinAdjustment(selections, shape)
        }

        clusters.forEach((cluster, index)=> {
            if (Math.abs(p5.mouseX - cluster.x) < cluster.minDistanceX/2 && Math.abs(p5.mouseY - cluster.y + pinAdjustment) < cluster.minDistanceY/2) {
                setHover(index)
                hoverFound = true
            }
        })

        if (!hoverFound) {
            setHover(null)
        }
    }

    const drawLocationClusters = () => {
        if (p5) {
            p5.clear()
            p5.noStroke()
            const newClusters = []
    
            if (map.ready) {
                locations.forEach((item) => {
                    let {minDistanceX, minDistanceY} = getMinDistance(selections, shape)
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
                        let {spiralWidth, spiralTightness} = getSpiralSize(selections, shouldCluster[0].locations.concat(shouldCluster[1].locations))

                        const newSelections = {
                            ...selections, 
                            [spiralValues.SPIRAL_WIDTH]: spiralWidth,
                            [spiralValues.SPACE_BETWEEN_SPIRAL]: spiralTightness
                        }

                        let {minDistanceX, minDistanceY} = getMinDistance(newSelections, shape)
                        let newCluster = {
                            x: (shouldCluster[0].x + shouldCluster[1].x)/2,
                            y: (shouldCluster[0].y + shouldCluster[1].y)/2,
                            locations: shouldCluster[0].locations.concat(shouldCluster[1].locations),
                            minDistanceX,
                            minDistanceY,
                        }
    
                        newClusters.splice(newClusters.indexOf(shouldCluster[0]), 1)
                        newClusters.splice(newClusters.indexOf(shouldCluster[1]), 1)
                        newClusters.push(newCluster)
                    }
                }

                setClusters(newClusters)
    
                newClusters.forEach(cluster => {
                    if (shape === formats.SPIRAL.id) {
                        drawSpiral(cluster.x, cluster.y, cluster.locations)
                    } else {
                        drawRect(cluster.x, cluster.y, cluster.locations)
                    }
                })

                if (hover !== null) {
                    drawHover()
                }
            }
        }

        drawLegend(mapWidth/2, mapHeight - 40)

        setRedrawMap(false)
    }
        
    const cluster = (clusters) => {
        let result = false
        for (let c = 0; c < clusters.length; c++) {
            for (let i = c + 1; i < clusters.length; i++) {
                if (Math.abs(clusters[c].x - clusters[i].x ) < Math.max(clusters[c].minDistanceX, clusters[i].minDistanceX) 
                    && Math.abs(clusters[c].y - clusters[i].y ) < Math.max(clusters[c].minDistanceY, clusters[i].minDistanceY)) {
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

    const drawHover = () => {
        let newSelections = getDefaultSelections(formats.RECT.id, dataType)
        newSelections = {...newSelections, [rectValues.NUM_COLOURS]: selections[rectValues.NUM_COLOURS]}
        const ids = clusters[hover].locations
        const {minDistanceY} = getMinDistance(newSelections, formats.RECT.id)
        const rowHeight = 20 + minDistanceY * 2

        p5.fill('white')
        p5.rect(mapWidth - 150, 0, 150, ids.length * rowHeight)
        p5.textAlign(p5.LEFT, p5.TOP)
        
        ids.forEach((id, index) => {
            p5.fill('black')
            p5.text(locations[id]?.name, mapWidth - 150, index * rowHeight)
            drawRect(mapWidth - 75, index * rowHeight + 20, [id], newSelections)
        })

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
                    if (data[loc] && data[loc][year] && data[loc][year][day]) {
                        sum += data[loc][year][day]
                        counter++
                    } 
                }

                if (counter !== 0) {
                    newYear.push(Math.ceil(sum/counter * 100) / 100)
                }
            }

            if (newYear.length) {
                newData.push(newYear)
            }
        }

        return newData
    }

    const drawLegend = (x, y) => {
        if (dataType === 'WIND' || dataType === 'PRECIP') {
            drawManualLegend(x, y)
        } else if (selections[rectValues.NUM_COLOURS] <= 2 || selections[rectValues.NUM_COLOURS] > 10) {
            drawGradientLegend(x, y)
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

    const drawManualLegend = (x, y) => {
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

    const drawGradientLegend = (x, y) => {
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

    return <Sketch draw={draw} mouseMoved={mouseMoved} setup={setup} />
}

export default Tile