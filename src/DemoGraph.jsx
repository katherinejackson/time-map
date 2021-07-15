import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from 'react'

import { drawLegend } from "./legend";
import SelectionContext from "./SelectionContext";
import { getRadius, graphSpiral, graphRow } from "./shapes";
import DataContext from "./DataContext";
import { rectValues, spiralValues, themeColours } from "./constants";

const canvasWidth = window.innerWidth * 0.95
const canvasHeight = window.innerHeight

const xBorder = 50
const graphWidth = canvasWidth/3

const yBorder = 50
const graphHeight = canvasHeight

const DemoGraph = ({ }) => {
    const { selections, shape, theme } = useContext(SelectionContext)
    const { data, dataBrackets, dataType } = useContext(DataContext)
    const [p5, setP5] = useState(null)
    const [radius, setRadius] = useState(getRadius(selections))
    const { background, lineColour, textColour, pinBackground } = themeColours[theme]
    const [spiralSelections, setSpiralSelections] = useState({ ...selections })
    const [rowSelections, setRowSelections] = useState({ ...selections })
    const [pts, setPts] = useState([])
    const [ids, setIds] = useState([])
    const [numNodes, setNumNodes] = useState(5)
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    

    useEffect(() => {
        setUpRandomPts()
    }, [numNodes])

    useEffect(() => {
        if (p5) {
            draw(p5)
        }
    }, [shape, theme, spiralSelections, pts])

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

        nodeGraph(p5, pts)

        p5.stroke(lineColour)
        p5.line(graphWidth, 0, graphWidth, canvasHeight)
        p5.noStroke()

        let newPts = []
        pts.forEach(pt => newPts.push({...pt, ['x']: pt.x + graphWidth}))
        edgeGraph(p5, newPts)

        p5.stroke(lineColour)
        p5.line(graphWidth * 2, 0, graphWidth * 2, canvasHeight)
        p5.noStroke()

        newPts = []
        pts.forEach(pt => newPts.push({...pt, ['x']: pt.x + graphWidth * 2}))
        doubleGraph(p5, newPts)

        drawLegend(p5, canvasWidth / 2, canvasHeight - 25, selections, null, dataType, dataBrackets, textColour)

        p5.noLoop()
    }

    const setUpPts = () => {
        let x = 50
        let y = 50
        let ids = Object.keys(data).slice(0, numNodes)
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
        let ids = Object.keys(data).slice(0, numNodes)
        let pts = []

        for (let i = 0; i < ids.length; i++) {
            let ptFound = false

            while (!ptFound) {
                x = randomInt(25, graphWidth - 25)
                y = randomInt(25, canvasHeight - 50)
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

    const edgeGraph = (p5, pts) => {
        p5.noStroke()
        for (let i = 0; i < pts.length - 1; i++) {
            graphRow(p5, pts[i]['x'], pts[i]['y'], pts[i + 1]['x'], pts[i + 1]['y'], data[ids[i]]['cases']['2020'], rowSelections, lineColour)
        }

        ids.forEach((id, index) => {
            let x = pts[index]['x']
            let y = pts[index]['y']

            p5.stroke(textColour)
            p5.fill(pinBackground)
            p5.ellipse(x, y, 50, 50)
            p5.noStroke()

            p5.fill(textColour)
            p5.text(data[id]['location'], x, y)
        })

    }

    const doubleGraph = (p5, pts) => {
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

    const nodeGraph = (p5, pts) => {
        let x;
        let y;

        p5.stroke(lineColour)
        for (let i = 0; i < pts.length - 1; i++) {
            p5.line(pts[i]['x'], pts[i]['y'], pts[i + 1]['x'], pts[i + 1]['y'])
        }
        p5.noStroke()

        ids.forEach((id, index) => {
            x = pts[index]['x']
            y = pts[index]['y']
            drawPt(p5, data[id], x, y)
        })
    }

    const handleNumNodeSelect = (e) => {
        setNumNodes(e.target.value)
    }

    return (
        <div>
            <div className="row mb-2">
                <div className="col d-flex justify-content-end">
                    <label htmlFor="y-axis" className="col-form-label w-auto">Number of Nodes</label>
                </div>
                <div className="col">
                    <select className="form-select" defaultValue={numNodes} id='y-axis' onChange={handleNumNodeSelect} name='numNodes'>
                        {nums.map(num => (<option key={`num-nodes-${num}`} value={num}>{num}</option>))}
                    </select>
                </div>
            </div>
            <Sketch setup={setup} draw={draw} />
        </div>
    )
}

export default DemoGraph