import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from 'react'

import { drawLegend } from "./legend";
import { spiral, row, getShapeSize } from "./shapes";
import DataContext from "./DataContext";
import { getManualInterval } from "./helpers/intervals";
import { shapes, themeColours } from "./constants";
import { formatNumbers } from "./helpers/format"

const canvasWidth = window.innerWidth * 0.95
const canvasHeight = window.innerHeight

const xBorder = 50
const graphWidth = canvasWidth - xBorder * 2

const yBorder = 50
const graphHeight = canvasHeight - yBorder * 2

const getSpacePerPt = (width, totalDataPts) => {
    return (graphWidth - width) / totalDataPts
}

const ScatterPlot = ({ encoding, selections, shape }) => {
    const { data, dataBrackets, yBrackets, categories, dataType, totalDataPts } = useContext(DataContext)
    const { theme, numColours, numYears, mapPin } = selections
    const colourTheme = themeColours[theme]
    const [p5, setP5] = useState(null)
    const { width, height } = getShapeSize(selections, shape)
    const spacePerPt = getSpacePerPt(width, totalDataPts)
    const [pts, setPts] = useState({})
    const [hover, setHover] = useState(null)
    const interval = getManualInterval(dataBrackets, numColours, dataType)

    useEffect(() => {
        if (p5) {
            reset()
        }
    }, [p5, shape])

    useEffect(() => {
        if (p5) {
            resetGlyphs()
        }
    }, [selections, encoding])

    useEffect(() => {
        if (p5) {
            draw(p5)
        }
    }, [pts, hover])

    const reset = () => {
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
    }

    const resetGlyphs = () => {
        let newPts = {}

        Object.keys(pts).forEach(id => {

            const { pg, width, height } = getGlyph(id)
            newPts[id] = {
                ...pts[id],
                pg,
                width,
                height,
            }
        })

        setPts(newPts)
    }

    const calcCategories = () => {
        let xCounters = {}
        let walker = xBorder + width

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
            if (xCounters[cat] > xBorder + width) {
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
        if (encoding !== 1) {
            drawLegend(p5, canvasWidth / 2, canvasHeight - 25, selections, interval, dataType, null, colourTheme.textColour)
        }

        drawGlyphs()

        p5.noLoop()
    }

    const getGlyph = (id) => {
        let canvasWidth = 500
        let canvasHeight = 500

        let pg = p5.createGraphics(canvasWidth, canvasHeight)
        pg.clear()
        pg.noStroke()

        let ptData = data[id]['cases']['2020']
        if (numYears === 2) {
            ptData = ptData.concat(data[id]['cases']['2021'])
        }

        ptData = [[...ptData]]

        if (shape === shapes.SPIRAL.id) {
            spiral(pg, dataType, interval, ptData, canvasWidth / 2, canvasHeight / 2, selections, encoding)
        } else if (shape === shapes.ROW.id) {
            row(pg, dataType, interval, ptData, canvasWidth / 2, canvasHeight / 2, selections, encoding)
        }

        return { pg, width: canvasWidth, height: canvasHeight }
    }

    const drawGlyphs = () => {
        Object.keys(pts).forEach((id) => {
            let pt = pts[id]
            if (id !== hover) {
                p5.image(pt.pg, pt.x - pt.width / 2, pt.y - pt.height / 2)
            }
        })

        if (hover !== null) {
            const pin = pts[hover]
            const hoverpg = p5.createGraphics(pin.width, pin.height)
            hoverpg.image(pin.pg, 0, 0, pin.width * 1.5, pin.height * 1.5)

            if (!mapPin) {
                p5.fill(colourTheme.pinBackground, 100)
                if (shape === shapes.SPIRAL.id) {
                    p5.ellipse(pin.x, pin.y, width * 3, height * 3)
                } else if (shape === shapes.ROW.id) {
                    p5.rect(pin.x - width, pin.y - height, width * 2, height * 3)
                }
            }

            p5.image(hoverpg, pin.x - pin.width * 0.75, pin.y - pin.height * 0.75)

            p5.textAlign(p5.CENTER, p5.TOP)
            p5.fill(colourTheme.textColour)
            p5.text(pin.name, pin.x, pin.y + height)
        }
    }

    const calcY = (id) => {
        const bottom = canvasHeight - yBorder - height/2
        const graphRange = graphHeight - height
        let logLow = Math.floor(Math.log2(yBrackets.low))
        let logHigh = Math.ceil(Math.log2(yBrackets.high))
        let logRange = logHigh - logLow

        return Math.round(bottom - ((Math.log2(data[id]['population']) - logLow) * graphRange / logRange))
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
            if (Math.abs(pts[id]['x'] - p5.mouseX) < width/2 && Math.abs(pts[id]['y'] - p5.mouseY) < height/2) {
                let newDistance = Math.pow(pts[id]['x'] - p5.mouseX, 2) + Math.pow(pts[id]['y'] - p5.mouseY, 2)

                if ((!distance || newDistance < distance)) {
                    distance = Math.pow(pts[id]['x'] - p5.mouseX, 2) + Math.pow(pts[id]['y'] - p5.mouseY, 2)
                    ptFound = id
                }
            }
        })

        setHover(ptFound)
    }

    return <Sketch setup={setup} draw={draw} mouseMoved={mouseMoved} />
}

export default ScatterPlot