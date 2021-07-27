import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";

import { drawLegend } from "./legend";
import { averageData, getLocationData } from "./helpers/data";
import { getDefaultSelections } from "./helpers/selections";
import { shapes, rectValues, spiralValues, themeColours } from "./constants";
import { getInterval, getManualInterval } from "./helpers/intervals";
import { updateClusters, calculateClusters } from "./helpers/cluster";
import { rectangle, spiral, getSpiralSize, getRadius, getRowSize, getPinAdjustment } from "./shapes";
import SelectionContext from "./SelectionContext";
import DataContext from "./DataContext";

const mapWidth = window.innerWidth * 0.95
const mapHeight = window.innerHeight * 0.75

const Overlay = () => {
    const map = useMap()
    const view = 'MAP'
    const { locations, data, dataBrackets, dataType } = useContext(DataContext)
    const { selections, theme, fillMissing, mapPin, opaque, shape, yearIndication } = useContext(SelectionContext)
    const colourTheme = themeColours[theme]
    const [p5, setP5] = useState(null)
    const [pg, setPg] = useState(null)
    const interval = dataType === 'TEMP'
        ? getInterval(dataBrackets, selections[rectValues.NUM_COLOURS])
        : getManualInterval(dataBrackets, selections[rectValues.NUM_COLOURS], dataType)
    const [locationClusters, setClusters] = useState([])
    const [detailed, setDetailed] = useState([])
    const [detailedHeight, setDetailedHeight] = useState(0)
    const [hover, setHover] = useState(null)
    const [animated, setAnimated] = useState({ index: null, x: 0, y: 0, numDays: 0, width: selections[spiralValues.SPIRAL_WIDTH] })
    const [redraw, setRedraw] = useState(false)
    const [recluster, setRecluster] = useState(false)


    useEffect(() => {
        if (p5) {
            drawLocationClusters()
        }
    }, [selections, map, mapPin, hover, opaque, yearIndication, fillMissing, theme])

    useEffect(() => {
        resetClusters(true)
    }, [shape])

    useEffect(() => {
        if(p5) {
            draw(p5)
        }

    }, [pg, p5])

    useEffect(() => {
        if (animated.index !== null) {
            draw(p5)
        }
    }, [animated.index])

    useEffect(() => {
        if (p5 && detailed.length) {
            drawLocationClusters()
        }
    }, [detailed])

    useEffect(() => {
        if (redraw) {
            panClusters()
            setRedraw(false)
        }
    }, [redraw])

    useEffect(() => {
        if (recluster) {
            resetClusters(true)
            setRecluster(false)
        }
    }, [recluster])

    useEffect(() => {
        if (map && p5) {
            map.on('drag', (e) => {
                // panClusters()
                setRedraw(true)
                console.log(e.sourceTarget['_newPos'])
            })
            map.on('zoomstart', () => {
                clearMap()
            })
            map.on('zoomend', () => {
                setRecluster(true)
            })
        }
    }, [map, p5])

    useEffect(() => {
        resetClusters(true)
    }, [locations])

    const getHoverTransform = (numLocations) => {
        return numLocations + 5
    }

    const drawPin = (x, y, ids, hover = false) => {
        if (shape === shapes.SPIRAL.id) {
            drawSpiral(x, y, ids, hover)
        } else {
            drawRect(x, y, ids, hover)
        }
    }

    const drawSpiral = (x, y, ids, hover = false) => {
        let locationData = []
        if (ids.length === 1) {
            locationData = getLocationData(ids[0], selections, data)
        } else {
            locationData = averageData(ids, selections, data)
        }

        let numLocations = hover ? getHoverTransform(ids.length) : ids.length
        let { spiralWidth, spiralTightness } = getSpiralSize(selections, numLocations)

        const newSelections = {
            ...selections,
            [spiralValues.SPIRAL_WIDTH]: spiralWidth,
            [spiralValues.SPACE_BETWEEN_SPIRAL]: spiralTightness
        }

        let startY = y
        if (mapPin) {
            startY = startY - getPinAdjustment(newSelections, shape, locationData)
        }

        spiral(dataType, interval, locationData, x, y, mapPin, pg, newSelections, x, startY, opaque, hover, yearIndication, fillMissing, colourTheme)
        pg.fill(colourTheme.textColour)
        pg.textSize(10)
        if (hover) {
            pg.textSize(15)
        }
        pg.textAlign(p5.CENTER, p5.CENTER)
        pg.text(ids.length, x - 2, startY + 1)
    }

    const drawRect = (x, y, ids, hover = false) => {
        let locationData = []
        if (ids.length === 1) {
            locationData = getLocationData(ids[0], selections, data)
        } else {
            locationData = averageData(ids, selections, data)
        }

        let numLocations = hover ? getHoverTransform(ids.length) : ids.length
        let { dayWidth, rowWidth, rowHeight } = getRowSize(selections, numLocations, locationData.length)
        const newSelections = {
            ...selections,
            [rectValues.DAY_WIDTH]: dayWidth,
            [rectValues.ROW_HEIGHT]: rowHeight,
        }

        let pinHeight = ((newSelections[rectValues.NUM_ROWS] * (newSelections[rectValues.SPACE_BETWEEN_ROWS] + newSelections[rectValues.ROW_HEIGHT])) * locationData.length)
        let startX = x - rowWidth / 2;
        let startY = y - pinHeight / 2
        if (mapPin) {
            startY = y - getPinAdjustment(newSelections, shape, locationData)
        }

        rectangle(dataType, interval, locationData, x, y, mapPin, pg, newSelections, startX, startY, opaque, hover, yearIndication, fillMissing, colourTheme)
        pg.fill(colourTheme.textColour)
        pg.textSize(10)
        pg.textAlign(p5.CENTER, p5.CENTER)
        if (hover) {
            pg.textSize(16)
        }

        if (mapPin) {
            pg.fill(colourTheme.pinBackground)
            pg.ellipse(x, y + 8, 16, 16)
            pg.fill(colourTheme.textColour)
            pg.text(ids.length, x, y + 8)
        } else {
            pg.fill(colourTheme.pinBackground)
            pg.ellipse(x, y + pinHeight / 2 + 8, 16, 16)
            pg.fill(colourTheme.textColour)
            pg.text(ids.length, x, y + pinHeight / 2 + 8)
        }

    }

    const drawHoverRect = (x, y, id, hoverSelections) => {
        let locationData = getLocationData(id, selections, data)
        const daysPerRow = Math.ceil(365 / hoverSelections[rectValues.NUM_ROWS])

        let startX = x - daysPerRow * hoverSelections[rectValues.DAY_WIDTH] / 2;
        let startY = y - ((hoverSelections[rectValues.NUM_ROWS] * (hoverSelections[rectValues.SPACE_BETWEEN_ROWS] + hoverSelections[rectValues.ROW_HEIGHT])) * locationData.length) / 2

        rectangle(dataType, interval, locationData, x, y, false, pg, hoverSelections, startX, startY, opaque, false, yearIndication, fillMissing, colourTheme)
    }

    const drawAnimatedRect = (x, y, ids, animSelections, numDays) => {
        let locationData = []
        if (ids.length === 1) {
            locationData = getLocationData(ids[0], selections, data)
        } else {
            locationData = averageData(ids, selections, data)
        }

        let newData = []
        locationData.forEach(year => {
            if (numDays < year.length) {
                newData.push(year.slice(year.length - numDays))
            } else {
                newData.push(year)
            }
        })

        let startX = x;
        let startY = y - ((animSelections[rectValues.NUM_ROWS] * (animSelections[rectValues.SPACE_BETWEEN_ROWS] + animSelections[rectValues.ROW_HEIGHT])) * newData.length) / 2

        rectangle(dataType, interval, newData, x, y, false, pg, animSelections, startX, startY, opaque, hover, yearIndication, fillMissing, colourTheme)
    }

    const setup = (p5, parent) => {
        p5.createCanvas(mapWidth, mapHeight).parent(parent)
        setPg(p5.createGraphics(mapWidth, mapHeight))
        setP5(p5)
    }

    const draw = (p5) => {
        drawLocationClusters()
        p5.image(pg, 0, 0)

        if (animated.index !== null) {
            // p5.loop()
            // let cluster = locationClusters[animated.index]
            // let newSelections = getDefaultSelections(shapes.RECT.id, view)
            // newSelections = {
            //     ...newSelections,
            //     [rectValues.NUM_COLOURS]: selections[rectValues.NUM_COLOURS],
            //     [rectValues.DAY_WIDTH]: 0.25,
            //     [rectValues.ROW_HEIGHT]: animated.width,
            // }

            // drawAnimatedRect(animated.x, animated.y, cluster.locations, newSelections, animated.numDays)
            // if (animated.numDays < 365) {
            //     setAnimated({ ...animated, numDays: animated.numDays + 80 })
            // } else if (animated.x < mapWidth - 125) {
            //     setAnimated({ ...animated, x: animated.x + 50 })
            // } else {
            //     setAnimated({ ...animated, y: animated.y - 50 })
            // }

            // if (animated.y < detailedHeight * (detailed.length + 1)) {
            //     let newDetailed = [...detailed]
            //     locationClusters[animated.index].locations.forEach(id => {
            //         if (!detailed.includes(id)) {
            //             newDetailed.push(id)
            //         }
            //     })

            //     setAnimated({ index: null, x: 0, y: 0, numDays: 0 })
            //     setDetailed(newDetailed)
            // }
        } else {
            p5.noLoop()
        }
    }



    const mouseMoved = (p5) => {
        let hoverFound = false
        let pinAdjustment = 0

        if (mapPin) {
            pinAdjustment = getPinAdjustment(selections, shape)
        }

        locationClusters.forEach((cluster, index) => {
            if (Math.abs(p5.mouseX - cluster.x) < cluster.minDistanceX && Math.abs(p5.mouseY - cluster.y + pinAdjustment) < cluster.minDistanceY) {
                setHover(index)
                hoverFound = true
            }
        })

        if (!hoverFound) {
            setHover(null)
        }
    }

    const mouseClicked = (p5) => {
        let pinAdjustment = 0

        if (mapPin) {
            pinAdjustment = getPinAdjustment(selections, shape)
        }

        if (p5.mouseX > 25 && p5.mouseX < 50 && p5.mouseY > 25 && p5.mouseY < 50) {
            map.zoomIn(0.5)

        } else if (p5.mouseX > 25 && p5.mouseX < 50 && p5.mouseY > 50 && p5.mouseY < 75) {
            map.zoomOut(0.5)
        } else {
            locationClusters.forEach((cluster, index) => {
                if (Math.abs(p5.mouseX - cluster.x) < cluster.minDistanceX && Math.abs(p5.mouseY - cluster.y + pinAdjustment) < cluster.minDistanceY) {
                    let allDisplayed = true
                    cluster.locations.forEach(id => {
                        if (!detailed.includes(id)) {
                            allDisplayed = false
                        }
                    })

                    if (allDisplayed) {
                        let newDetailed = [...detailed]
                        cluster.locations.forEach(id => {
                            let index = newDetailed.indexOf(id)
                            newDetailed.splice(index, 1)
                        })
                        setDetailed(newDetailed)
                    } else {
                        let { spiralWidth, spiralTightness } = getSpiralSize(selections, getHoverTransform(locationClusters[index].locations.length))

                        const newSelections = {
                            ...selections,
                            [spiralValues.SPIRAL_WIDTH]: spiralWidth,
                            [spiralValues.SPACE_BETWEEN_SPIRAL]: spiralTightness
                        }
                        setAnimated({ ...animated, index, x: locationClusters[index].x, y: locationClusters[index].y - getRadius(newSelections), width: spiralWidth / 2 })
                    }

                }
            })
        }
    }

    const panClusters = () => {
        p5.clear()
        const newClusters = updateClusters(map, locationClusters)

        setClusters(newClusters)
        drawLocationClusters(newClusters)
        p5.image(pg, 0, 0)
    }

    // const resetClusters = (redraw = false) => {
    //     const newClusters = calculateClusters(locations, selections, shape, mapPin, map)
    //     setClusters(newClusters)

    //     if (redraw && p5) {
    //         drawLocationClusters(newClusters)
    //     }
    // }

    const drawLocationClusters = (clusters = locationClusters) => {
        pg.clear()
        pg.noStroke()

        if (clusters.length) {
            clusters?.forEach((cluster, index) => {
                if (index !== hover) {
                    drawPin(cluster.x, cluster.y, cluster.locations)
                }

            })

            if (hover !== null && clusters[hover]) {
                drawPin(clusters[hover].x, clusters[hover].y, clusters[hover].locations, true)
            }

            if (detailed.length) {
                drawDetailed()
            }
        }

        drawLegend(pg, mapWidth / 2, mapHeight - 40, selections, interval, dataType, null, colourTheme.textColour)
        drawZoom(pg)
    }

    const clearMap = () => {
        if (pg) {
            pg.clear()
        }
    }

    const drawZoom = (pg) => {
        pg.fill(255)
        pg.stroke(50)
        pg.rect(25, 25, 25, 25)
        pg.rect(25, 50, 25, 25)

        pg.fill(0)
        pg.text("+", 37, 37)
        pg.text("-", 37, 62)
        pg.noStroke()
    }

    const drawDetailed = () => {
        let newSelections = selections
        if (shape === shapes.SPIRAL.id) {
            newSelections = getDefaultSelections(shapes.RECT.id, view)
            newSelections = {
                ...newSelections,
                [rectValues.NUM_COLOURS]: selections[rectValues.NUM_COLOURS],
                [rectValues.DAY_WIDTH]: 0.25,
            }
        }

        const { pinHeight } = getRowSize(newSelections, detailed.length, selections[rectValues.NUM_YEARS])
        const locationHeight = pinHeight + 30

        pg.fill(colourTheme.background)
        pg.rect(mapWidth - 150, 0, 150, locationHeight * detailed.length)
        pg.textAlign(p5.LEFT, p5.TOP)

        detailed.forEach((id, index) => {
            pg.fill(colourTheme.textColour)
            pg.textSize(10)
            pg.text(locations[id].name, mapWidth - 150, index * locationHeight)
            drawHoverRect(mapWidth - 75, index * locationHeight + pinHeight / 2 + 15, id, newSelections)
        })

        setDetailedHeight(locationHeight)
    }

    return (
        <div className="position-absolute fixed-top">
            <Sketch draw={draw} mouseClicked={mouseClicked} mouseMoved={mouseMoved} setup={setup} />
        </div >
    )
}

export default Overlay