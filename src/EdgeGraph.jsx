import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from 'react'

import { drawGraphLegend } from "./legend";
import { graphRow } from "./shapes";
import DataContext from "./DataContext";
import { shapes, themeColours } from "./constants";
import { getDefaultSelections } from "./helpers/selections";

const canvasWidth = window.innerWidth * 0.95
const canvasHeight = window.innerHeight

const edgeLength = 275

const EdgeGraph = () => {
    const [p5, setP5] = useState(null)
    const { background, textColour, pinBackground } = themeColours['DEFAULT']
    const rowSelections = {...getDefaultSelections(shapes.ROW.id), ['numColours']: 7 }
    const { data, dataBrackets, dataType, variable } = useContext(DataContext)
    const [pts, setPts] = useState([])
    const countryData = {...data}
    delete countryData['World']

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

    // const drawPt = (p5, entry, x, y) => {
    //     let data = entry['cases']['2020']
    //     if (spiralSelections[spiralValues.NUM_YEARS] === 2) {
    //         data = data.concat(entry['cases']['2021'])
    //     }

    //     graphSpiral(p5, x, y, data, spiralSelections, dataType)
    //     p5.fill(textColour)
    //     p5.text(entry['location'], x, y + radius + 5)
    // }

    const draw = (p5) => {
        p5.clear()
        p5.background(background)

        p5.fill(textColour)
        p5.textSize(30)
        p5.text(`Canadian Imports/Exports 2010-2019`, canvasWidth/2, 25)
        p5.textSize(12)

        edgeGraph(p5, pts)
        
        drawGraphLegend(p5, canvasWidth / 2, canvasHeight - 25, rowSelections, dataType, textColour)

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

    const edgeGraph = (p5, pts) => {
        let nodeDiameter = 90
        p5.noStroke()

        let startX = canvasWidth/2
        let startY = canvasHeight/2
        let angle = -Math.PI /3
        let radianPer = Math.PI * 2 / pts.length

        pts.forEach(pt => {
            let x = startX + Math.cos(angle) * nodeDiameter/2
            let y = startY + Math.sin(angle) * nodeDiameter/2
            graphRow(p5, x, y, pt['x'], pt['y'], countryData[pt['name']]['data'], rowSelections, variable, dataBrackets, pt['name'])
            angle += radianPer
        })

        p5.stroke(textColour)
        p5.fill(pinBackground)
        p5.ellipse(canvasWidth/2, canvasHeight/2, nodeDiameter, nodeDiameter)
        p5.noStroke()

        p5.fill(textColour)
        p5.text('Canada', canvasWidth/2, canvasHeight/2)

        pts.forEach(pt => {
            let x = startX + Math.cos(angle) * (nodeDiameter/2 + edgeLength)
            let y = startY + Math.sin(angle) * (nodeDiameter/2 + edgeLength)
            let name = pt['name']

            p5.stroke(textColour)
            p5.fill(pinBackground)
            p5.ellipse(x, y, nodeDiameter, nodeDiameter)
            p5.noStroke()

            p5.fill(textColour)
            p5.text(name, x, y)

            angle += radianPer
        })

    }

    return <Sketch setup={setup} draw={draw} />
}

export default EdgeGraph