import Sketch from "react-p5";
import { drawManualLegend } from "./legend";
import { scatterSpiral} from "./shapes";

const canvasWidth = window.innerWidth * 0.95
const canvasHeight = window.innerHeight * 0.75

const Canvas = ({
    data,
    dataBrackets,
    yBrackets,
    categories,
}) => {
    const calcCategories = () => {
        let xCounters = {}
        let prev = 50

        Object.keys(categories).forEach(cat => {
            xCounters[cat] = prev
            prev += 50 * categories[cat] + 80
        })

        return xCounters
    }

    let xCounters = calcCategories()



    const setup = (p5, parent) => {
        p5.createCanvas(canvasWidth, canvasHeight).parent(parent)
        p5.rect(0, 0, canvasWidth, canvasHeight)
        p5.textAlign(p5.CENTER, p5.CENTER)
    }

    const drawSpiral = (p5, entry) => {
        let data = entry['cases']['2020']
        let x = xCounters[entry['continent']]
        let y = canvasHeight - 50 - (entry['population'] * (canvasHeight - 70) / yBrackets.high)

        scatterSpiral(p5, x, y, data, dataBrackets.high, dataBrackets.low)

        p5.fill(0)
        p5.text(entry['location'], x, y + 20)
        xCounters[entry['continent']] = xCounters[entry['continent']] + 50
    }

    const draw = (p5) => {
        p5.clear()
        p5.stroke(50)
        p5.line(20, canvasHeight - 50, canvasWidth, canvasHeight - 50)
        p5.line(20, canvasHeight - 50, 20, 0)

        Object.keys(categories).forEach(cat => {
            if (xCounters[cat] > 50) {
                p5.stroke(50)
                p5.line(xCounters[cat] - 40, canvasHeight - 50, xCounters[cat] - 40, 0)
            }

            p5.noStroke()
            p5.fill(0)
            p5.text(cat, xCounters[cat] + 50 * categories[cat]/2, canvasHeight - 40)
        })

        Object.keys(data).forEach(id => {
            drawSpiral(p5, data[id])
        })

        drawManualLegend(p5, canvasWidth/2, canvasHeight - 25, dataBrackets, 'COVID')

        p5.noLoop()
    }

    return <Sketch setup={setup} draw={draw}/>
}

export default Canvas