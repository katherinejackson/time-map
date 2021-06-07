import { colours } from "./constants";
import { getColour, sortData } from "./helpers";

export const drawBarChart = (p5, data, x, y) => {
    data.forEach((year, yearIndex) => {
        year.forEach((pt, index) => {
            const colour = getColour(pt)
            p5.fill(colour[0], colour[1], colour[2])
            p5.rect(x + index, y - pt/2 + yearIndex * 20, 1, pt/2)
        })
    })
}

export const drawModifiedHorizonChart = (p5, data, x, y) => {
    data.forEach((year, yearIndex) => {
        year.forEach((pt, index) => {
            const colour = getColour(pt)
            p5.fill(colour[0], colour[1], colour[2])
            p5.rect(x + index, y - Math.abs(pt/2) + yearIndex * 20, 1, Math.abs(pt/2))
        })
    })
}

export const drawHorizonChart = (p5, data, x, y) => {
    const chartSpacing = 20;
    data.forEach((year, yearIndex) => {
        year.forEach((pt, index) => {
            if (pt < -15) {
                p5.fill(0, 220, 220)
                p5.rect(x + index, y + yearIndex * chartSpacing - 15, 1, 15)
                p5.fill(0, 0, 220)
                p5.rect(x + index, y + yearIndex * chartSpacing - (Math.abs(pt) - 15), 1, Math.abs(pt) - 15)
            } else if (pt < 0) {
                p5.fill(0, 220, 220)
                p5.rect(x + index, y - Math.abs(pt) + yearIndex * chartSpacing, 1, Math.abs(pt))
            } else if (pt > 15) {
                p5.fill(220, 220, 0)
                p5.rect(x + index, y - 15 + yearIndex * chartSpacing, 1, 15)
                p5.fill(220, 0, 0)
                p5.rect(x + index, y + yearIndex * chartSpacing - (Math.abs(pt) - 15), 1, Math.abs(pt) - 15)
            } else if (pt >= 0) {
                p5.fill(220, 220, 0)
                p5.rect(x + index, y + yearIndex * chartSpacing - Math.abs(pt), 1, Math.abs(pt))
            }
        })
    })
}

export const drawRowColoredLineChart = (p5, data, x, y) => {
    data.forEach((year, yearIndex) => {
        year.forEach((pt, index) => {
            if (index !== 0) {
                const colour = getColour(pt)
                p5.stroke(colour[0], colour[1], colour[2])
                p5.line(x + index, y - pt/2 + yearIndex * 20, x + index - 1, y - year[index -1]/2 + yearIndex * 20)
            }
        })
    })
    p5.noStroke()
}

export const drawWindowBarChart = (p5, data, start, x, y) => {
    p5.rect(x, y, 10, 30)
    p5.rect(x + 375, y, 10, 30)

    x = x + 10
    y = y + 15
    const allData = [].concat.apply([], data)
    data.forEach(year => {
        allData.concat(year)
    })
    let counter = 0
    for (let index = start; index < start + 365; index++) {
        const colour = getColour(allData[index])
        p5.fill(colour[0], colour[1], colour[2])
        p5.rect(x + counter, y - allData[index], 1, allData[index])
        counter++
    }
    const sliced = allData.slice(start, start + 365)
    drawTotalsBarGraph(p5, [sliced], x, y + 30)
}

export const drawScatterPlot = (p5, data, x, y) => {
    data.forEach((year, yearIndex) => {
        year.forEach((pt, index) => {
            const colour = getColour(pt, yearIndex)
            p5.fill(colour[0], colour[1], colour[2])
            p5.ellipse(x + index, y - pt, 1, 1)
        })
    })
}

export const drawColourLineChart = (p5, data, x, y) => {
    data.forEach((year, yearIndex) => {
        year.forEach((pt, index) => {
            if (index !== 0) {
                const colour = getColour(pt, yearIndex)
                p5.stroke(colour[0], colour[1], colour[2])
                p5.line(x + index, y - pt, x + index - 1, y - year[index -1])
            }
        })
    })
    p5.noStroke()
}

export const drawLineChart = (p5, data, x, y) => {
    data.forEach((year, yearIndex) => {
        p5.stroke(colours[yearIndex])
        year.forEach((pt, index) => {
            if (index !== 0) {
                p5.line(x + index, y - pt, x + index - 1, y - year[index -1])

            }
        })
    })
    p5.noStroke()
}

export const drawTotalsBarGraph = (p5, data, x, y) => {
    data.forEach((year, index) => {
        const sorted = [0, 0, 0, 0]
        year.forEach(pt => {
            sorted[sortData(pt)] += 1
        })

        p5.fill(0, 0, 220)
        p5.rect(x, y + index * 4, sorted[0], 3)

        p5.fill(0, 220, 220)
        p5.rect(x + sorted[0], y + index * 4, sorted[1], 3)

        p5.fill(220, 220, 0)
        p5.rect(x + sorted[0] + sorted[1], y + index * 4, sorted[2], 3)

        p5.fill(220, 0, 0)
        p5.rect(x + sorted[0] + sorted[1] + sorted[2], y + index * 4, sorted[3], 3)
    })

}

export const drawCircularHeatGraph = (p5, data, x, y) => {
    p5.noStroke()
    data.forEach((pt, index) => {
        const colour = getColour(pt)
        p5.fill(colour[0], colour[1], colour[2])
        p5.rect(x + index, y, 1, 10)
    })
}

export const drawRadialHeatGraph = (p5, data, x, y) => {
    p5.noStroke()
    data.forEach((pt, index) => {
        const colour = getColour(pt)
        p5.fill(colour[0], colour[1], colour[2])
        p5.arc(x, y, 80, 80, index * 0.017214, index * 0.017214 + 0.017214, p5.PIE)
    })
}