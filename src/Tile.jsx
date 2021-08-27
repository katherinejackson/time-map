import Sketch from "react-p5";
import React, { useEffect, useState, useContext } from "react";

import { shapes, themeColours } from './constants'
import { getInterval } from "./helpers/intervals";
import { row, spiral} from "./shapes";
import { drawLegend } from "./legend";
import DataContext from "./DataContext";
import { getLocationData } from "./helpers/data";


const Tile = ({ encoding, numX, selections, shape}) => {
    const { locations, data, dataBrackets, dataType } = useContext(DataContext)
    const { theme } = selections
    const colourTheme = themeColours[theme]
    const interval = getInterval(dataBrackets, selections.numColours)
    const [p5, setP5] = useState(null)
    // const canvasSize = window.innerWidth * 0.95 / numX
    const canvasSize = 150

    useEffect(() => {
        if (p5) {
            draw(p5)
        }

    }, [selections, p5])

    const drawPin = (x, y, id) => {
        let locationData = getLocationData(id, selections, data)

        if (shape === shapes.SPIRAL.id) {
            spiral(p5, dataType, interval, locationData, x, y, selections, encoding, 1)
        } else if (shape === shapes.ROW.id) {
            row(p5, dataType, interval, locationData, x, y, selections, encoding, 1)
        } 
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
        drawPin(canvasSize / 2, canvasSize / 2, [0])

        p5.noLoop()
    }

    return <Sketch draw={draw} setup={setup} />
}

export default Tile