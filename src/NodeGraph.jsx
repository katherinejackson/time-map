import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from 'react'

import { drawGraphLegend } from "./legend";
import { getGraphRadius, graphSpiral } from "./shapes";
import DataContext from "./DataContext";
import { shapes, themeColours } from "./constants";
import { getDefaultSelections } from "./helpers/selections";

const canvasWidth = window.innerWidth * 0.95
const canvasHeight = window.innerHeight

const Graph = () => {
    const [p5, setP5] = useState(null)
    const { background, lineColour, textColour } = themeColours['DEFAULT']
    const spiralSelections = { ...getDefaultSelections(shapes.SPIRAL.id), ['numColours']: 7,  ['spiralWidth']: 80 }
    const { data, dataType, variable } = useContext(DataContext)
    const [pts, setPts] = useState([])
    const countryData = { ...data }
    delete countryData['World']
    const [radius] = useState(getGraphRadius(spiralSelections, Object.keys(countryData).length))

    useEffect(() => {
        setUpCircularPts()
    }, [])

    useEffect(() => {
        if (p5) {
            draw(p5)
        }
    }, [pts])

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
        p5.text(`Canadian Imports 2010-2019`, canvasWidth / 2, 30)
        p5.textSize(12)

        nodeGraph(p5, pts)

        drawGraphLegend(p5, canvasWidth / 2, canvasHeight - 25, spiralSelections, dataType, textColour)

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

    const nodeGraph = (p5, pts) => {
        let x;
        let y;

        pts.forEach(pt => {
            x = pt['x']
            y = pt['y']

            p5.stroke(lineColour)
            p5.line(canvasWidth / 2, canvasHeight / 2, x, y)

            graphSpiral(p5, x, y, countryData[pt['name']]['data'], spiralSelections, dataType, variable, background)

            p5.fill(textColour)
            p5.textSize(10)
            p5.text(pt['name'], x, y + radius + 5)

        })

        graphSpiral(p5, canvasWidth / 2, canvasHeight / 2, data['World']['data'], spiralSelections, dataType, 'tradeBalance', background)
        p5.fill(textColour)
        p5.textSize(10)
        p5.text('Canada World Trade', canvasWidth / 2, canvasHeight / 2 + radius + 5)
    }

    return <Sketch setup={setup} draw={draw} />
}

export default Graph