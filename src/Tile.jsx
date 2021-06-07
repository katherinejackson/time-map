import Sketch from "react-p5";
import React, {useEffect, useState} from "react";

import {canvasSize, colours, formats, radianPerDay, rectValues, spiralValues, views} from './constants'
import {fillColourGradient, getColour, getInterval, getManualInterval} from "./helpers";
import {rectangle, spiral} from "./shapes";

const Mappa = window.Mappa;

const options = {
    lat: 52,
    lng: -103,
    zoom: 4,
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
    const mappa = new Mappa('Leaflet');

    useEffect(() => {
        if (p5) {
            draw(p5)
        }
    }, [selections, p5, map, view])

    const getLocationData = (id) => {
        return data[id].data.slice(
            data[id].data.length - selections[spiralValues.NUM_YEARS] > 0
                ? data[id].data.length - selections[spiralValues.NUM_YEARS]
                : 0,
            data[id].data.length)
    }

    const drawSpiral = (x, y, id) => {
        const locationData = getLocationData(id)
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

    const drawRect = (x, y, id) => {
        const locationData = getLocationData(id)
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
            setMap(tileMap)
        } else {
            setP5(p5)
            p5.createCanvas(canvasSize, canvasSize).parent(parent)
        }
    }

    const draw = (p5) => {
        if (view === views.MAP.val) {
            map.onChange(drawLocations)
        } else {
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