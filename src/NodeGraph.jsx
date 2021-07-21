import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from 'react'

import { drawLegend } from "./legend";
import SelectionContext from "./SelectionContext";
import { getGraphRadius, graphSpiral, graphRow } from "./shapes";
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
    const { data, dataBrackets, dataType, variable, average } = useContext(DataContext)
    const worldData = data['World']
    const countryData = {...data}
    delete countryData['World']
    const [p5, setP5] = useState(null)
    const [radius, setRadius] = useState(getGraphRadius(selections, Object.keys(countryData).length))
    const { background, lineColour, textColour, pinBackground } = themeColours[theme]
    const [spiralSelections, setSpiralSelections] = useState({ ...selections })
    const [rowSelections, setRowSelections] = useState({ ...selections })
    const [pts, setPts] = useState([])
    const [ids, setIds] = useState([])


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
            [spiralValues.SPIRAL_WIDTH]: 75,
            [spiralValues.SPACE_BETWEEN_SPIRAL]: 0.75,
            [spiralValues.CORE_SIZE]: 0,
        })

        setRowSelections({
            ...selections,
            [rectValues.NUM_ROWS]: 1,
            [rectValues.ROW_HEIGHT]: 10
        })

        setRadius(getGraphRadius(spiralSelections, Object.keys(countryData).length))
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

        p5.fill(textColour)
        p5.textSize(30)
        p5.text(`Canadian Imports 2010-2019`, canvasWidth/2, 30)
        p5.textSize(12)

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

    const nodeGraph = (p5, pts) => {
        let x;
        let y;

        pts.forEach(pt => {
            x = pt['x']
            y = pt['y']

            // if (countryData[pt['name']]['averages']['tradeBalance'] > 0) {
            //     p5.stroke('green')
            // } else {
            //     p5.stroke('red')
            // }
            p5.stroke(lineColour)
            p5.line(canvasWidth/2, canvasHeight/2, x, y)

            graphSpiral(p5, x, y, countryData[pt['name']]['data'], spiralSelections, dataType, variable, background)

            p5.fill(textColour)
            p5.text(pt['name'], x, y + radius + 5)

        })

        graphSpiral(p5, canvasWidth/2, canvasHeight/2, data['World']['data'], spiralSelections, dataType, 'tradeBalance', background)
        p5.fill(textColour)
        p5.text('Canada World Trade', canvasWidth/2, canvasHeight/2 + radius + 5)
    }

    return <Sketch setup={setup} draw={draw} />
}

export default Graph