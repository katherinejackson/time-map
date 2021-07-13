import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from 'react'

import { drawLegend } from "./legend";
import SelectionContext from "./SelectionContext";
import { getRadius, scatterSpiral, scatterRow } from "./shapes";
import DataContext from "./DataContext";
import { shapes, spiralValues, themeColours, themes } from "./constants";
import { formatPopulation } from "./helpers/numbers"

const canvasWidth = window.innerWidth * 0.95
const canvasHeight = window.innerHeight

const xBorder = 50
const graphWidth = canvasWidth - xBorder * 2

const yBorder = 50
const graphHeight = canvasHeight - yBorder * 2

const clickTolerance = 5

const ScatterPlot = ({ }) => {
    const { selections, shape, theme } = useContext(SelectionContext)
    const { data, dataBrackets, yBrackets, categories, dataType, totalDataPts } = useContext(DataContext)
    const [p5, setP5] = useState(null)
    const [spacePerPt, setSpacePerPoint] = useState((graphWidth - getRadius(selections, selections[spiralValues.NUM_YEARS]) * 2) / totalDataPts)
    const [pts, setPts] = useState({})
    const [detailed, setDetailed] = useState(null)
    const [radius, setRadius] = useState(getRadius(selections))
    const colourTheme = themeColours[theme]

    useEffect(() => {
        if (shape === shapes.SPIRAL.id) {
            setRadius(getRadius(selections))
        }

        if (p5) {
            draw(p5)
        }
    }, [selections, shape, theme])

    useEffect(() => {
        if (detailed && p5) {
            drawDetailed(p5)
        }
    }, [detailed])

    useEffect(() => {
        setSpacePerPoint((graphWidth - radius * 2) / totalDataPts)
    }, [totalDataPts])


    const calcCategories = () => {
        let xCounters = {}
        let walker = xBorder + radius

        Object.keys(categories).forEach(cat => {
            let numInCategory = categories[cat]
            xCounters[cat] = walker
            walker += spacePerPt * numInCategory
        })

        return xCounters
    }

    const setup = (p5, parent) => {
        setP5(p5)
        p5.createCanvas(canvasWidth, canvasHeight).parent(parent)
        p5.textAlign(p5.CENTER, p5.CENTER)
    }

    const drawPt = (p5, entry, x, y) => {
        let data = entry['cases']['2020']
        if (selections[spiralValues.NUM_YEARS] === 2) {
            data = data.concat(entry['cases']['2021'])
        }

        if (shape === shapes.SPIRAL.id) {
            scatterSpiral(p5, x, y, data, selections, dataType)
        } else {
            scatterRow(p5, x, y, data, selections, dataType)
        }
    }


    const drawDetailed = (p5) => {
        let currentWidth = selections[spiralValues.SPIRAL_WIDTH]
        let newSelections = { ...selections, [spiralValues.SPIRAL_WIDTH]: currentWidth + 20 }
        let newRadius = getRadius(newSelections, newSelections[spiralValues.NUM_YEARS])
        let detailedData = data[detailed.id]['cases']['2020']

        if (selections[spiralValues.NUM_YEARS] === 2) {
            detailedData = detailedData.concat(data[detailed.id]['cases']['2021'])
        }

        p5.fill(255)
        p5.ellipse(detailed.x, detailed.y, newRadius, newRadius)
        scatterSpiral(p5, detailed.x, detailed.y, detailedData, newSelections, dataType)
        p5.fill(colourTheme.textColour)
        p5.text(pts[detailed.id]['name'], detailed.x, detailed.y + newRadius + 5)
    }

    const draw = (p5) => {
        p5.clear()
        p5.background(colourTheme.background)
        p5.stroke(colourTheme.lineColour)
        p5.line(xBorder, yBorder, xBorder, canvasHeight - yBorder)
        p5.line(xBorder, canvasHeight - yBorder, canvasWidth - xBorder, canvasHeight - yBorder)

        let xCounters = calcCategories()
        Object.keys(categories).forEach(cat => {
            if (xCounters[cat] > xBorder + getRadius(selections, selections[spiralValues.NUM_YEARS])) {
                p5.stroke(50)
                p5.line(
                    xCounters[cat] - spacePerPt / 2,
                    canvasHeight - yBorder,
                    xCounters[cat] - spacePerPt / 2,
                    yBorder)
            }

            p5.noStroke()
            p5.fill(colourTheme.textColour)
            p5.text(cat, xCounters[cat] + (spacePerPt * categories[cat]) / 2, canvasHeight - 40)
        })

        drawYAxis(p5)

        let newPts = {}
        Object.keys(data).forEach(id => {
            let x = xCounters[data[id]['continent']]
            let y = calcY(id)

            drawPt(p5, data[id], x, y)
            xCounters[data[id]['continent']] = xCounters[data[id]['continent']] + spacePerPt
            newPts[id] = {
                'name': data[id]['location'],
                x,
                y,
            }
        })

        setPts(newPts)

        drawLegend(p5, canvasWidth / 2, canvasHeight - 25, selections, null, dataType, dataBrackets, colourTheme.textColour)

        p5.noLoop()
    }

    const calcY = (id) => {
        const bottom = canvasHeight - yBorder - radius
        const graphRange = graphHeight - radius * 2
        let logLow = Math.floor(Math.log2(yBrackets.low))
        let logHigh = Math.ceil(Math.log2(yBrackets.high))
        let logRange = logHigh - logLow

        return bottom - ((Math.log2(data[id]['population']) - logLow) * graphRange / logRange)
    }

    const drawYAxis = (p5) => {
        let logLow = Math.floor(Math.log2(yBrackets.low))
        let logHigh = Math.ceil(Math.log2(yBrackets.high))
        let numSteps = logHigh - logLow
        let spacePer = graphHeight / numSteps
        p5.fill(colourTheme.textColour)

        let yWalker = canvasHeight - yBorder
        for (let i = 0; i < numSteps; i = i + 1) {
            p5.textAlign(p5.RIGHT, p5.CENTER)
            p5.text(formatPopulation(Math.pow(2, i + logLow)), xBorder - 2, yWalker)
            yWalker = yWalker - spacePer
        }
    }

    const mouseClicked = () => {
        let ptFound = null
        let distance = null

        Object.keys(pts).forEach(id => {
            if (Math.abs(pts[id]['x'] - p5.mouseX) < radius + clickTolerance && Math.abs(pts[id]['y'] - p5.mouseY) < radius + clickTolerance) {
                let newDistance = Math.pow(pts[id]['x'] - p5.mouseX, 2) + Math.pow(pts[id]['y'] - p5.mouseY, 2)

                if ((!distance || newDistance < distance) && detailed?.id !== id) {
                    distance = Math.pow(pts[id]['x'] - p5.mouseX, 2) + Math.pow(pts[id]['y'] - p5.mouseY, 2)
                }

                ptFound = { id, x: pts[id]['x'], y: pts[id]['y'] }
            }
        })

        setDetailed(ptFound)
    }

    return <Sketch setup={setup} draw={draw} mouseClicked={mouseClicked} />
}

export default ScatterPlot