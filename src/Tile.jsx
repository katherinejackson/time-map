import Sketch from "react-p5";
import React, { useEffect, useState } from "react";

import { canvasSize, formats, rectValues, spiralValues } from './constants'
import { getInterval, getManualInterval } from "./helpers";
import { rectangle, spiral, getRadius} from "./shapes";
import { drawLegend } from "./legend";

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
    }) => {
    const interval = dataType === 'TEMP'
        ? getInterval(dataBrackets, selections[rectValues.NUM_COLOURS])
        : getManualInterval(dataBrackets, selections[rectValues.NUM_COLOURS], dataType)
    const [p5, setP5] = useState(null)

    useEffect(() => {
        if (p5) {
            draw(p5)
        }

    }, [selections, p5])

    const getLocationData = (id) => {
        return data[id].data.slice(
            data[id].data.length - selections[spiralValues.NUM_YEARS] > 0
                ? data[id].data.length - selections[spiralValues.NUM_YEARS]
                : 0,
            data[id].data.length)
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

        spiral(dataType, interval, locationData, x, y, mapPin, p5, getRadius(selections), selections, x, startY)
        p5.fill('black')
        p5.textSize(10)
        p5.text("1", x - 2, startY)
    }

    const drawRect = (x, y, id, hover = false) => {
        let locationData = getLocationData(id)
        const daysPerRow = Math.ceil(365/selections[rectValues.NUM_ROWS])
        const dayWidth = selections[rectValues.DAY_WIDTH]
        const rowWidth = daysPerRow * dayWidth
        let startX = x - rowWidth / 2;
        let startY = y - ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * locationData.length) / 2
        if (mapPin) {
            startY = y - getPinAdjustment(selections, shape, locationData)
        }

        rectangle(dataType, interval, locationData, x, y, mapPin, p5, selections, startX, startY)
        p5.fill('black')
        p5.textSize(10)
        if (hover) {
            p5.textSize(16)
        }
        p5.text("1", x, y + 5)
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