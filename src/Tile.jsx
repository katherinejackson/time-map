import Sketch from "react-p5";
import React, { useEffect, useState, useContext } from "react";

import { shapes, rectValues, spiralValues, themeColours, sparkValues } from './constants'
import { getInterval, getManualInterval } from "./helpers/intervals";
import { rectangle, spiral, spark, getPinAdjustment, radialSpark } from "./shapes";
import { drawLegend } from "./legend";
import SelectionContext from "./SelectionContext";
import DataContext from "./DataContext";


const Tile = ({ numX, selections }) => {
    const { locations, data, dataBrackets, dataType } = useContext(DataContext)
    const { fillMissing, mapPin, opaque, shape, yearIndication, theme } = useContext(SelectionContext)
    const colourTheme = themeColours[theme]
    const interval = dataType === 'TEMP'
        ? getInterval(dataBrackets, selections[rectValues.NUM_COLOURS])
        : getManualInterval(dataBrackets, selections[rectValues.NUM_COLOURS], dataType)
    const [p5, setP5] = useState(null)
    const canvasSize = window.innerWidth * 0.95 / numX

    useEffect(() => {
        if (p5) {
            draw(p5)
        }

    }, [selections, p5, opaque, yearIndication, mapPin, shape, fillMissing, theme])

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

    const drawPin = (x, y, id) => {
        let locationData = getLocationData(id)

        if (shape === shapes.SPIRAL.id) {
            drawSpiral(x, y, locationData)
        } else if (shape === shapes.RECT.id) {
            drawRect(x, y, locationData)
        } else if (shape === shapes.SPARK.id) {
            drawSpark(x, y, locationData)
        } else if (shape === shapes.RADIAL_SPARK.id) {
            drawRadialSpark(x, y, locationData)
        }
    }

    const drawSpiral = (x, y, locationData) => {
        let startY = y
        if (mapPin) {
            startY = startY - getPinAdjustment(selections, shape, locationData)
        }

        spiral(dataType, interval, locationData, x, y, mapPin, p5, selections, x, startY, opaque, true, yearIndication, fillMissing, colourTheme)
        // p5.fill(colourTheme.textColour)
        // p5.textSize(10)
        // p5.text("1", x - 2, startY)
    }

    const drawRect = (x, y, locationData) => {
        const daysPerRow = Math.ceil(365 / selections[rectValues.NUM_ROWS])
        const dayWidth = selections[rectValues.DAY_WIDTH]
        const rowWidth = daysPerRow * dayWidth

        const pinHeight = ((selections[rectValues.NUM_ROWS] * (selections[rectValues.SPACE_BETWEEN_ROWS] + selections[rectValues.ROW_HEIGHT])) * locationData.length)
        let startX = x - rowWidth / 2;
        let startY = y - pinHeight / 2
        if (mapPin) {
            startY = y - getPinAdjustment(selections, shape, locationData)
        }

        rectangle(dataType, interval, locationData, x, y, mapPin, p5, selections, startX, startY, opaque, true, yearIndication, fillMissing, colourTheme)

        // p5.textSize(10)
        // if (mapPin) {
        //     p5.fill(colourTheme.pinBackground)
        //     p5.ellipse(x, y + 8, 16, 16)
        //     p5.fill(colourTheme.textColour)
        //     p5.text("1", x, y + 8)
        // } else {
        //     p5.fill(colourTheme.pinBackground)
        //     p5.ellipse(x, y + pinHeight / 2 + 8, 16, 16)
        //     p5.fill(colourTheme.textColour)
        //     p5.text("1", x, y + pinHeight/2 + 8)
        // }
    }

    const drawSpark = (x, y, locationData) => {
        const lineWidth = 365 * selections[sparkValues.DAY_WIDTH]
        const startX = x - lineWidth/2

        spark(dataType, interval, locationData, x, y, mapPin, p5, selections, startX, y, opaque, true, yearIndication, fillMissing, colourTheme)
    }

    const drawRadialSpark = (x, y, locationData) => {
        const locationY = y + getPinAdjustment(selections, shapes.RADIAL_SPARK.id, locationData)
        radialSpark(dataType, interval, locationData, x, locationY, mapPin, p5, selections, x, y, opaque, true, yearIndication, fillMissing, colourTheme)
    }

    const setup = (p5, parent) => {
        setP5(p5)
        p5.createCanvas(canvasSize, canvasSize).parent(parent)
    }

    const draw = (p5) => {
        p5.clear()
        p5.stroke(0)
        p5.fill(colourTheme.background)
        p5.stroke(colourTheme.lineColour)
        p5.rect(0, 0, canvasSize, canvasSize)
        p5.noStroke()
        drawPin(canvasSize / 2, canvasSize / 2, [locations[0].id])
        drawLegend(p5, canvasSize / 2, 1, selections, interval, dataType, null, colourTheme.textColour)
        p5.noLoop()
    }

    return <Sketch draw={draw} setup={setup} />
}

export default Tile