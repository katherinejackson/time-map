import Sketch from "react-p5";
import React, { useEffect, useState } from "react";

import { formats, rectValues, spiralValues } from './constants'
import { getInterval, getManualInterval } from "./helpers/intervals";
import { rectangle, spiral, getPinAdjustment } from "./shapes";
import { drawLegend } from "./legend";


const Tile = (
    {
        data,
        dataBrackets,
        dataType,
        fillMissing,
        locations,
        mapPin,
        opaque,
        numX,
        selections,
        shape,
        yearIndication,
    }) => {
    const interval = dataType === 'TEMP'
        ? getInterval(dataBrackets, selections[rectValues.NUM_COLOURS])
        : getManualInterval(dataBrackets, selections[rectValues.NUM_COLOURS], dataType)
    const [p5, setP5] = useState(null)
    const canvasSize = window.innerWidth * 0.95 / numX

    useEffect(() => {
        if (p5) {
            draw(p5)
        }

    }, [selections, p5, opaque, yearIndication])

    const getLocationData = (id) => {
        let newData = []
        let years = Object.keys(data[id].data)
        if (years.length - selections[spiralValues.NUM_YEARS] > 0) {
            years = years.slice(years.length - selections[spiralValues.NUM_YEARS], years.length)
        }

        years.forEach(year => {
            newData.push(data[id].data[year])
        })

        return newData
    }

    const drawPin = (x, y, ids, hover = false) => {
        if (shape === formats.SPIRAL.id) {
            drawSpiral(x, y, ids, hover)
        } else {
            drawRect(x, y, ids, hover)
        }
    }

    const drawSpiral = (x, y, id) => {
        let locationData = getLocationData(id)

        let startY = y
        if (mapPin) {
            startY = startY - getPinAdjustment(selections, shape, locationData)
        }

        spiral(dataType, interval, locationData, x, y, mapPin, p5, selections, x, startY, opaque, true, yearIndication, fillMissing)
        p5.fill('black')
        p5.textSize(10)
        p5.text("1", x - 2, startY)
    }

    const drawRect = (x, y, id, hover = false) => {
        let locationData = getLocationData(id)
        const daysPerRow = Math.ceil(365 / selections[rectValues.NUM_ROWS])
        const dayWidth = selections[rectValues.DAY_WIDTH]
        const rowWidth = daysPerRow * dayWidth

        const pinHeight = ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * locationData.length)
        let startX = x - rowWidth / 2;
        let startY = y - pinHeight / 2
        if (mapPin) {
            startY = y - getPinAdjustment(selections, shape, locationData)
        }

        rectangle(dataType, interval, locationData, x, y, mapPin, p5, selections, startX, startY, opaque, true, yearIndication, fillMissing)
        p5.fill('black')
        p5.textSize(10)
        if (hover) {
            p5.textSize(16)
        }
        p5.text("1", x, y + pinHeight / 2 + 5)
    }

    const setup = (p5, parent) => {
        setP5(p5)
        p5.createCanvas(canvasSize, canvasSize).parent(parent)
    }

    const draw = (p5) => {
        p5.clear()
        p5.stroke(0)
        p5.fill(255)
        p5.rect(0, 0, canvasSize, canvasSize)
        p5.noStroke()
        drawPin(canvasSize / 2, canvasSize / 2, [locations[0].id])
        drawLegend(p5, canvasSize / 2, 1, selections, interval, dataType)
        p5.noLoop()
    }

    return <Sketch draw={draw} setup={setup} />
}

export default Tile