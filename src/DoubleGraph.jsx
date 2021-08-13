import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from 'react'

import { drawGraphLegend } from "./legend";
import {  graphPerimeterSpiral,  graphRow } from "./shapes";
import DataContext from "./DataContext";
import { shapes, themeColours } from "./constants";
import { getDefaultSelections } from "./helpers/selections";

const canvasWidth = window.innerWidth * 0.95
const canvasHeight = window.innerHeight

const edgeLength = 200

const DoubleGraph = ({ }) => {
    const [p5, setP5] = useState(null)
    const { background, textColour, lineColour } = themeColours['DEFAULT']
    const spiralSelections = { ...getDefaultSelections(shapes.SPIRAL.id), ['numColours']: 7, ['spiralWidth']: 80 }
    const rowSelections = { ...getDefaultSelections(shapes.ROW.id), ['numColours']: 7 }
    const { data, dataBrackets, dataType, variable } = useContext(DataContext)
    const [pts, setPts] = useState([])
    const countryData = { ...data }
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

    const draw = (p5) => {
        p5.clear()
        p5.background(background)

        p5.fill(textColour)
        p5.textSize(30)
        p5.text(`Canadian Imports/Exports 2010-2019`, canvasWidth/2, 25)

        doubleGraph(p5, pts)
        
        drawGraphLegend(p5, canvasWidth / 2, canvasHeight - 25, spiralSelections, dataType, textColour)

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


    const doubleGraph = (p5, pts) => {
        let nodeDiameter = 75
        p5.noStroke()

        let startX = canvasWidth/2
        let startY = canvasHeight/2
        let angle = -Math.PI /3
        let radianPer = Math.PI * 2 / pts.length

        pts.forEach(pt => {
            let x = startX + Math.cos(angle) * (nodeDiameter/2)
            let y = startY + Math.sin(angle) * (nodeDiameter/2)
            graphRow(p5, x, y, pt['x'], pt['y'], countryData[pt['name']]['data'], rowSelections, variable, dataBrackets, pt['name'])
            angle += radianPer
        })

        graphPerimeterSpiral(p5, canvasWidth/2, canvasHeight/2, data['World']['data'], spiralSelections, dataType, 'tradeBalance', background)
        p5.fill(textColour)
        p5.textSize(8)
        p5.text('Canada', canvasWidth/2, canvasHeight/2)

        pts.forEach(pt => {
            let x = startX + Math.cos(angle) * (nodeDiameter/2 + edgeLength)
            let y = startY + Math.sin(angle) * (nodeDiameter/2 + edgeLength)
            let name = pt['name']

            graphPerimeterSpiral(p5, x, y, countryData[pt['name']]['data'], spiralSelections, dataType, 'tradeBalance', background)

            p5.fill(textColour)
            p5.textSize(8)
            p5.text(name, x, y)

            angle += radianPer
        })

    }

    return <Sketch setup={setup} draw={draw} />
}

export default DoubleGraph