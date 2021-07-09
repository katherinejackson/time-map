import Sketch from "react-p5";
import react, { useContext, useEffect, useState } from 'react'

import { drawLegend } from "./legend";
import SelectionContext from "./SelectionContext";
import { getRadius, scatterSpiral } from "./shapes";
import DataContext from "./DataContext";
import { spiralValues } from "./constants";

const canvasWidth = window.innerWidth * 0.95
const canvasHeight = window.innerHeight * 0.75

const xBorder = 20
const graphWidth = canvasWidth - xBorder * 2

const yBorder = 50
const graphHeight = canvasHeight - yBorder * 2

const clickTolerance = 5

const Canvas = ({ }) => {
    const { selections } = useContext(SelectionContext)
    const { data, dataBrackets, yBrackets, categories, dataType, totalDataPts } = useContext(DataContext)
    const [p5, setP5] = useState(null)
    const [spacePerPt, setSpacePerPoint] = useState((graphWidth - getRadius(selections, selections[spiralValues.NUM_YEARS]) * 2) / totalDataPts)
    const [pts, setPts] = useState({})
    const [detailed, setDetailed] = useState(null)
    const [radius, setRadius] = useState(getRadius(selections, selections[spiralValues.NUM_YEARS]))

    useEffect(() => {
        setRadius(getRadius(selections, selections[spiralValues.NUM_YEARS]))
        if (p5) {
            draw(p5)
        }
    }, [selections])

    useEffect(() => {
        if (detailed && p5) {
            drawDetailed(p5)
        }
    }, [detailed])

    useEffect(() => {
        setSpacePerPoint((graphWidth - getRadius(selections, selections[spiralValues.NUM_YEARS]) * 2) / totalDataPts)
    }, [totalDataPts])

    const calcCategories = () => {
        let xCounters = {}
        let walker = xBorder + getRadius(selections, selections[spiralValues.NUM_YEARS])

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

    const drawSpiral = (p5, entry, x, y) => {
        let data = entry['cases']['2020']
        if (selections[spiralValues.NUM_YEARS] === 2) {
            data = data.concat(entry['cases']['2021'])
        }

        scatterSpiral(p5, x, y, data, selections, dataType)
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
        p5.fill(0)
        p5.text(pts[detailed.id]['name'], detailed.x, detailed.y + newRadius + 5)
    }

    const draw = (p5) => {
        p5.clear()
        p5.stroke(50)
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
            p5.fill(0)
            p5.text(cat, xCounters[cat] + (spacePerPt * categories[cat]) / 2, canvasHeight - 40)
        })

        let newPts = {}
        Object.keys(data).forEach(id => {
            let x = xCounters[data[id]['continent']]
            let y = canvasHeight - yBorder - (Math.log2(data[id]['population']) * graphHeight / Math.log2(yBrackets.high - yBrackets.low))
            drawSpiral(p5, data[id], x, y)
            xCounters[data[id]['continent']] = xCounters[data[id]['continent']] + spacePerPt
            newPts[id] = {
                'name': data[id]['location'],
                x,
                y,
            }
        })

        setPts(newPts)

        drawLegend(p5, canvasWidth / 2, canvasHeight - 25, selections, null, dataType, dataBrackets)

        p5.noLoop()
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

export default Canvas