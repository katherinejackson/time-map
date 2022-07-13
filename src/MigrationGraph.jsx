import React, { useState, useEffect } from "react";
import { scaleLinear } from "d3";
import Sketch from "react-p5";
import { drawMigrationLegend } from "./legend";
import { getRoundedInterval } from "./helpers/intervals";
import { filterMigrationData } from "./helpers/data";
import { migrationRow, getShapeSize, getPinAdjustment, migrationSpiral } from "./shapes";
import { dataSets, shapes, themeColours } from "./constants";
import { onClick, onHover } from "./helpers/studyEventHandlers";
import { getMigrationSizes } from "./helpers/selections";
import { getData } from './helpers/data'

const canvasWidth = window.options ? 1200 : window.innerWidth * 0.95;
const canvasHeight = window.options ? 800 : window.innerHeight * 0.95;
const magnification = 1;

const MigrationGraph = ({ encoding, practice, selections, shape, study, size }) => {
    const [p5, setP5] = useState(null)
    const { data, dataSet: dataType, dataBrackets } = getData(dataSets.MIGRATION.val, practice)
    const [backgroundImage, setBackgroundImage] = useState(null)
    const { theme, numColours, mapPin } = selections
    const [pts, setPts] = useState({});
    const [hover, setHover] = useState(null);
    const colourTheme = themeColours[theme]
    const { width, height, maxRadius } = getShapeSize(selections, shape, 410)
    const interval = getRoundedInterval(dataBrackets, numColours)

    // If in study mode, then we need to use the pre-set sizes
    if (study) {
        let newSizes = getMigrationSizes(shape, size);

        for (let val in newSizes) {
            selections[val] = newSizes[val];
        }
    }

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

    const preload = (p5) => {
        setBackgroundImage(p5.loadImage("https://raw.githubusercontent.com/katherinejackson/time-map/master/src/data/graph-image.png"));
    }

    const setup = (p5, parent) => {
        setP5(p5)
        p5.createCanvas(canvasWidth, canvasHeight).parent(parent)
        p5.textAlign(p5.CENTER, p5.CENTER)

        p5.noLoop();
    }

    const draw = (p5) => {
        p5.clear();
        p5.image(backgroundImage, 0, 0, canvasWidth, canvasHeight)
        let increments = [100, 1000, 10000, 100000, 1000000]
        drawMigrationLegend(p5, selections, dataBrackets, shape, encoding, interval, dataType, canvasWidth, 41, increments)
        drawGlyphs();
    }

    const reset = () => {
        let newPts = {};
        const xScale = scaleLinear()
            .domain([0, 2400])
            .range([0, canvasWidth]);

        const yScale = scaleLinear()
            .domain([0, 1600])
            .range([0, canvasHeight]);

        Object.keys(data).forEach(id => {
            let x = xScale(data[id]["x"]);
            let y = yScale(data[id]["y"])

            const { pg, width, height } = getGlyph(id)
            newPts[id] = {
                name: id,
                x,
                y,
                pg,
                width,
                height,
            }
        });
        // Decide what countries to display depending on whether practice mode is on/off
        const practiceCountries = ['Italy>France', 'Romania>Germany', 'Bulgaria>Turkey']
        let newPoints = filterMigrationData(newPts, practiceCountries, selections.practice)
        setPts(newPoints);
    }


    const resetGlyphs = () => {
        let newPts = {};
        Object.keys(pts).forEach(id => {
            const { pg, width, height } = getGlyph(id)
            newPts[id] = {
                ...pts[id],
                pg,
                width,
                height,
            }
        });

        setPts(newPts)
    }

    const drawGlyphs = () => {
        Object.keys(pts).forEach((id) => {
            let pt = pts[id]
            if (id !== hover) {
                // p5.image(pt.pg, pt.x - pt.width / 2, pt.y - pt.height / 2)
                p5.image(pt.pg, pt.x - pt.width / 2, pt.y - pt.height / 2)
            }
        })

        if (hover !== null) {
            const pin = pts[hover]
            const hoverpg = p5.createGraphics(pin.width, pin.height)
            hoverpg.image(pin.pg, 0, 0, pin.width * 1.5, pin.height * 1.5)

            const mag = selections.spiralWidth === 6 ? 9 : 6.5

            if (!mapPin) {
                p5.fill(colourTheme.pinBackground, 200)
                p5.noStroke()
                if (shape === shapes.SPIRAL.id) {
                    p5.ellipse(pin.x, pin.y, maxRadius * mag, maxRadius * mag)
                } else if (shape === shapes.ROW.id) {
                    p5.rect(pin.x - width * 1.5 - 12, pin.y - height * 2.5, width * 3 + 24, height * 5 + 10)
                }
            }

            p5.image(hoverpg, pin.x - pin.width * 0.75, pin.y - pin.height * 0.75)

            p5.textAlign(p5.CENTER, p5.TOP)
            p5.fill(colourTheme.textColour)

            let newName;
            if (shape === shapes.SPIRAL.id) {
                newName = pin.name.split(">").join(' \u2192\ \n')
                if (selections.spiralWidth === 15) {
                    p5.text(newName, pin.x, pin.y + height * 0.75 + 15)
                }
                else if (selections.spiralWidth === 6) {
                    p5.text(newName, pin.x, pin.y + height * 0.75 + 10)
                }
                else {
                    p5.text(newName, pin.x, pin.y + height * 0.75 + 11)
                }

            }
            else if (shape === shapes.ROW.id) {
                newName = pin.name.split(">").join(' \u2192\ ')
                p5.text(newName, pin.x, pin.y + height * 0.75 + 9)
            }

        }
    }

    const getGlyph = (id) => {
        let canvasWidth = 500
        let canvasHeight = 500

        let pg = p5.createGraphics(canvasWidth, canvasHeight)
        pg.clear()
        pg.noStroke()

        const ptData = Object.values(data[id]["data"])

        let duplicatedPts = [];
        for (let i = 0; i < ptData.length; i++) {
            let times = 0;
            while (times < 10) {
                duplicatedPts.push(ptData[i])
                times += 1
            }
        }

        selections['numYears'] = 1
        if (shape === shapes.SPIRAL.id) {
            migrationSpiral(pg, dataType, dataBrackets, duplicatedPts, canvasWidth / 2, canvasHeight / 2, selections, encoding, 1, id)
        } else if (shape === shapes.ROW.id) {
            let increments = [100, 1000, 10000, 100000, 1000000]
            migrationRow(pg, dataType, dataBrackets, duplicatedPts, canvasWidth / 2, canvasHeight / 2, selections, encoding, 1, id, increments)
        }

        return { pg, width: canvasWidth, height: canvasHeight }
    }

    const mouseMoved = () => {
        let ptFound = null
        let distance = null
        let pinAdjustment = mapPin ? getPinAdjustment(selections, shape) : 0
        const xTolerance = shape === 1 ? maxRadius * 3 : (width * magnification) * 1.5
        const yTolerance = shape === 1 ? maxRadius * 3 : height * 2

        // if user is already hovering, give them a lot of tolerance to keep that hover
        if (hover !== null) {
            if (Math.abs(p5.mouseX - pts[hover]['x']) < xTolerance && Math.abs(p5.mouseY - pts[hover]['y'] + pinAdjustment) < yTolerance) {
                distance = Math.pow(Math.abs(p5.mouseX - pts[hover]['x']), 2) + Math.pow(Math.abs(p5.mouseY - pts[hover]['x'] + pinAdjustment), 2)
                ptFound = hover
            }
        }

        Object.keys(pts).forEach(id => {
            if (Math.abs(pts[id]['x'] - p5.mouseX) < (width * magnification) / 2 && Math.abs(pts[id]['y'] - p5.mouseY + pinAdjustment) < height / 2) {
                let newDistance = Math.pow(pts[id]['x'] - p5.mouseX, 2) + Math.pow(pts[id]['y'] - p5.mouseY + pinAdjustment, 2)

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

    return <Sketch preload={preload} setup={setup} draw={draw} mouseMoved={mouseMoved} mouseClicked={mouseClicked} />
}

export default MigrationGraph;
