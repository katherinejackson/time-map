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

const Canvas = ({ }) => {
    const { selections } = useContext(SelectionContext)
    const { data, dataBrackets, yBrackets, categories, dataType, totalDataPts } = useContext(DataContext)
    const [p5, setP5] = useState(null)

    useEffect(() => {
        if (p5) {
            draw(p5)
        }
    }, [selections])

    const calcCategories = () => {
        let xCounters = {}
        let walker = xBorder + getRadius(selections, selections[spiralValues.NUM_YEARS])

        let spacePerCountry = graphWidth / totalDataPts

        Object.keys(categories).forEach(cat => {
            let numInCategory = categories[cat]
            xCounters[cat] = walker
            walker += spacePerCountry * numInCategory
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
        scatterSpiral(p5, x, y, data, selections, dataType)

        p5.fill(0)
        // p5.text(entry['location'], x, y + getRadius(selections, selections[spiralValues.NUM_YEARS]) + 5)
    }

    const draw = (p5) => {
        p5.clear()
        p5.stroke(50)
        p5.line(xBorder, yBorder, xBorder, canvasHeight - yBorder)
        p5.line(xBorder, canvasHeight - yBorder, canvasWidth - xBorder, canvasHeight - yBorder)

        let xCounters = calcCategories()
        let spacePerCountry = graphWidth / totalDataPts
        Object.keys(categories).forEach(cat => {
            if (xCounters[cat] > xBorder + getRadius(selections, selections[spiralValues.NUM_YEARS])) {
                p5.stroke(50)
                p5.line(
                    xCounters[cat] - spacePerCountry / 2,
                    canvasHeight - yBorder,
                    xCounters[cat] - spacePerCountry / 2,
                    yBorder)
            }

            p5.noStroke()
            p5.fill(0)
            p5.text(cat, xCounters[cat] + (spacePerCountry * categories[cat]) / 2, canvasHeight - 40)
        })

        Object.keys(data).forEach(id => {
            let x = xCounters[data[id]['continent']]
            let y = canvasHeight - yBorder - (Math.log2(data[id]['population']) * graphHeight / Math.log2(yBrackets.high - yBrackets.low))
            drawSpiral(p5, data[id], x, y)
            xCounters[data[id]['continent']] = xCounters[data[id]['continent']] + spacePerCountry
        })

        drawLegend(p5, canvasWidth / 2, canvasHeight - 25, selections, null, dataType, dataBrackets)

        p5.noLoop()
    }

    return <Sketch setup={setup} draw={draw} />
}

export default Canvas