import Sketch from "react-p5";
import React, { useEffect, useState } from "react";

import { dataSets, shapes, themeColours } from './constants'
import { getInterval } from "./helpers/intervals";
import { migrationRow, migrationSpiral, row, spiral } from "./shapes";
import { getData, getLocationData } from './helpers/data'
import { getMigrationSizes, getShapeSelections } from "./helpers/selections";


const getSingleData = (data, dataSet) => {
    if (dataSet === dataSets.COVID.val) {
        const ptData = []
        ptData.push(data['USA']['cases']['2021'])
        ptData.push(data['USA']['cases']['2020'])

        return { ptData, id: 'USA', increments: [1, 10, 100, 1000, 10000, 100000, 1000000] }
    } else if (dataSet === dataSets.TEMP.val) {
        const ptData = getLocationData(15, 2, data)

        return { ptData, id: 15, increments: [-35, -25, -15, -5, 0, 5, 15, 25, 30] }
    } else if (dataSet === dataSets.MIGRATION.val) {
        const ptData = Object.values(data['Ecuador>Spain']["data"])

        let duplicatedPts = [];
        for (let i = 0; i < ptData.length; i++) {
            let times = 0;
            while (times < 10) {
                duplicatedPts.push(ptData[i])
                times += 1
            }
        }

        return { ptData: duplicatedPts, id: 'Ecuador>Spain', increments: [100, 1000, 10000, 100000, 1000000] }
    }
}

const Tile = ({ encoding, selections, shape }) => {
    const { theme, dataSet } = selections
    const { data, dataSet: dataType, dataBrackets } = getData(dataSet, false)
    const { ptData, id, increments } = getSingleData(data, dataSet)
    const colourTheme = themeColours[theme]
    const interval = getInterval(dataBrackets, selections.numColours)
    const [p5, setP5] = useState(null)
    const canvasSize = 120
    let rowSizes = {}
    let spiralSizes = {}

    if (selections.dataType === dataSets.MIGRATION.val) {
        spiralSizes = getMigrationSizes(1, selections.size)
        rowSizes = getMigrationSizes(2, selections.size)
    } else {
        spiralSizes = getShapeSelections(1, selections.size)
        rowSizes = getShapeSelections(2, selections.size)
    }

    selections = { ...selections, ...rowSizes, ...spiralSizes }

    useEffect(() => {
        if (p5) {
            draw(p5)
        }

    }, [selections, p5])

    const drawPin = (x, y) => {
        if (dataSet === dataSets.MIGRATION.val) {
            selections = { ...selections, ['numYears']: 1 }
            shape === shapes.SPIRAL.id ? migrationSpiral(p5, dataType, interval, ptData, x, y, selections, encoding, 1, id)
                : migrationRow(p5, dataType, interval, ptData, x, y, selections, encoding, 1, id, increments)
        } else {
            if (shape === shapes.SPIRAL.id) {
                spiral(p5, dataType, interval, ptData, x, y, selections, encoding, 1, id)
            } else if (shape === shapes.ROW.id) {
                row(p5, dataType, interval, ptData, x, y, selections, encoding, 1, id, increments)
            }
        }
    }

    const setup = (p5, parent) => {
        setP5(p5)
        p5.createCanvas(canvasSize, canvasSize).parent(parent)
    }

    const draw = (p5) => {
        p5.clear()
        p5.stroke(0)
        p5.fill(colourTheme.background)
        p5.rect(0, 0, canvasSize, canvasSize)
        p5.noStroke()
        drawPin(canvasSize / 2, canvasSize / 2)

        p5.noLoop()
    }

    return <Sketch draw={draw} setup={setup} />
}

export default Tile