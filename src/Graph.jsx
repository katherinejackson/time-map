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

const numLocations = 20

const Graph = ({ }) => {
    const { selections, shape, theme } = useContext(SelectionContext)
    const { data, dataBrackets, yBrackets, categories, dataType, totalDataPts } = useContext(DataContext)
    const [p5, setP5] = useState(null)
    const [radius, setRadius] = useState(getRadius(selections))
    const { background, lineColour, textColour } = themeColours[theme]
    const [spiralSelections, setSpiralSelections] = useState({ ...selections })
    const [rowSelections, setRowSelections] = useState({ ...selections })
    const [pts, setPts] = useState([])
    const [ids, setIds] = useState([])

    useEffect(() => {
        setUpRandomPts()
    }, [])

    useEffect(() => {
        if (p5) {
            draw(p5)
        }
    }, [shape, theme, spiralSelections])

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
        return (Math.floor(Math.random() * (max - min + 1)) + min);
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

        // simpleGraph(p5)
        edgeGraph(p5)
        // doubleGraph(p5)

        drawLegend(p5, canvasWidth / 2, canvasHeight - 25, selections, null, dataType, dataBrackets, textColour)

        p5.noLoop()
    }

    const setUpPts = () => {
        let x = 50
        let y = 50
        let ids = Object.keys(data).slice(0, numLocations)
        let pts = []

        for (let i = 0; i < ids.length; i++) {
            pts.push({ x, y })

            y = y + 50
            x = x + 300

            if (x > canvasWidth - 50) {
                x = 50
                y = y + 300
            }
        }

        setIds(ids)
        setPts(pts)
    }

    const setUpRandomPts = () => {
        let x;
        let y;
        let ids = Object.keys(data).slice(0, numLocations)
        let pts = []

        for (let i = 0; i < ids.length; i++) {
            let ptFound = false

            while (!ptFound) {
                x = randomInt(50, canvasWidth - 50)
                y = randomInt(50, canvasHeight - 50)
                let tooClose = false
                
                pts.forEach(pt => {
                    let distance = Math.sqrt(Math.pow(Math.abs(pt.x - x), 2) + Math.pow(Math.abs(pt.y - y), 2))
                    if (distance < 100) {
                        tooClose = true
                    }
                })

                if (!tooClose) {
                    ptFound = true
                }
            }

            pts.push({ x, y })
        }

        setIds(ids)
        setPts(pts)
    }

    const edgeGraph = (p5) => {
        p5.noStroke()
        for (let i = 0; i < pts.length - 1; i++) {
            graphRow(p5, pts[i]['x'], pts[i]['y'], pts[i + 1]['x'], pts[i + 1]['y'], data[ids[i]]['cases']['2020'], rowSelections, lineColour)
            // p5.line(pts[i]['x'], pts[i]['y'], pts[i + 1]['x'], pts[i+1]['y'])
            // p5.line(pts[i]['x'], pts[i]['y'], pts[i + 2]['x'], pts[i+2]['y'])
        }



        ids.forEach((id, index) => {
            let x = pts[index]['x']
            let y = pts[index]['y']

            p5.stroke(50)
            p5.fill(255)
            p5.ellipse(x, y, 50, 50)
            p5.noStroke()

            p5.fill(textColour)
            p5.text(data[id]['location'], x, y)
        })



    }

    const doubleGraph = (p5) => {
        p5.noStroke()
        for (let i = 0; i < pts.length - 1; i++) {
            graphRow(p5, pts[i]['x'], pts[i]['y'], pts[i + 1]['x'], pts[i + 1]['y'], data[ids[i]]['cases']['2020'], rowSelections, lineColour)
        }

        ids.forEach((id, index) => {
            let x = pts[index]['x']
            let y = pts[index]['y']
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

            pts.push({ x, y })
        }

        p5.stroke(lineColour)
        for (let i = 0; i < pts.length - 2; i++) {
            p5.line(pts[i]['x'], pts[i]['y'], pts[i + 1]['x'], pts[i + 1]['y'])
            p5.line(pts[i]['x'], pts[i]['y'], pts[i + 2]['x'], pts[i + 2]['y'])
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