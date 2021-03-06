import Sketch from "react-p5";
import React, { useEffect, useState } from 'react'

import { drawGraphLegend } from "./legend";
import { bridgeRow } from "./shapes";
import { shapes, themeColours } from "./constants";
import { getDefaultSelections } from "./helpers/selections";

const canvasWidth = window.innerWidth * 0.95
const canvasHeight = window.innerHeight

const randomInt = (min, max) => {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

const nodeDistance = 250

const pts = [
    { id: 'A', x: canvasWidth / 2 - nodeDistance/2, y: canvasHeight / 2 },
    { id: 'D', x: canvasWidth / 2 + nodeDistance/2, y: canvasHeight / 2 },
    { id: 'B', x: canvasWidth / 2 - nodeDistance/2, y: canvasHeight / 2 - nodeDistance },
    { id: 'C', x: canvasWidth / 2 - nodeDistance/2, y: canvasHeight / 2 + nodeDistance },
]

const bridges = [
    {id: 1, start: { x: canvasWidth / 2 - nodeDistance/2 - 20, y: canvasHeight / 2 }, end: { x: canvasWidth / 2 - nodeDistance/2 - 20, y: canvasHeight / 2 - 250 } },
    {id: 2, start: { x: canvasWidth / 2 - nodeDistance/2 + 20, y: canvasHeight / 2 }, end: { x: canvasWidth / 2 - nodeDistance/2 + 20, y: canvasHeight / 2 - 250 } },
    {id: 3, start: { x: canvasWidth / 2 - nodeDistance/2 - 20, y: canvasHeight / 2 }, end: { x: canvasWidth / 2 - nodeDistance/2 - 20, y: canvasHeight / 2 + 250 } },
    {id: 4, start: { x: canvasWidth / 2 - nodeDistance/2 + 20, y: canvasHeight / 2 }, end: { x: canvasWidth / 2 - nodeDistance/2 + 20, y: canvasHeight / 2 + 250 } },
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
            lData.push(randomInt(200, 400))
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

const BridgeGraph = () => {
    const [p5, setP5] = useState(null)
    const { background, textColour, pinBackground } = themeColours['DEFAULT']
    const data = generateData()
    const selections = getDefaultSelections(shapes.ROW.id)

    useEffect(() => {
        if (p5) {
            draw(p5)
        }
    }, [])

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

        drawGraphLegend(p5, canvasWidth/2, canvasHeight - 25, selections, 'BRIDGE', textColour)

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

            bridgeRow(p5, startX, startY, endX, endY, data[index])
        })

        pts.forEach((pt) => {
            p5.fill(pinBackground)
            p5.ellipse(pt.x, pt.y, nodeDiameter, nodeDiameter)
            p5.fill(textColour)
            p5.text(pt.id, pt.x, pt.y)
        })

    }

    return <Sketch setup={setup} draw={draw} />
}

export default BridgeGraph