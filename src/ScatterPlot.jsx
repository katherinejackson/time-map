import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from 'react'

import { drawLegend } from "./legend";
import SelectionContext from "./SelectionContext";
import { scatterSpiral, scatterRow } from "./shapes";
import DataContext from "./DataContext";
import { shapes, spiralValues, themeColours } from "./constants";
import { formatNumbers } from "./helpers/format"
import {getMinDistance} from "./helpers/cluster"

const canvasWidth = 1000
const canvasHeight = window.innerHeight

const xBorder = 50
const graphWidth = canvasWidth - xBorder * 2

const yBorder = 50
const graphHeight = canvasHeight - yBorder * 2

const hoverTolerance = 5

const ScatterPlot = ({ }) => {
    const { selections, shape, theme } = useContext(SelectionContext)
    const { data, dataBrackets, yBrackets, categories, dataType, totalDataPts } = useContext(DataContext)
    const [p5, setP5] = useState(null)
    const { minDistanceX, minDistanceY } = getMinDistance(selections, shape)
    const [spacePerPt, setSpacePerPoint] = useState((graphWidth - minDistanceX * 2) / totalDataPts)
    const [pts, setPts] = useState({})
    const colourTheme = themeColours[theme]
    const [hover, setHover] = useState(null)

    useEffect(() => {
        if (p5) {
            let newPts = {}
            let xCounters = calcCategories()

            Object.keys(data).forEach(id => {
                let x = xCounters[data[id]['continent']]
                let y = calcY(id)

                const { pg, width, height } = getGlyph(id)
                xCounters[data[id]['continent']] = xCounters[data[id]['continent']] + spacePerPt
                newPts[id] = {
                    name: data[id]['location'],
                    x,
                    y,
                    pg,
                    width,
                    height,
                }
            })

            setPts(newPts)
            setSpacePerPoint((graphWidth - minDistanceX * 2) / totalDataPts)
        }
    }, [p5])

    useEffect(() => {
        if (p5) {
            draw(p5)
        }
    }, [selections, shape, theme, pts, hover])

    const calcCategories = () => {
        let xCounters = {}
        let walker = xBorder + minDistanceX

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

    const draw = (p5) => {
        p5.clear()
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.background(colourTheme.background)
        p5.stroke(colourTheme.lineColour)
        p5.line(xBorder, yBorder, xBorder, canvasHeight - yBorder)
        p5.line(xBorder, canvasHeight - yBorder, canvasWidth - xBorder, canvasHeight - yBorder)

        let xCounters = calcCategories()
        Object.keys(categories).forEach(cat => {
            if (xCounters[cat] > xBorder + minDistanceX) {
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
        drawLegend(p5, canvasWidth / 2, canvasHeight - 25, selections, null, dataType, dataBrackets, colourTheme.textColour)
        drawGlyphs()

        p5.noLoop()
    }

    const getGlyph = (id) => {
        let width = 500
        let height = 500

        let pg = p5.createGraphics(width, height)
        pg.clear()
        pg.noStroke()

        let ptData = data[id]['cases']['2020']
        if (selections[spiralValues.NUM_YEARS] === 2) {
            ptData = ptData.concat(data[id]['cases']['2021'])
        }

        if (shape === shapes.SPIRAL.id) {
            scatterSpiral(pg, width / 2, height / 2, ptData, selections, dataType)
        } else if (shape === shapes.RECT.id) {
            scatterRow(pg, width / 2 - minDistanceX/2, height / 2 - minDistanceY/2, ptData, selections, dataType)
        }

        return { pg, width, height }
    }

    const drawGlyphs = () => {
        Object.keys(pts).forEach((id) => {
            let pt = pts[id]
            if (id !== hover) {
                p5.image(pt.pg, pt.x - pt.width / 2, pt.y - pt.height / 2)
            }
        })

        if (hover !== null) {
            const { minDistanceX, minDistanceY } = getMinDistance(selections, shape)
            const pin = pts[hover]
            const hoverpg = p5.createGraphics(pin.width, pin.height)
            hoverpg.image(pin.pg, 0, 0, pin.width * 1.5, pin.height * 1.5)

            p5.fill(colourTheme.pinBackground, 150)
            if (shape === shapes.SPIRAL.id) {
                p5.ellipse(pin.x, pin.y, minDistanceX * 3, minDistanceY * 3)
            } else if (shape === shapes.RECT.id) {
                p5.rect(pin.x - minDistanceX, pin.y - minDistanceY, minDistanceX * 2, minDistanceY * 3)
            }
            p5.image(hoverpg, pin.x - pin.width * 0.75, pin.y - pin.height * 0.75)

            p5.textAlign(p5.CENTER, p5.TOP)
            p5.fill(colourTheme.textColour)
            p5.text(pin.name, pin.x, pin.y + minDistanceY)
        }
    }

    const calcY = (id) => {
        const bottom = canvasHeight - yBorder - minDistanceY
        const graphRange = graphHeight - minDistanceY * 2
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
            p5.text(formatNumbers(Math.pow(2, i + logLow)), xBorder - 2, yWalker)
            yWalker = yWalker - spacePer
        }
    }

    const mouseMoved = () => {
        let ptFound = null
        let distance = null

        Object.keys(pts).forEach(id => {
            if (Math.abs(pts[id]['x'] - p5.mouseX) < minDistanceX + hoverTolerance && Math.abs(pts[id]['y'] - p5.mouseY) < minDistanceY + hoverTolerance) {
                let newDistance = Math.pow(pts[id]['x'] - p5.mouseX, 2) + Math.pow(pts[id]['y'] - p5.mouseY, 2)

                if ((!distance || newDistance < distance) && hover !== id) {
                    distance = Math.pow(pts[id]['x'] - p5.mouseX, 2) + Math.pow(pts[id]['y'] - p5.mouseY, 2)
                }

                ptFound = id
            }
        })

        setHover(ptFound)
    }

    return <Sketch setup={setup} draw={draw} mouseMoved={mouseMoved} />
}

export default ScatterPlot