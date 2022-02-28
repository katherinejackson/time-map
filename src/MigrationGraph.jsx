import React, { useState, useRef, useEffect, useContext } from "react";
import p5 from "p5";
import DataContext from "./DataContext";
import Sketch from "react-p5";
import background from "./data/layout-noblobs.png";

const canvasWidth = window.options ? 1200 : window.innerWidth * 0.95;
const canvasHeight = window.options ? 800 : window.innerHeight * 0.95;

const MigrationGraph = (props) => {

    const containerRef = useRef();
    const { data, dataBrackets, yBrackets, xBrackets, dataType } = useContext(DataContext);
    const [pts, setPts] = useState({});
    const [hover, setHover] = useState(null);
  
    const Sketch = (p) => {

        let backgroundImage;

  
      p.preload = () => {
        backgroundImage = p.loadImage(background);
      }
  
      p.setup = () => {
        p.createCanvas(canvasWidth, canvasHeight);
        p.textAlign(p.CENTER, p.CENTER);
        p.noLoop();
      };
  
      p.draw = () => {
          p.image(backgroundImage, 0, 0, canvasWidth, canvasHeight);
          console.log("data ", data)
          drawGlyphs();

      };


    const reset = () => {
        let newPts = {}

        // Object.keys(data).forEach(id => {
        //     let x = calcX(data[id]['human_development_index'])
        //     let y = calcY(id)

        //     const { pg, width, height } = getGlyph(id)
        //     newPts[id] = {
        //         name: data[id]['location'],
        //         x,
        //         y,
        //         pg,
        //         width,
        //         height,
        //     }
        // })

        // setPts(newPts)
    }


      const resetGlyphs = () => {
        // let newPts = {}

        // Object.keys(pts).forEach(id => {

        //     const { pg, width, height } = getGlyph(id)
        //     newPts[id] = {
        //         ...pts[id],
        //         pg,
        //         width,
        //         height,
        //     }
        // })

        // setPts(newPts)
    }

      const drawGlyphs = () => {
        //console.log(pts)
        // Object.keys(pts).forEach((id) => {
        //     let pt = pts[id]
        //     if (id !== hover) {
        //         // p5.image(pt.pg, pt.x - pt.width / 2, pt.y - pt.height / 2)
        //         p.image(pt.pg, pt.x - pt.width / 2, pt.y - pt.height / 2)
        //     }
        // })

        // if (hover !== null) {
        //     const pin = pts[hover]
        //     const hoverpg = p5.createGraphics(pin.width, pin.height)
        //     hoverpg.image(pin.pg, 0, 0, pin.width * 1.5, pin.height * 1.5)

        //     if (!mapPin) {
        //         p5.fill(colourTheme.pinBackground, 100)
        //         p5.noStroke()
        //         if (shape === shapes.SPIRAL.id) {
        //             p5.ellipse(pin.x, pin.y, maxRadius * 5, maxRadius * 5)
        //         } else if (shape === shapes.ROW.id) {
        //             p5.rect(pin.x - width * 1.5, pin.y - height * 2, width * 3, height * 4)
        //         }
        //     }

        //     p5.image(hoverpg, pin.x - pin.width * 0.75, pin.y - pin.height * 0.75)

        //     p5.textAlign(p5.CENTER, p5.TOP)
        //     p5.fill(colourTheme.textColour)
        //     p5.text(pin.name, pin.x, pin.y + height * 0.75 + 5)
        // }
    }
    };
  
    useEffect(() => {
      let inst = new p5(Sketch, containerRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => inst.remove();
    }, []);
    
    return (
      <div ref={containerRef}> </div>
    )
  };
  export default MigrationGraph;

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