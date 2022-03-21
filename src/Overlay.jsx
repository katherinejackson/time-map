import Sketch from "react-p5";
import React, { useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";

import { drawLegend } from "./legend";
import { getLocationData } from "./helpers/data";
import { getDefaultSelections } from "./helpers/selections";
import { shapes, themeColours } from "./constants";
import { getRoundedInterval } from "./helpers/intervals";
import { calculateClusters, addLocations } from "./helpers/cluster";
import { row, getRowSize, getPinAdjustment, getShapeSize } from "./shapes";
import DataContext from "./DataContext";
import { getGlyph } from "./helpers/mapCanvas";
import { formatNames } from "./helpers/format";
import { onClick, onHover, onZoom } from "./helpers/studyEventHandlers";

// Displays the pins (w/ hover capability) that are positioned on the map
const Overlay = ({ encoding, selections, shape, mapWidth, mapHeight }) => {

    selections['numYears'] = 2
    
    const map = useMap()
    const { locations, data, dataBrackets, dataType } = useContext(DataContext)
    const { mapPin, theme, cluster } = selections
    const [shouldCluster, setShouldCluster] = useState(cluster)
    const colourTheme = themeColours[theme]
    const [p5, setP5] = useState(null)
    const interval = getRoundedInterval(dataBrackets, selections.numColours)
    const [locationPins, setLocationPins] = useState([])
    const [detailed, setDetailed] = useState([])
    const [hover, setHover] = useState(null)
    const { width, height, maxRadius } = getShapeSize(selections, shape, 365)

    useEffect(() => {
        if (locations && p5) {
            resetPins()
            setShouldCluster(cluster)
        }

    }, [p5, shape, cluster])

    useEffect(() => {
        if (p5 && locationPins.length && cluster === shouldCluster) {
            setLocationPins(updateGlyphs(locationPins))
        }
    }, [map, encoding, selections])

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
                onZoom(map.getZoom())
            })
        }
    }, [p5, locationPins, detailed, cluster, shape])

    const drawDetailedRect = (x, y, id, detailedSelections) => {
        let locationData = getLocationData(id, selections, data)
        const { rowWidth, pinHeight } = getRowSize(detailedSelections, 365)
        const startX = x - rowWidth / 2;
        const startY = y - pinHeight / 2

        row(p5, dataType, interval, locationData, x, y, startX, startY, detailedSelections, encoding)
    }

    const setup = (p5, parent) => {
        p5.createCanvas(mapWidth, mapHeight).parent(parent)
        setP5(p5)
    }

    const draw = (p5) => {
        p5.noLoop()
    }

    const mouseMoved = (p5) => {
        let hoverFound = { distance: null, index: null }
        let pinAdjustment = 0
        const xTolerance = shape === 1 ? maxRadius * 3 : width * 1.5
        const yTolerance = shape === 1 ? maxRadius * 3 : height * 2

        if (mapPin) {
            pinAdjustment = getPinAdjustment(selections, shape)
        }

        // if user is already hovering, give them a lot of tolerance to keep that hover
        if (hover !== null) {
            let pin = locationPins[hover]
            let location = map.latLngToContainerPoint([pin.lat, pin.long])
            if (Math.abs(p5.mouseX - location.x) < xTolerance && Math.abs(p5.mouseY - location.y + pinAdjustment) < yTolerance) {
                let distance = Math.pow(Math.abs(p5.mouseX - location.x), 2) + Math.pow(Math.abs(p5.mouseY - location.y + pinAdjustment), 2)
                hoverFound = { distance, index: hover }
            }
        }
        
        locationPins.forEach((pin, index) => {
            let location = map.latLngToContainerPoint([pin.lat, pin.long])
            if (Math.abs(p5.mouseX - location.x) < width/2 && Math.abs(p5.mouseY - location.y + pinAdjustment) < height/2) {
                let distance = Math.pow(Math.abs(p5.mouseX - location.x), 2) + Math.pow(Math.abs(p5.mouseY - location.y + pinAdjustment), 2)
                if (!hoverFound.found || distance < hoverFound.distance) {
                    hoverFound = { distance, index }
                }
            }
        })

        if (hoverFound.index && hoverFound.index !== hover) {
            onHover(locationPins[hoverFound.index]['name'])
        }

        if (hoverFound.index !== hover) {
            setHover(hoverFound.index)
        }
    }

    const mouseClicked = (p5) => {
        let pinAdjustment = 0

        if (mapPin) {
            pinAdjustment = getPinAdjustment(selections, shape)
        }

        // if (p5.mouseX > 20 && p5.mouseX < 50 && p5.mouseY > 20 && p5.mouseY < 50) {
        //     map.zoomIn(0.5)

        // } else if (p5.mouseX > 20 && p5.mouseX < 50 && p5.mouseY > 50 && p5.mouseY < 80) {
        //     map.zoomOut(0.5)
        // } else {

        if (hover !== null) {
            let val = locationPins[hover]['name']
            onClick(val)
            // let pin = locationPins[locationFound.index]
            // let allDisplayed = true
            // pin.locations.forEach(id => {
            //     if (!detailed.includes(id)) {
            //         allDisplayed = false
            //     }
            // })

            // if (allDisplayed) {
            //     let newDetailed = [...detailed]
            //     pin.locations.forEach(id => {
            //         let index = newDetailed.indexOf(id)
            //         newDetailed.splice(index, 1)
            //     })
            //     setDetailed(newDetailed)
            // } else {
            //     let newDetailed = [...detailed]
            //     pin.locations.forEach(id => {
            //         if (!detailed.includes(id)) {
            //             newDetailed.push(id)
            //         }
            //     })

            //     setDetailed(newDetailed)
            // }
            // }
        }
    }

    const redrawOverlay = () => {
        p5.clear()
        drawGlyphs()
        // drawZoom()
        drawLegend(p5, selections, dataBrackets, shape, encoding, interval, dataType, mapWidth-230)

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

            let mag = 5
            let shiftAmount = 5
            if (selections.spiralWidth === 5) {
                mag = 6
                shiftAmount = 12
            }

            if (!mapPin) {
                p5.fill(colourTheme.background, 200)
                p5.noStroke()
                if (shape === shapes.SPIRAL.id) {
                    p5.ellipse(location.x, location.y, maxRadius * mag, maxRadius * mag)
                } else if (shape === shapes.ROW.id) {
                    p5.rect(location.x - width * 1.5, location.y - height * 2, width * 3, height * 4)
                }
            }

            p5.image(hoverpg, location.x - pin.width * 0.75, location.y - pin.height * 0.75)

            let names = []
            pin.locations.forEach(id => {
                names.push(locations[id].name)
            })

            p5.textAlign(p5.CENTER, p5.TOP)
            p5.fill(colourTheme.textColour)
            p5.noStroke()
            if (mapPin) {
                p5.text(formatNames(names), location.x, location.y)
            } else {
                p5.text(formatNames(names), location.x, location.y + height * 0.75 + shiftAmount)
            }
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
            let { pg, width, height } = getGlyph(p5, pin, data, dataType, interval, shape, selections, encoding)
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
        let newSelections = getDefaultSelections(shapes.ROW.id)
        newSelections = {
            ...newSelections,
            numColours: selections.numColours,
            dayWidth: 0.25,
        }

        // const { pinHeight } = getRowSize(newSelections, detailed.length, newSelections.numYears)
        const { pinHeight } = getRowSize(newSelections, 365)
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
            <Sketch draw={draw} mouseMoved={mouseMoved} mouseClicked={mouseClicked} setup={setup} />
        </div >
    )
}

export default Overlay