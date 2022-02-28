import React, { useState, useRef, useEffect } from "react";
import p5 from "p5";
import Sketch from "react-p5";
import background from "./data/layout-noblobs.png"

const canvasWidth = window.options ? 1200 : window.innerWidth * 0.95
const canvasHeight = window.options ? 800 : window.innerHeight * 0.95

const MigrationGraph = (props) => {

    const containerRef = useRef();
  
    const Sketch = (p) => {

        let backgroundImage;

  
      p.preload = () => {
        backgroundImage = p.loadImage(background)
      }
  
      p.setup = () => {
        p.createCanvas(canvasWidth, canvasHeight);
        p.textAlign(p.CENTER, p.CENTER)
        p.noLoop();
      };
  
      p.draw = () => {
          p.image(backgroundImage, 0, 0, canvasWidth, canvasHeight)

      };
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