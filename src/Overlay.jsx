import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";

import { drawLegend } from "./legend";
import { getLocationData } from "./helpers/data";
import { getDefaultSelections } from "./helpers/selections";
import { shapes, rectValues, themeColours } from "./constants";
import { getInterval, getManualInterval } from "./helpers/intervals";
import { calculateClusters, addLocations } from "./helpers/cluster";
import { rectangle, getRowSize, getPinAdjustment } from "./shapes";
import SelectionContext from "./SelectionContext";
import DataContext from "./DataContext";
import { getGlyph } from "./helpers/mapCanvas";
import { formatNames } from "./helpers/format";

const mapWidth = 1000
const mapHeight = window.innerHeight * 0.75

const Overlay = () => {
    const map = useMap()
    const view = 'MAP'
    const { locations, data, dataBrackets, dataType } = useContext(DataContext)
    const { cluster, selections, theme, fillMissing, mapPin, opaque, shape, yearIndication } = useContext(SelectionContext)
    const colourTheme = themeColours[theme]
    const [p5, setP5] = useState(null)
    const interval = dataType === 'TEMP'
        ? getInterval(dataBrackets, selections[rectValues.NUM_COLOURS])
        : getManualInterval(dataBrackets, selections[rectValues.NUM_COLOURS], dataType)
    const [locationPins, setLocationPins] = useState([])
    const [detailed, setDetailed] = useState([])
    const [hover, setHover] = useState(null)

    useEffect(() => {
        if (locations && p5) {
            resetPins()
        }

    }, [locations, p5, cluster, shape])

    useEffect(() => {
        if (p5 && locationPins.length) {
            setLocationPins(updateGlyphs(locationPins))
        }
    }, [selections, map, mapPin, opaque, yearIndication, fillMissing, theme, p5])

    useEffect(() => {
        if (p5 && locationPins.length) {
            redrawOverlay()
        }

    }, [locationPins, detailed, hover])

    useEffect(() => {
        if (p5) {
            map.off('drag')
            map.on('drag', () => {
                redrawOverlay()
            })
            map.off('zoom')
            map.on('zoom', () => {
                resetPins()
            })
        }
    }, [p5, locationPins, detailed, cluster, shape])

    const drawDetailedRect = (x, y, id, hoverSelections) => {
        let locationData = getLocationData(id, selections, data)
        const daysPerRow = Math.ceil(365 / hoverSelections[rectValues.NUM_ROWS])

        let startX = x - daysPerRow * hoverSelections[rectValues.DAY_WIDTH] / 2;
        let startY = y - ((hoverSelections[rectValues.NUM_ROWS] * (hoverSelections[rectValues.SPACE_BETWEEN_ROWS] + hoverSelections[rectValues.ROW_HEIGHT])) * locationData.length) / 2

        rectangle(dataType, interval, locationData, x, y, false, p5, hoverSelections, startX, startY, opaque, false, yearIndication, fillMissing, colourTheme)
    }

    const setup = (p5, parent) => {
        p5.createCanvas(mapWidth, mapHeight).parent(parent)
        setP5(p5)
    }

    const draw = (p5) => {
        p5.noLoop()
    }

    const mouseMoved = (p5) => {
        let hoverFound = { found: false, distance: null, index: null }
        let pinAdjustment = 0

        if (mapPin) {
            pinAdjustment = getPinAdjustment(selections, shape)
        }

        locationPins.forEach((pin, index) => {
            let location = map.latLngToContainerPoint([pin.lat, pin.long])
            if (Math.abs(p5.mouseX - location.x) < pin.minDistanceX && Math.abs(p5.mouseY - location.y + pinAdjustment) < pin.minDistanceY) {
                let distance = Math.pow(Math.abs(p5.mouseX - location.x), 2) + Math.pow(Math.abs(p5.mouseY - location.y + pinAdjustment), 2)
                if (!hoverFound.found || distance < hoverFound.distance) {
                    hoverFound = { found: true, distance, index }
                }
            }
        })

        if (hoverFound.found) {
            setHover(hoverFound.index)
        } else {
            setHover(null)
        }
    }

    const mouseClicked = (p5) => {
        let pinAdjustment = 0

        if (mapPin) {
            pinAdjustment = getPinAdjustment(selections, shape)
        }

        if (p5.mouseX > 20 && p5.mouseX < 50 && p5.mouseY > 20 && p5.mouseY < 50) {
            map.zoomIn(0.5)

        } else if (p5.mouseX > 20 && p5.mouseX < 50 && p5.mouseY > 50 && p5.mouseY < 80) {
            map.zoomOut(0.5)
        } else {
            let locationFound = { found: false, distance: null, index: null }
            locationPins.forEach((pin, index) => {
                let location = map.latLngToContainerPoint([pin.lat, pin.long])
                if (Math.abs(p5.mouseX - location.x) < pin.minDistanceX && Math.abs(p5.mouseY - location.y + pinAdjustment) < pin.minDistanceY) {
                    let distance = Math.pow(Math.abs(p5.mouseX - location.x), 2) + Math.pow(Math.abs(p5.mouseY - location.y + pinAdjustment), 2)
                    if (!locationFound.found || distance < locationFound.distance) {
                        locationFound = { found: true, distance, index }
                    }
                }
            })

            if (locationFound.found) {
                let pin = locationPins[locationFound.index]
                let allDisplayed = true
                pin.locations.forEach(id => {
                    if (!detailed.includes(id)) {
                        allDisplayed = false
                    }
                })

                if (allDisplayed) {
                    let newDetailed = [...detailed]
                    pin.locations.forEach(id => {
                        let index = newDetailed.indexOf(id)
                        newDetailed.splice(index, 1)
                    })
                    setDetailed(newDetailed)
                } else {
                    let newDetailed = [...detailed]
                    pin.locations.forEach(id => {
                        if (!detailed.includes(id)) {
                            newDetailed.push(id)
                        }
                    })

                    setDetailed(newDetailed)
                    // let { spiralWidth, spiralTightness } = getSpiralSize(selections, getHoverTransform(locationPins[index].locations.length))

                    // const newSelections = {
                    //     ...selections,
                    //     [spiralValues.SPIRAL_WIDTH]: spiralWidth,
                    //     [spiralValues.SPACE_BETWEEN_SPIRAL]: spiralTightness
                    // }

                    // setAnimated({ ...animated, index, x: locationPins[index].x, y: locationPins[index].y - getRadius(newSelections), width: spiralWidth / 2 })
                }
            }
        }
    }

    const redrawOverlay = () => {
        p5.clear()
        drawGlyphs()

        drawZoom()
        drawLegend(p5, mapWidth / 2, mapHeight - 40, selections, interval, dataType, null, colourTheme.textColour)
        if (detailed.length) {
            drawDetailed()
        }
    }

    const drawGlyphs = () => {
        locationPins.forEach((pin, index) => {
            let location = map.latLngToContainerPoint([pin.lat, pin.long])
            if (index !== hover) {
                p5.image(pin.pg, location.x - pin.width / 2, location.y - pin.height / 2)
            }
        })

        if (hover !== null) {
            let pin = locationPins[hover]
            let location = map.latLngToContainerPoint([pin.lat, pin.long])
            let hoverpg = p5.createGraphics(pin.width, pin.height)
            hoverpg.image(pin.pg, 0, 0, pin.width * 1.5, pin.height * 1.5)
            p5.image(hoverpg, location.x - pin.width * 0.75, location.y - pin.height * 0.75)

            let names = []
            pin.locations.forEach(id => {
                names.push(locations[id].name)
            })

            p5.textAlign(p5.CENTER, p5.TOP)
            p5.fill(colourTheme.textColour)
            p5.text(formatNames(names), location.x, location.y + pin.minDistanceY)
            console.log(pin.minDistanceY)
        }
    }

    const resetPins = () => {
        if (cluster) {
            resetClusters()
        } else {
            setPins()
        }
    }

    const resetClusters = () => {
        const clusters = calculateClusters(locations, selections, shape, mapPin, map)
        setLocationPins(updateGlyphs(clusters))
    }

    const setPins = () => {
        const pins = addLocations(locations, selections, shape, mapPin, map)
        setLocationPins(updateGlyphs(pins))
    }

    const updateGlyphs = (pins) => {
        let glyphs = []

        pins.forEach(pin => {
            let { pg, width, height } = getGlyph(p5, pin, data, interval, selections, colourTheme, fillMissing, mapPin, opaque, shape, yearIndication, cluster)
            glyphs.push({ ...pin, pg, width, height })
        })

        return glyphs
    }

    const drawZoom = () => {
        p5.fill(255)
        p5.stroke(50)
        p5.rect(20, 20, 30, 30)
        p5.rect(20, 50, 30, 30)

        p5.fill(0)
        p5.textSize(10)
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.text("+", 35, 35)
        p5.text("-", 35, 65)
        p5.noStroke()
    }

    const drawDetailed = () => {
        let newSelections = selections
        if (shape !== shapes.RECT.id) {
            newSelections = getDefaultSelections(shapes.RECT.id, view)
            newSelections = {
                ...newSelections,
                [rectValues.NUM_COLOURS]: selections[rectValues.NUM_COLOURS],
                [rectValues.DAY_WIDTH]: 0.25,
            }
        }

        const { pinHeight } = getRowSize(newSelections, detailed.length, selections[rectValues.NUM_YEARS])
        const locationHeight = pinHeight + 30

        p5.fill(colourTheme.background)
        p5.rect(mapWidth - 150, 0, 150, locationHeight * detailed.length)
        p5.textAlign(p5.LEFT, p5.TOP)

        detailed.forEach((id, index) => {
            p5.fill(colourTheme.textColour)
            p5.textSize(10)
            p5.text(locations[id].name, mapWidth - 150, index * locationHeight)
            drawDetailedRect(mapWidth - 75, index * locationHeight + pinHeight / 2 + 15, id, newSelections)
        })
    }

    return (
        <div className="position-absolute fixed-top">
            <Sketch draw={draw} mouseClicked={mouseClicked} mouseMoved={mouseMoved} setup={setup} />
        </div >
    )
}

export default Overlay