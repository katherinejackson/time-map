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
const graphWidth = canvasWidth / 3

const yBorder = 50
const graphHeight = canvasHeight

const Graph = ({ }) => {
    const { selections, shape, theme } = useContext(SelectionContext)
    const { data, dataBrackets, dataType, variable } = useContext(DataContext)
    const [p5, setP5] = useState(null)
    const [radius, setRadius] = useState(getRadius(selections))
    const { background, lineColour, textColour, pinBackground } = themeColours[theme]
    const [spiralSelections, setSpiralSelections] = useState({ ...selections })
    const [rowSelections, setRowSelections] = useState({ ...selections })
    const [pts, setPts] = useState([])
    const [ids, setIds] = useState([])
    const worldData = data['World']
    const countryData = {...data}
    delete countryData['World']

    useEffect(() => {
        setUpCircularPts()
    }, [])

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

    const draw = (p5) => {
        p5.clear()
        p5.background(background)

        nodeGraph(p5, pts)

        drawLegend(p5, canvasWidth / 2, canvasHeight - 25, selections, null, dataType, dataBrackets, textColour)

        p5.noLoop()
    }

    const setUpCircularPts = () => {
        let pts = []
        let startX = canvasWidth / 2
        let startY = canvasHeight / 2

        let angle = -Math.PI / 3
        let radianPerPt = Math.PI * 2 / Object.keys(countryData).length
        let coreSize = 275

        Object.keys(countryData).forEach(pt => {
            let x = startX + Math.cos(angle) * coreSize
            let y = startY + Math.sin(angle) * coreSize
            pts.push({ name: pt, x, y })

            angle += radianPerPt
        })

        setPts(pts)
    }

    // const setUpRandomPts = () => {
    //     let x;
    //     let y;
    //     let ids = Object.keys(data).slice(0, numNodes)
    //     let pts = []

    //     for (let i = 0; i < ids.length; i++) {
    //         let ptFound = false

    //         while (!ptFound) {
    //             x = randomInt(25, graphWidth - 25)
    //             y = randomInt(25, canvasHeight - 50)
    //             let tooClose = false

    //             pts.forEach(pt => {
    //                 let distance = Math.sqrt(Math.pow(Math.abs(pt.x - x), 2) + Math.pow(Math.abs(pt.y - y), 2))
    //                 if (distance < 100) {
    //                     tooClose = true
    //                 }
    //             })

    //             if (!tooClose) {
    //                 ptFound = true
    //             }
    //         }

    //         pts.push({ x, y })
    //     }

    //     setIds(ids)
    //     setPts(pts)
    // }

    const nodeGraph = (p5, pts) => {
        let x;
        let y;

        pts.forEach(pt => {
            x = pt['x']
            y = pt['y']

            p5.stroke(lineColour)
            p5.line(canvasWidth/2, canvasHeight/2, x, y)

            graphSpiral(p5, x, y, countryData[pt['name']]['data'], spiralSelections, dataType, variable)

            p5.fill(textColour)
            p5.text(pt['name'], x, y + radius + 5)

        })

        graphSpiral(p5, canvasWidth/2, canvasHeight/2, data['World']['data'], spiralSelections, dataType, variable)
        p5.fill(textColour)
        p5.text('Canada World Trade', canvasWidth/2, canvasHeight/2 + radius + 5)
    }

    return <Sketch setup={setup} draw={draw} />
}

export default Graph