import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from 'react'

import { drawLegend } from "./legend";
import SelectionContext from "./SelectionContext";
import { getRadius, graphSpiral, graphRow } from "./shapes";
import DataContext from "./DataContext";
import { rectValues, shapes, spiralValues, themeColours } from "./constants";

const canvasWidth = window.innerWidth * 0.95
const canvasHeight = window.innerHeight

const xBorder = 50
const graphWidth = canvasWidth - xBorder * 2

const yBorder = 50
const graphHeight = canvasHeight - yBorder * 2

const Graph = ({ }) => {
    const { selections, shape, theme } = useContext(SelectionContext)
    const { data, dataBrackets, yBrackets, categories, dataType, totalDataPts } = useContext(DataContext)
    const [p5, setP5] = useState(null)
    const [radius, setRadius] = useState(getRadius(selections))
    const { background, lineColour, textColour } = themeColours[theme]
    const [spiralSelections, setSpiralSelections] = useState({ ...selections })
    const [rowSelections, setRowSelections] = useState({ ...selections })

    useEffect(() => {
        if (p5) {
            draw(p5)
        }
    }, [shape, theme])

    useEffect(() => {
        setSpiralSelections({
            ...selections,
            [spiralValues.SPIRAL_WIDTH]: 30,
            [spiralValues.SPACE_BETWEEN_SPIRAL]: 0,
            [spiralValues.CORE_SIZE]: 4
        })

        setRowSelections({
            ...selections,
            [rectValues.NUM_ROWS]: 1,
            [rectValues.ROW_HEIGHT]: 10
        })

        setRadius(getRadius(spiralSelections))
    }, [selections])

    const randomInt = (min, max) => {
        return( Math.floor(Math.random() * (max - min + 1) ) + min );
      }


    const setup = (p5, parent) => {
        setP5(p5)
        p5.createCanvas(canvasWidth, canvasHeight).parent(parent)
        p5.textAlign(p5.CENTER, p5.CENTER)
    }

    const drawPt = (p5, entry, x, y) => {
        let data = entry['cases']['2020']
        if (spiralSelections[spiralValues.NUM_YEARS] === 2) {
            data = data.concat(entry['cases']['2021'])
        }

        graphSpiral(p5, x, y, data, spiralSelections, dataType)
        p5.fill(textColour)
        p5.text(entry['location'], x, y + radius + 5)
    }

    const draw = (p5) => {
        p5.clear()
        p5.background(background)

        simpleGraph(p5)
        // edgeGraph(p5)

        drawLegend(p5, canvasWidth / 2, canvasHeight - 25, selections, null, dataType, dataBrackets, textColour)

        p5.noLoop()
    }

    const edgeGraph = (p5) => {
        let x;
        let y;
        let pts = []
        let ids = Object.keys(data).slice(0, 5)

        for (let i = 0; i < ids.length; i++) {
            x = randomInt(50, canvasWidth - 50)
            y = randomInt(50, canvasHeight - 50)

            pts.push({x, y})
        }

        p5.stroke(lineColour)
        for (let i = 0; i < pts.length - 1; i++) {
            graphRow(p5, pts[i]['x'], pts[i]['y'], pts[i + 1]['x'], pts[i+1]['y'], data[ids[i]], rowSelections, lineColour)
            // p5.line(pts[i]['x'], pts[i]['y'], pts[i + 1]['x'], pts[i+1]['y'])
            // p5.line(pts[i]['x'], pts[i]['y'], pts[i + 2]['x'], pts[i+2]['y'])
        }
        p5.noStroke()


        ids.forEach((id, index) => {
            x = pts[index]['x']
            y = pts[index]['y']
            drawPt(p5, data[id], x, y)
        })
    }

    const simpleGraph = (p5) => {
        let x;
        let y;
        let pts = []
        let ids = Object.keys(data).slice(0, 5)

        for (let i = 0; i < ids.length; i++) {
            x = randomInt(50, canvasWidth - 50)
            y = randomInt(50, canvasHeight - 50)

            pts.push({x, y})
        }

        p5.stroke(lineColour)
        for (let i = 0; i < pts.length - 2; i++) {
            p5.line(pts[i]['x'], pts[i]['y'], pts[i + 1]['x'], pts[i+1]['y'])
            p5.line(pts[i]['x'], pts[i]['y'], pts[i + 2]['x'], pts[i+2]['y'])
        }
        p5.noStroke()

        ids.forEach((id, index) => {
            x = pts[index]['x']
            y = pts[index]['y']
            drawPt(p5, data[id], x, y)
        })
    }

    return <Sketch setup={setup} draw={draw} />
}

export default Graph