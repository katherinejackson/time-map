import Sketch from "react-p5";
import React, { useEffect, useState, useContext } from "react";

import { shapes } from './constants'
import { getInterval } from "./helpers/intervals";
import { row, spiral, getPinAdjustment} from "./shapes";
import { drawLegend } from "./legend";
import DataContext from "./DataContext";
import { getLocationData } from "./helpers/data";


const Tile = ({ encoding, numX, selections, shape}) => {
    const { locations, data, dataBrackets, dataType } = useContext(DataContext)
    const { mapPin, theme } = selections
    const interval = getInterval(dataBrackets, selections.numColours)
    const [p5, setP5] = useState(null)
    const canvasSize = window.innerWidth * 0.95 / numX

    useEffect(() => {
        if (p5) {
            draw(p5)
        }

    }, [selections, p5, theme])

    const drawPin = (x, y, id) => {
        let locationData = getLocationData(id, selections, data)

        if (shape === shapes.SPIRAL.id) {
            drawSpiral(x, y, locationData)
        } else if (shape === shapes.ROW.id) {
            drawRect(x, y, locationData)
        } 
    }

    const drawSpiral = (x, y, locationData) => {
        let startY = y
        if (mapPin) {
            startY = startY - getPinAdjustment(selections, shape, locationData)
        }

        spiral(p5, dataType, interval, locationData, x, y, x, startY, selections, encoding)
    }

    const drawRect = (x, y, locationData) => {
        const daysPerRow = 365
        const dayWidth = selections.dayWidth
        const rowWidth = daysPerRow * dayWidth

        const pinHeight = (selections.spaceBetween + selections.rowHeight) * locationData.length
        let startX = x - rowWidth / 2;
        let startY = y - pinHeight / 2
        if (mapPin) {
            startY = y - getPinAdjustment(selections, shape, locationData)
        }

        row(p5, dataType, interval, locationData, x, y, startX, startY, selections, encoding)
    }

    const setup = (p5, parent) => {
        setP5(p5)
        p5.createCanvas(canvasSize, canvasSize).parent(parent)
    }

    const draw = (p5) => {
        p5.clear()
        p5.stroke(0)
        p5.fill(theme.background)
        p5.stroke(theme.lineColour)
        p5.rect(0, 0, canvasSize, canvasSize)
        p5.noStroke()
        drawPin(canvasSize / 2, canvasSize / 2, [locations[0].id])

        if (encoding !== 1) {
            drawLegend(p5, canvasSize / 2, 1, selections, interval, dataType, null, theme.textColour)
        }

        p5.noLoop()
    }

    return <Sketch draw={draw} setup={setup} />
}

export default Tile