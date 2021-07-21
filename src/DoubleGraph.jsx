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

const edgeLength = 200

const DoubleGraph = ({ }) => {
    const { selections, shape, theme } = useContext(SelectionContext)
    const { data, dataBrackets, dataType, variable } = useContext(DataContext)
    const [p5, setP5] = useState(null)
    const [radius, setRadius] = useState(getRadius(selections))
    const { background, lineColour, textColour, pinBackground } = themeColours[theme]
    const [spiralSelections, setSpiralSelections] = useState({ ...selections })
    const [rowSelections, setRowSelections] = useState({ ...selections })
    const [pts, setPts] = useState([])
    const [ids, setIds] = useState([])
    const [numNodes, setNumNodes] = useState(5)
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    const worldData = data['World']
    const countryData = {...data}
    delete countryData['World']
    

    useEffect(() => {
        setUpCircularPts()
    }, [numNodes])

    useEffect(() => {
        if (p5) {
            draw(p5)
        }
    }, [shape, theme, spiralSelections, pts])

    useEffect(() => {
        setSpiralSelections({
            ...selections,
            [spiralValues.SPIRAL_WIDTH]: 85,
            [spiralValues.SPACE_BETWEEN_SPIRAL]: 0.75,
            [spiralValues.CORE_SIZE]: 3,
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

        p5.fill(textColour)
        p5.textSize(30)
        p5.text(`Canadian Imports/Exports 2010-2019`, canvasWidth/2, 25)

        edgeGraph(p5, pts)
        
        drawLegend(p5, canvasWidth / 2, canvasHeight - 25, selections, null, dataType, dataBrackets, textColour)

        p5.noLoop()
    }

    const setUpCircularPts = () => {
        let pts = []
        let startX = canvasWidth/2
        let startY  = canvasHeight/2

        let angle = -Math.PI /3
        let radianPerPt = Math.PI * 2 / Object.keys(countryData).length
        let coreSize = edgeLength

        Object.keys(countryData).forEach(pt => {
            let x = startX + Math.cos(angle) * coreSize
            let y = startY + Math.sin(angle) * coreSize
            pts.push({name: pt, x, y})

            angle += radianPerPt
        })

        setPts(pts)
    }

    const setUpRandomPts = () => {
        let x;
        let y;
        let ids = Object.keys(countryData).slice(0, numNodes)
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
        let nodeDiameter = 100
        p5.noStroke()
        console.log(radius)

        let startX = canvasWidth/2
        let startY = canvasHeight/2
        let angle = -Math.PI /3
        let coreSize = radius
        let radianPer = Math.PI * 2 / pts.length

        pts.forEach(pt => {
            let x = startX + Math.cos(angle) * nodeDiameter/2
            let y = startY + Math.sin(angle) * nodeDiameter/2
            graphRow(p5, x, y, pt['x'], pt['y'], countryData[pt['name']]['data'], rowSelections, variable, dataBrackets, pt['name'])
            angle += radianPer
        })

        graphSpiral(p5, canvasWidth/2, canvasHeight/2, data['World']['data'], spiralSelections, dataType, 'tradeBalance', background)
        p5.fill(textColour)
        p5.text('Canada', canvasWidth/2, canvasHeight/2)

        pts.forEach((pt, index) => {
            let x = startX + Math.cos(angle) * (nodeDiameter/2 + edgeLength)
            let y = startY + Math.sin(angle) * (nodeDiameter/2 + edgeLength)
            let name = pt['name']

            graphSpiral(p5, x, y, countryData[pt['name']]['data'], spiralSelections, dataType, 'tradeBalance', background)

            // p5.stroke(textColour)
            // p5.fill(pinBackground)
            // p5.ellipse(x, y, nodeDiameter, nodeDiameter)
            // p5.noStroke()

            p5.fill(textColour)
            p5.textSize(8)
            p5.text(name, x, y)

            angle += radianPer
        })

    }

    return <Sketch setup={setup} draw={draw} />
}

export default DoubleGraph