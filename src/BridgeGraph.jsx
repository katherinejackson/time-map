import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from 'react'

import { drawLegend } from "./legend";
import SelectionContext from "./SelectionContext";
import { getRadius, graphSpiral, bridgeRow } from "./shapes";
import DataContext from "./DataContext";
import { rectValues, spiralValues, themeColours } from "./constants";

const canvasWidth = window.innerWidth * 0.95
const canvasHeight = window.innerHeight

const xBorder = 50
const graphWidth = canvasWidth / 3

const yBorder = 50
const graphHeight = canvasHeight

const edgeLength = 275

const randomInt = (min, max) => {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

const pts = [
    { x: canvasWidth / 2, y: canvasHeight / 2 },
    { x: canvasWidth / 2 + 300, y: canvasHeight / 2 },
    { x: canvasWidth / 2, y: canvasHeight / 2 - 250 },
    { x: canvasWidth / 2, y: canvasHeight / 2 + 250 },
]

const bridges = [
    {id: 1, start: { x: canvasWidth / 2 - 20, y: canvasHeight / 2 }, end: { x: canvasWidth / 2 - 20, y: canvasHeight / 2 - 250 } },
    {id: 2, start: { x: canvasWidth / 2 + 20, y: canvasHeight / 2 }, end: { x: canvasWidth / 2 + 20, y: canvasHeight / 2 - 250 } },
    {id: 3, start: { x: canvasWidth / 2 - 20, y: canvasHeight / 2 }, end: { x: canvasWidth / 2 - 20, y: canvasHeight / 2 + 250 } },
    {id: 4, start: { x: canvasWidth / 2 + 20, y: canvasHeight / 2 }, end: { x: canvasWidth / 2 + 20, y: canvasHeight / 2 + 250 } },
    {id: 5, start: pts[0], end: pts[1] },
    {id: 6, start: pts[3], end: pts[1] },
    {id: 7, start: pts[2], end: pts[1] },
]

const generateData = () => {
    let data = []

    for (let l = 0; l < 7; l++) {
        let lData = []
        for (let i = 0; i < 5; i++) {
            lData.push(randomInt(0, 20))
        }
    
        for (let i = 5; i < 7; i++) {
            lData.push(randomInt(20, 100))
        }
    
        for (let i = 7; i < 10; i++) {
            lData.push(randomInt(100, 200))
        }
    
        for (let i = 10; i < 15; i++) {
            lData.push(randomInt(200, 300))
        }
    
        for (let i = 15; i < 19; i++) {
            lData.push(randomInt(100, 200))
        }
    
        for (let i = 19; i < 21; i++) {
            lData.push(randomInt(50, 100))
        }
    
        for (let i = 21; i < 24; i++) {
            lData.push(randomInt(0, 50))
        }

        data.push(lData)
    }
    
    return data
}

const BridgeGraph = ({ }) => {
    const { selections, shape, theme } = useContext(SelectionContext)
    const [p5, setP5] = useState(null)
    const [radius, setRadius] = useState(getRadius(selections))
    const { background, lineColour, textColour, pinBackground } = themeColours[theme]
    const [spiralSelections, setSpiralSelections] = useState({ ...selections })
    const [rowSelections, setRowSelections] = useState({ ...selections })
    const data = generateData()

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
            [rectValues.ROW_HEIGHT]: 10,
            [rectValues.NUM_COLOURS]: 6,
        })

        setRadius(getRadius(spiralSelections))
    }, [selections])

    const setup = (p5, parent) => {
        setP5(p5)
        p5.createCanvas(canvasWidth, canvasHeight).parent(parent)
        p5.textAlign(p5.CENTER, p5.CENTER)
    }

    const draw = (p5) => {
        p5.clear()
        p5.background(background)

        p5.fill(textColour)
        p5.textSize(30)
        p5.text(`Hourly Foot Traffic on the 7 Bridges`, canvasWidth / 2, 50)
        p5.textSize(12)

        edgeGraph(p5, pts)

        drawLegend(p5, canvasWidth / 2, canvasHeight - 25, rowSelections, null, 'BRIDGE', null, textColour)

        p5.noLoop()
    }

    const edgeGraph = (p5, pts) => {
        let nodeDiameter = 60
        p5.noStroke()

        bridges.forEach((bridge, index) => {
            let startX = bridge.start.x
            let startY = bridge.start.y
            let endX = bridge.end.x
            let endY = bridge.end.y
            let angle = Math.atan(Math.abs(startX - endX)/Math.abs(startY - endY))
            console.log(angle)

            let x1 = startX + Math.cos(angle) * nodeDiameter/2
            let y1 = startY + Math.sin(angle) * nodeDiameter/2

            p5.stroke(50)
            // p5.line(startX, startX, endY)

            bridgeRow(p5, startX, startY, endX, endY, data[index])
        })

        pts.forEach((pt, index) => {
            // p5.noFill()
            p5.fill(pinBackground)
            p5.ellipse(pt.x, pt.y, nodeDiameter, nodeDiameter)
            // p5.noStroke()
        })

    }

    return <Sketch setup={setup} draw={draw} />
}

export default BridgeGraph