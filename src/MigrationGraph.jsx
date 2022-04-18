import React, { useState, useEffect, useContext } from "react";
import DataContext from "./DataContext";
import { scaleLinear } from "d3";
import Sketch from "react-p5";
import { drawMigrationLegend } from "./legend";
import { getRoundedInterval } from "./helpers/intervals";
import { filterMigrationData } from "./helpers/data";
import { migrationRow, getShapeSize,  getPinAdjustment, migrationSpiral } from "./shapes";
import { shapes, themeColours } from "./constants";
import { onClick, onHover } from "./helpers/studyEventHandlers";
import { getMigrationSizes } from "./helpers/selections";
import background from "./data/layout-noblobs.png";

const canvasWidth = window.options ? 1200 : window.innerWidth * 0.95;
const canvasHeight = window.options ? 800 : window.innerHeight * 0.95;

const magnification = 1;

const MigrationGraph = ({ encoding, selections, shape }) => {

    
    let newSizes = getMigrationSizes(shape);
    for (let val in newSizes) {
        selections[val] = newSizes[val];
    }
    selections['numYears'] = 1

    //console.log("selections: ", selections)

    const [p5, setP5] = useState(null)
    const { data, dataBrackets, yBrackets, xBrackets, dataType } = useContext(DataContext);
    const [backgroundImage, setBackgroundImage] = useState(null)
    const { theme, numColours, numYears, mapPin } = selections
    const [pts, setPts] = useState({});
    const [hover, setHover] = useState(null);
    const colourTheme = themeColours[theme]
    const { width, height, maxRadius } = getShapeSize(selections, shape, 410)
    const interval = getRoundedInterval(dataBrackets, numColours)

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
        //setBackgroundImage(p5.loadImage(background))
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
        let increments = [0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000]
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

            let mag = 5.5
            if (selections.spiralWidth === 5) mag = 12.5

            if (!mapPin) {
                p5.fill(colourTheme.pinBackground, 100)
                p5.noStroke()
                if (shape === shapes.SPIRAL.id) {
                    p5.ellipse(pin.x, pin.y, maxRadius * mag, maxRadius * mag)
                } else if (shape === shapes.ROW.id) {
                    p5.rect(pin.x - (width*magnification) * 1.5, pin.y - height * 2, (width * 3)*magnification, height * 4)
                }
            }

            p5.image(hoverpg, pin.x - pin.width * 0.75, pin.y - pin.height * 0.75)

            p5.textAlign(p5.CENTER, p5.TOP)
            p5.fill(colourTheme.textColour)
            //p5.text(pin.name, pin.x, pin.y + height * 0.75 + 7)
            let newName = pin.name.split(">").join(' \u2192\ ')
            p5.text(newName, pin.x, pin.y + height * 0.75 + 7)
        }
    }

    const getGlyph = (id) => {
        let canvasWidth = 500
        let canvasHeight = 500

        let pg = p5.createGraphics(canvasWidth, canvasHeight)
        pg.clear()
        pg.noStroke()

        const ptData = Object.values(data[id]["data"])
        //console.log(ptData)

        let duplicatedPts = [];
        for (let i=0; i<ptData.length; i++) {
            let times = 0;
            while (times < 10) {
                duplicatedPts.push(ptData[i])
                times += 1
            }
        }

        if (shape === shapes.SPIRAL.id) {
            migrationSpiral(pg, dataType, interval, duplicatedPts, canvasWidth / 2, canvasHeight / 2, selections, encoding, 1, id)
        } else if (shape === shapes.ROW.id) {
            migrationRow(pg, dataType, interval, duplicatedPts, canvasWidth / 2, canvasHeight / 2, selections, encoding, 1, id)
        }
       //p5.save(pg, "mgrownewmed1.png");


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
            if (Math.abs(pts[id]['x'] - p5.mouseX) < (width*magnification) / 2 && Math.abs(pts[id]['y'] - p5.mouseY + pinAdjustment) < height / 2) {
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

    return <Sketch preload={preload} setup={setup} draw={draw} mouseMoved={mouseMoved} mouseClicked={mouseClicked} />
}
export default MigrationGraph;

// const MigrationGraph = ({ encoding, selections, shape }) => {

//     const containerRef = useRef();
//     const { data, dataBrackets, yBrackets, xBrackets, dataType } = useContext(DataContext);
//     const { theme, numColours, numYears, mapPin } = selections
//     const [pts, setPts] = useState({});
//     const [hover, setHover] = useState(null);
//     const interval = getRoundedInterval(dataBrackets, numColours)

//     console.log("db ", dataBrackets)
  
//     const Sketch = (p) => {

//         let backgroundImage;

//         p.preload = () => {
//             backgroundImage = p.loadImage(background);
//         }
    
//         p.setup = () => {
//             console.log("sel ", selections)
//             console.log("shape ", shape)
//             console.log("encoding", encoding)
//             p.createCanvas(canvasWidth, canvasHeight);
//             console.log(canvasWidth, canvasHeight)
//             p.textAlign(p.CENTER, p.CENTER);

//             p.noLoop();
//         };
    
//         p.draw = () => {
//             p.image(backgroundImage, 0, 0, canvasWidth, canvasHeight);
//             reset();
//             drawGlyphs();

//         };


//     const reset = () => {
//         let newPts = {};
//         const xScale = scaleLinear()
//         .domain([0, 4002])
//         .range([0, 1799.3]);

//         const yScale = scaleLinear()
//         .domain([0, 1985])
//         .range([0, 1205.55]);

//         Object.keys(data).forEach(id => {
//             let x = xScale(data[id]["x"]);
//             let y = yScale(data[id]["y"])

//             const { pg, width, height } = getGlyph(id)
//             newPts[id] = {
//                 name: id,
//                 x,
//                 y,
//                 pg,
//                 width,
//                 height,
//             }
//         });
//         setPts(newPts);
//     }


//       const resetGlyphs = () => {
//         let newPts = {};
//         Object.keys(pts).forEach(id => {
//             const { pg, width, height } = getGlyph(id)
//             newPts[id] = {
//                 ...pts[id],
//                 pg,
//                 width,
//                 height,
//             }
//         });
//     }

//       const drawGlyphs = () => {
//         console.log(pts)
//         Object.keys(pts).forEach((id) => {
//             let pt = pts[id]
//             if (id !== hover) {
//                 // p5.image(pt.pg, pt.x - pt.width / 2, pt.y - pt.height / 2)
//                 p.image(pt.pg, pt.x - pt.width / 2, pt.y - pt.height / 2)
//             }
//         })

//         // if (hover !== null) {
//         //     const pin = pts[hover]
//         //     const hoverpg = p5.createGraphics(pin.width, pin.height)
//         //     hoverpg.image(pin.pg, 0, 0, pin.width * 1.5, pin.height * 1.5)

//         //     if (!mapPin) {
//         //         p5.fill(colourTheme.pinBackground, 100)
//         //         p5.noStroke()
//         //         if (shape === shapes.SPIRAL.id) {
//         //             p5.ellipse(pin.x, pin.y, maxRadius * 5, maxRadius * 5)
//         //         } else if (shape === shapes.ROW.id) {
//         //             p5.rect(pin.x - width * 1.5, pin.y - height * 2, width * 3, height * 4)
//         //         }
//         //     }

//         //     p5.image(hoverpg, pin.x - pin.width * 0.75, pin.y - pin.height * 0.75)

//         //     p5.textAlign(p5.CENTER, p5.TOP)
//         //     p5.fill(colourTheme.textColour)
//         //     p5.text(pin.name, pin.x, pin.y + height * 0.75 + 5)
//         // }
//     }
//     const getGlyph = (id) => {
//         let canvasWidth = 500
//         let canvasHeight = 500

//         let pg = p.createGraphics(canvasWidth, canvasHeight)
//         pg.clear()
//         pg.noStroke()

//         const ptData = Object.values(data[id]["data"])

//         if (shape === shapes.SPIRAL.id) {
//             migrationSpiral(pg, dataType, interval, ptData, canvasWidth / 2, canvasHeight / 2, selections, encoding)
//         } else if (shape === shapes.ROW.id) {
//             migrationRow(pg, dataType, interval, ptData, canvasWidth / 2, canvasHeight / 2, selections, encoding)
//         }

//         return { pg, width: canvasWidth, height: canvasHeight }
//     }
//     };
  
//     useEffect(() => {
//       let inst = new p5(Sketch, containerRef.current);
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//       return () => inst.remove();
//     }, [encoding, selections, shape]);
    
//     return (
//       <div ref={containerRef}> </div>
//     )
//   };
//   export default MigrationGraph;

// const MigrationGraph = (props) => {
//     const [p5, setP5] = useState(null)
//     let backgroundImage;

//     // const preload = (p5) => {
//     //     backgroundImage = p5.loadImage(background)
//     // }

//     const setup = (p5, parent) => {
//         setP5(p5)
//         p5.createCanvas(canvasWidth, canvasHeight).parent(parent)
//         p5.textAlign(p5.CENTER, p5.CENTER)
        
//         // I've also tried loading the image this way
//         // p5.loadImage("./layout-noblobs.png", img => {
//         //     //backgroundImage = img;
//         //     p5.image(img, 0, 0, canvasWidth, canvasHeight)
//         //     p5.redraw();
//         // })

//         p5.noLoop();
        
//     }

//     const draw = (p5) => {

//         p5.loadImage("./layout-noblobs.png", img => {
//             //backgroundImage = img;
//             p5.image(img, 0, 0, canvasWidth, canvasHeight)
//             p5.redraw();
//         })
//         // p5.image(backgroundImage, 0, 0, canvasWidth, canvasHeight)
//     }

//     return <Sketch setup={setup} draw={draw} />
// }
// export default MigrationGraph;