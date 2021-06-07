import Sketch from "react-p5";
import React, {useEffect, useState} from "react";

import {canvasSize, colours, formats, radianPerDay, rectValues, spiralValues, views} from './constants'
import {fillColourGradient, getColour, getInterval, getManualInterval} from "./helpers";
import {rectangle, spiral} from "./shapes";

const Mappa = window.Mappa;

const options = {
    lat: 52,
    lng: -103,
    zoom: 6,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
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
    }, [selections, p5, map, view, mapPin])

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

        const radius = Math.abs(p5.sin(-1.5 + radianPerDay * 365 * locationData.length)
            * (selections[spiralValues.CORE_SIZE] + selections[spiralValues.SPACE_BETWEEN_SPIRAL] * 365 * locationData.length))
            + selections[spiralValues.SPIRAL_WIDTH]/2

        let startY = y
        if (mapPin && view === views.COMPARISON.val) {
            y = y + radius + 15
        } else if (mapPin && view === views.MAP.val) {
            startY = startY - radius - 15
        }

        spiral(dataType, interval, locationData, x, y, mapPin, p5, radius, selections, x, startY)
    }

    const drawRect = (x, y, ids) => {
        let locationData = []
        if (ids.length === 1) {
            locationData = getLocationData(ids[0])
        } else {
            locationData = averageData(ids)
        }

        const daysPerRow = Math.ceil(365/selections[rectValues.NUM_ROWS])

        let startX = x - daysPerRow * selections[rectValues.DAY_WIDTH]/2;
        let startY = y - ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * locationData.length)/2
        if (mapPin) {
            startY = y - 5 - ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * locationData.length)
        }

        rectangle(dataType, interval, locationData, x, y, mapPin, p5, selections, startX, startY)
    }

    const setup = (p5, parent) => {
        if (view === views.MAP.val) {
            setP5(p5)

            let tileMap = mappa.tileMap(options)
            tileMap.overlay(p5.createCanvas(800, 600).parent(parent))
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
                drawSpiral(canvasSize/2, canvasSize/2, locations[0].id)
            } else {
                drawRect(canvasSize/2, canvasSize/2, locations[0].id)
            }
    
            drawLegend(p5, canvasSize/2, 1)
        }

        p5.noLoop()
    }

    const drawLocations = () => {
        p5.clear()
        if (map !== null && locations) {
            p5.noStroke()
            locations.forEach(item => {
                const location = map.latLngToPixel(item.x, item.y)

                if (shape === formats.SPIRAL.id) {
                    drawSpiral(location.x, location.y, item.id)
                } else {
                    drawRect(location.x, location.y, item.id)
                }
            })
        }
    } 

    const drawLocationClusters = () => {
        if (p5) {
            p5.clear()
            p5.noStroke()
            const clusters = []
    
            if (map.ready) {
                locations.forEach((item) => {
                    const location = map.latLngToPixel(item.x, item.y)
                    clusters.push({x: location.x, y: location.y, locations: [item.id]})
            
                })
        
                let shouldCluster = true
            
                while (shouldCluster) {
                    shouldCluster = cluster(clusters)
            
                    if (!!shouldCluster) {
                        let newCluster = {
                            x: (shouldCluster[0].x + shouldCluster[1].x)/2,
                            y: (shouldCluster[0].y + shouldCluster[1].y)/2,
                            locations: shouldCluster[0].locations.concat(shouldCluster[1].locations)
                        }
    
                        clusters.splice(clusters.indexOf(shouldCluster[0]), 1)
                        clusters.splice(clusters.indexOf(shouldCluster[1]), 1)
                        clusters.push(newCluster)
                        averageData(newCluster.locations)
                    }
                }
    
                clusters.forEach(cluster => {
                    if (shape === formats.SPIRAL.id) {
                        drawSpiral(cluster.x, cluster.y, cluster.locations)
                    } else {
                        drawRect(cluster.x, cluster.y, cluster.locations)
                    }
                })
            }
        }

        setRedrawMap(false)
    }
        
    const cluster = (clusters) => {
        let minDistanceX;
        let minDistanceY;

        if (shape === formats.SPIRAL.id) {
            const radius = Math.abs(p5.sin(-1.5 + radianPerDay * 365 * selections[spiralValues.NUM_YEARS])
                * (selections[spiralValues.CORE_SIZE] + selections[spiralValues.SPACE_BETWEEN_SPIRAL] * 365 * selections[spiralValues.NUM_YEARS]))
                + selections[spiralValues.SPIRAL_WIDTH]/2
            minDistanceX = radius * 2
            minDistanceY = radius * 2
        } else {
            const daysPerRow = Math.ceil(365/selections[rectValues.NUM_ROWS])
            minDistanceX = daysPerRow * selections[rectValues.DAY_WIDTH]
            minDistanceY = ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * selections[rectValues.NUM_YEARS])
        }
        
        let result = false
        for (let c = 0; c < clusters.length; c++) {
            for (let i = c + 1; i < clusters.length; i++) {
                if (Math.abs(clusters[c].x - clusters[i].x ) < minDistanceX && Math.abs(clusters[c].y - clusters[i].y ) < minDistanceY) {
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
                    if (data[loc][year][day]) {
                        sum += data[loc][year][day]
                        counter++
                    } 
                }

                if (counter !== 0) {
                    newYear.push(Math.ceil(sum/counter * 100) / 100)
                }
            }

            newData.push(newYear)
        }

        return newData
    }

    const drawLegend = (p5, x, y) => {
        if (dataType === 'WIND' || dataType === 'PRECIP') {
            drawManualLegend(p5, x, y)
        } else if (selections[rectValues.NUM_COLOURS] <= 2 || selections[rectValues.NUM_COLOURS] > 10) {
            drawGradientLegend(p5, canvasSize/2, 1)
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

    const drawManualLegend = (p5, x, y) => {
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

    const drawGradientLegend = (p5, x, y) => {
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

    return <Sketch draw={draw} setup={setup} />
}

export default Tile