import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from 'react'

import { drawLegend } from "./legend";
import { spiral, row, getShapeSize,  getPinAdjustment } from "./shapes";
import DataContext from "./DataContext";
import { getManualInterval } from "./helpers/intervals";
import { shapes, themeColours } from "./constants";
import { formatNumbers } from "./helpers/format"
import { onClick, onHover } from "./helpers/studyEventHandlers";

const canvasWidth = window.options ? 1000 : window.innerWidth * 0.95
const canvasHeight = window.innerHeight

const xBorder = 50
const graphWidth = canvasWidth - xBorder * 2

const yBorder = 50
const graphHeight = canvasHeight - yBorder * 2

const ScatterPlot = ({ encoding, selections, shape }) => {
    const { data, dataBrackets, yBrackets, xBrackets, dataType } = useContext(DataContext)
    const { theme, numColours, numYears, mapPin } = selections
    const colourTheme = themeColours[theme]
    const [p5, setP5] = useState(null)
    const { width, height, maxRadius } = getShapeSize(selections, shape)
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

        Object.keys(data).forEach(id => {
            let x = calcX(data[id]['human_development_index'])
            let y = calcY(id)

            const { pg, width, height } = getGlyph(id)
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

        drawXAxis(p5)
        drawYAxis(p5)
        drawLegend(p5, selections, dataBrackets, shape, encoding, interval, dataType, canvasWidth)
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
                p5.noStroke()
                if (shape === shapes.SPIRAL.id) {
                    p5.ellipse(pin.x, pin.y, maxRadius * 5, maxRadius * 5)
                } else if (shape === shapes.ROW.id) {
                    p5.rect(pin.x - width * 1.5, pin.y - height * 2, width * 3, height * 4)
                }
            }

            p5.image(hoverpg, pin.x - pin.width * 0.75, pin.y - pin.height * 0.75)

            p5.textAlign(p5.CENTER, p5.TOP)
            p5.fill(colourTheme.textColour)
            p5.text(pin.name, pin.x, pin.y + height * 0.75 + 5)
        }
    }

    const calcY = (id) => {
        const bottom = canvasHeight - yBorder - height / 2
        const graphRange = graphHeight - height
        let logLow = Math.floor(Math.log2(yBrackets.low))
        let logHigh = Math.ceil(Math.log2(yBrackets.high))
        let logRange = logHigh - logLow

        return Math.round(bottom - ((Math.log2(data[id]['population']) - logLow) * graphRange / logRange))
    }

    const calcX = (num) => {
        const left = xBorder + width / 2
        const graphRange = graphWidth - width
        const dataRange = xBrackets.high - xBrackets.low
        const increment = graphRange / dataRange

        return left + (num - xBrackets.low) * increment
    }

    const drawYAxis = (p5) => {
        let logLow = Math.floor(Math.log2(yBrackets.low))
        let logHigh = Math.ceil(Math.log2(yBrackets.high))
        let numSteps = logHigh - logLow
        let spacePer = graphHeight / numSteps
        p5.fill(colourTheme.textColour)
        p5.noStroke()

        let yWalker = canvasHeight - yBorder
        for (let i = 0; i < numSteps; i = i + 1) {
            p5.textAlign(p5.RIGHT, p5.CENTER)
            p5.text(formatNumbers(Math.pow(2, i + logLow)), xBorder - 2, yWalker)
            yWalker = yWalker - spacePer
        }

        let labelGraphics = p5.createGraphics(100, 100)
        labelGraphics.translate(0, 70)
        labelGraphics.rotate(p5.radians(-90))

        labelGraphics.fill(colourTheme.textColour)
        labelGraphics.text('Population', 0, 10)

        p5.image(labelGraphics, 1, graphHeight / 2)
    }

    const drawXAxis = (p5) => {
        const increments = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.noStroke()
        p5.fill(colourTheme.textColour)

        increments.forEach(num => {
            let x = calcX(num)
            p5.text(num, x, canvasHeight - 40)
        })

        p5.textSize(12)
        p5.text('Human Development Index', canvasWidth / 2, canvasHeight - 20)
    }

    const mouseMoved = () => {
        let ptFound = null
        let distance = null
        let pinAdjustment = mapPin ? getPinAdjustment(selections, shape) : 0
        const xTolerance = shape === 1 ? maxRadius * 3 : width * 1.5
        const yTolerance = shape === 1 ? maxRadius * 3 : height * 2

        // if user is already hovering, give them a lot of tolerance to keep that hover
        if (hover !== null) {
            if (Math.abs(p5.mouseX - pts[hover]['x']) < xTolerance && Math.abs(p5.mouseY - pts[hover]['y'] + pinAdjustment) < yTolerance) {
                distance = Math.pow(Math.abs(p5.mouseX - pts[hover]['x']), 2) + Math.pow(Math.abs(p5.mouseY - pts[hover]['x'] + pinAdjustment), 2)
                ptFound = hover
            }
        }

        Object.keys(pts).forEach(id => {
            if (Math.abs(pts[id]['x'] - p5.mouseX) < width / 2 && Math.abs(pts[id]['y'] - p5.mouseY + pinAdjustment) < height / 2) {
                let newDistance = Math.pow(pts[id]['x'] - p5.mouseX, 2) + Math.pow(pts[id]['y'] - p5.mouseY  + pinAdjustment, 2)

                if ((!distance || newDistance < distance)) {
                    distance = newDistance
                    ptFound = id
                }
            }
        })

        if (ptFound && ptFound !== hover) {
            onHover(pts[ptFound]['name'])
        }

        if (ptFound !== hover) {
            setHover(ptFound)
        }
    }

    const mouseClicked = () => {
        if (hover !== null) {
            onClick(pts[hover]['name'])
        }
    }

    return <Sketch setup={setup} draw={draw} mouseMoved={mouseMoved} mouseClicked={mouseClicked} />
}

export default ScatterPlot