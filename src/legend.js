import { colours, manualIntervals, themeColours, shapes, abbreviatedMonths, migrationYears } from './constants'
import { fillColourGradient, setColour } from "./helpers/colours";
import { formatNumbers, formatTradeNumbers } from './helpers/format';
import { drawSpiralMonth, getShapeSize, spiralOutline, legendGraphSpiral, drawMigrationSpiralYear, twoYearSpiralOutline } from './shapes';


export const drawLegend = (p5, selections, dataBrackets, shape, encoding, interval, dataType, canvasWidth) => {
    const legendWidth = 225
    const legendHeight = shape === 1 ? 150 : 100
    const colourLegendWidth = 225 + (225/3)
    const colourLegendHeight = 30
    let legendGraphics = p5.createGraphics(legendWidth, legendHeight)
    drawShapeLegend(legendGraphics, legendWidth, legendHeight, selections, dataBrackets, shape, encoding)
    p5.image(legendGraphics, canvasWidth - legendWidth, 0)

    let yearGraphics = p5.createGraphics(legendWidth/3, legendHeight)
    drawYearLegend(yearGraphics, legendWidth/3, legendHeight, selections, shape)
    p5.image(yearGraphics, canvasWidth - legendWidth - (legendWidth/3), 0)

    if (encoding !== 1) {
        let colourLegendGraphics = p5.createGraphics(colourLegendWidth, colourLegendHeight)
        drawColourLegend(colourLegendGraphics, colourLegendWidth, colourLegendHeight, selections, interval, dataType, dataBrackets, shape, encoding)
        p5.image(colourLegendGraphics, canvasWidth - colourLegendWidth, legendHeight)

        //p5.save(colourLegendGraphics, "clegend_scatter.png")
    }
}

export const drawMigrationLegend = (p5, selections, dataBrackets, shape, encoding, interval, dataType, canvasWidth, dataLength) => {
    const legendWidth = shape === 2 ? 350 : 255
    const legendHeight = shape === 1 ? 200 : 60
    const colourLegendWidth = shape === 2 ? 350 : 255
    const colourLegendHeight = 30
    let legendGraphics = p5.createGraphics(legendWidth, legendHeight)
    drawShapeMigrationLegend(legendGraphics, legendWidth, legendHeight, selections, dataBrackets, shape, encoding, dataLength)
    p5.image(legendGraphics, canvasWidth - legendWidth, 0)
    // p5.save(legendGraphics, "legend-MIGRATION_GRAPH.png");

    if (encoding !== 1) {
        let colourLegendGraphics = p5.createGraphics(colourLegendWidth, colourLegendHeight)
        drawColourLegend(colourLegendGraphics, colourLegendWidth, colourLegendHeight, selections, interval, dataType, dataBrackets, shape, encoding)
        p5.image(colourLegendGraphics, canvasWidth - colourLegendWidth, legendHeight - 15)
        //p5.save(colourLegendGraphics, "legend-mg.png");
    }

}
export const drawShapeLegend = (p5, width, height, selections, brackets, shape, encoding) => {
    const { theme } = selections
    const textColour = themeColours[theme].textColour
    const backgroundColour = themeColours[theme].pinBackground

    p5.fill(backgroundColour)
    p5.stroke(backgroundColour)
    p5.rect(0, 0, width, height)

    if (shape === 2) {
        drawRowLegend(p5, width, height, brackets, textColour, encoding)
    } else if (shape === 1) {
        drawSpiralLegend(p5, width, height, selections, brackets, encoding)
    }
}

export const drawYearLegend = (p5, width, height, selections, shape) => {
    const { theme } = selections
    const textColour = themeColours[theme].textColour
    const backgroundColour = themeColours[theme].pinBackground

    p5.fill(backgroundColour)
    p5.stroke(backgroundColour)
    p5.rect(0, 0, width, height)

    if (shape === 2) {
        drawRowYearLegend(p5, width, height, textColour)
    } else if (shape === 1) {
        drawSpiralYearLegend(p5, width, height, selections)
    }
}



export const drawShapeMigrationLegend = (p5, width, height, selections, brackets, shape, encoding, dataLength) => {
    const { theme } = selections
    const textColour = themeColours[theme].textColour
    const backgroundColour = themeColours[theme].pinBackground

    p5.fill(backgroundColour)
    p5.stroke(backgroundColour)
    p5.rect(0, 0, width, height)

    if (shape === 2) {
        drawMigrationRowLegend(p5, width, height, brackets, textColour, encoding, dataLength)
    } else if (shape === 1) {
        drawMigrationSpiralLegend(p5, width, height, selections, brackets, encoding, dataLength)
    }
}

export const drawColourLegend = (p5, legendWidth, legendHeight, selections, interval, dataType, brackets) => {
    const { theme, numColours } = selections
    const textColour = themeColours[theme].textColour
    const backgroundColour = themeColours[theme].pinBackground
    const width = legendWidth * 0.85
    const height = legendHeight * 0.3

    p5.fill(backgroundColour)
    p5.stroke(backgroundColour)
    p5.rect(0, 0, legendWidth, legendHeight)

    if (dataType === 'COVID' && numColours === 6) {
        drawManualIntervalLegend(p5, width, height, legendWidth, legendHeight, numColours, interval, dataType, textColour)
    } else if (numColours <= 2 || numColours > 10) {
        drawGradientLegend(p5, width, height, legendWidth, legendHeight, numColours, brackets, textColour)
    } else {
        drawIntervalLegend(p5, width, height, legendWidth, legendHeight, numColours, interval, dataType, textColour)
    }
}

export const drawIntervalLegend = (p5, width, height, legendWidth, legendHeight, numColours, interval, dataType, textColour) => {
    const length = width / numColours
    const xStart = (legendWidth - width) / 2
    const y = legendHeight / 2 - height
    let counter = 0

    p5.textSize(10)
    p5.noStroke()
    for (let i = interval.low; i < interval.high; i = Math.ceil((i + interval.interval) * 100) / 100) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        setColour(p5, i, numColours, interval, dataType)
        p5.rect(xStart + counter * length, y, length, height)
        p5.fill(0)

        p5.fill(textColour)
        p5.textAlign(p5.CENTER, p5.TOP)
        p5.text(Math.ceil(i), xStart + counter * length, legendHeight / 2)
        counter = counter + 1
    }

    p5.noStroke()
    p5.text(Math.ceil(interval.high), xStart + counter * length, legendHeight / 2)
}

export const drawGraphLegend = (p5, x, y, selections, dataType, textColour) => {
    p5.stroke(1)
    const numColours = Object.keys(manualIntervals[dataType])[0]
    const length = 75
    const xStart = x - numColours * length / 2
    const intervals = manualIntervals[dataType][numColours]
    let counter = 0

    p5.textSize(10)

    for (let i = 1; i < intervals.length; i++) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.fill(colours[dataType][numColours][i - 1])
        p5.rect(xStart + counter * length, y, length, 5)
        p5.fill(0)
        p5.line(xStart + counter * length, y, xStart + counter * length, y + 8)

        p5.noStroke()
        p5.fill(textColour)
        if (dataType === 'TRADE') {
            p5.text(formatTradeNumbers(intervals[i - 1]), xStart + counter * length, y + 15)
        } else {
            p5.text(intervals[i - 1], xStart + counter * length, y + 15)
        }

        p5.stroke(1)
        counter = counter + 1
    }

    p5.line(xStart + counter * length, y, xStart + counter * length, y + 8)
    p5.noStroke()
    p5.fill(textColour)

    if (dataType === 'TRADE') {
        p5.text(formatTradeNumbers(intervals[intervals.length - 1]), xStart + counter * length, y + 15)
    } else {
        p5.text(intervals[intervals.length - 1], xStart + counter * length, y + 15)
    }

}

export const drawManualIntervalLegend = (p5, width, height, legendWidth, legendHeight, numColours, interval, dataType, textColour) => {
    p5.stroke(1)
    const length = width / numColours
    const xStart = (legendWidth - width) / 2
    const yStart = legendHeight / 2 - height
    const intervals = manualIntervals[dataType][numColours]
    let counter = 0

    p5.textSize(10)

    for (let i = 1; i < intervals.length; i++) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        setColour(p5, i, numColours, interval, dataType)
        p5.rect(xStart + counter * length, yStart, length, height)
        p5.fill(0)
        p5.line(xStart + counter * length, yStart, xStart + counter * length, yStart + 8)

        p5.noStroke()
        p5.fill(textColour)
        p5.textAlign(p5.CENTER, p5.TOP)
        if (dataType === 'TRADE') {
            p5.text(formatTradeNumbers(intervals[i - 1]), xStart + counter * length, yStart + 15)
        } else {
            p5.text(formatNumbers(intervals[i - 1]), xStart + counter * length, legendHeight / 2)
        }

        p5.stroke(1)
        counter = counter + 1
    }

    p5.line(xStart + counter * length, yStart, xStart + counter * length, yStart + 8)
    p5.noStroke()
    p5.fill(textColour)

    if (dataType === 'TRADE') {
        p5.text(formatTradeNumbers(intervals[intervals.length - 1]), xStart + counter * length, yStart + 15)
    } else {
        p5.text(formatNumbers(intervals[intervals.length - 1]), xStart + counter * length, legendHeight / 2)
    }

    // p5.fill(200)
    // p5.rect(x + numColours * length / 2 + 50, yStart, 40, 10)
    // p5.fill(textColour)
    // p5.text('No Data', x + numColours * length / 2 + 50 + 20, yStart + 15)
}

const drawGradientLegend = (p5, width, height, legendWidth, legendHeight, numColours, brackets, textColour) => {
    const { high, low, range, displayLow, displayHigh } = brackets
    // const low = brackets.displayLow || brackets.low
    // const high = brackets.displayHigh || brackets.high
    const rectWidth = 1
    const xStart = (legendWidth - width) / 2
    const yStart = legendHeight / 2 - height

    const increase = range / width
    let counter = 0

    p5.noStroke()
    for (let i = low; i < high; i = i + increase) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        fillColourGradient(p5, i, brackets, numColours)
        p5.rect(xStart + counter, yStart, rectWidth, height)
        counter = counter + rectWidth
    }

    let newLow, newHigh;
    if (typeof(displayHigh) === 'undefined' || typeof(displayLow) === 'undefined') {
        newLow = low
        newHigh = high
    }
    else {
        newLow = displayLow
        newHigh = displayHigh
    }
    let increments = calculateIntervals(newLow, newHigh, 3, false)

    // let displayRange = displayHigh - displayLow
    // let incr = displayRange/3
    // let increments = [];

    // for (let i=displayLow; i<displayHigh; i+=incr) {
    //     increments.push(Math.round(i))
    // }
    // increments.push(displayHigh)
    // console.log(increments)

    p5.textSize(12)
    p5.fill(textColour)
    p5.textAlign(p5.CENTER, p5.TOP)
    increments.forEach(num => {
        let x = calcX(num, xStart, width, newLow, newHigh)
        p5.text(formatNumbers((Math.round(num * 10)/10)), x, legendHeight / 2 + 3)
    })


    // p5.text(formatNumbers(displayLow || low), xStart, legendHeight / 2)
    // p5.text(formatNumbers(displayHigh || high), xStart + width, legendHeight / 2)
}

const calculateIntervals = (low, high, intervalNum, rounded) => {
    let displayRange = high - low;


    let incr = displayRange/intervalNum;
    let increments = [];

    for (let i=low; i<=high; i+=incr) {
        if (rounded) increments.push(Math.round(i))
        else increments.push(i)
    }
    //increments.push(high)

    return increments;

}

const calcX = (num, startX, width, low, high) => {
    const dataRange = high - low
    const increment = width / dataRange

    // return startX + (num - low) * increment
    return startX + (num - low) * increment
}


export const drawLogarithmicLegend = (p5, x, y, textColour) => {
    const width = 2
    let colourList = colours['COVID'][256]
    const range = colourList.length * width
    const xStart = x - colourList.length / 2 * width

    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.noStroke()

    let counter = 0
    colourList.forEach(colour => {
        p5.fill(colour)
        p5.rect(xStart + counter, y, width, 5)
        counter = counter + width
    })

    let intervals = [1, 10, 100, 1000, 10000, 100000, 1000000]

    intervals.forEach(pt => {
        p5.fill(textColour)
        p5.text(pt, xStart + Math.log10(pt) / 6 * range, y + 15)
    })

    p5.fill(200)
    p5.rect(x + colourList.length / 2 * width + 50, y, 40, 10)
    p5.fill(textColour)
    p5.text('No Data', x + colourList.length / 2 * width + 50 + 20, y + 15)

}

export const drawLogarithmicGradientLegend = (p5, x, y, brackets, textColour) => {
    const width = 2
    const height = 5
    const range = brackets.high - brackets.low
    const xStart = x - 270 / 2 * width
    let counter = 0
    let increase = Math.ceil(range / 270)
    let interval = { highest: brackets.high, lowest: brackets.low, range: brackets.high - brackets.low }

    p5.noStroke()
    for (let i = brackets.low; i < brackets.high; i = i + increase) {
        p5.textAlign(p5.CENTER, p5.CENTER)
        fillColourGradient(p5, i, interval, 1)
        p5.rect(xStart + counter, y, width, height)
        counter = counter + width
    }

    let intervals = [1, 10, 100, 1000, 10000, 100000, 1000000]

    intervals.forEach(pt => {
        p5.fill(textColour)
        p5.text(pt, xStart + Math.log10(pt) / 6 * 270 * width, y + 15)
    })

    p5.fill(200)
    p5.rect(x + 270 / 2 * width + 50, y, 40, height)
    p5.fill(textColour)
    p5.text('No Data', x + 270 / 2 * width + 50 + 20, y + 15)
}

export const drawRowLegend = (p5, width, height, brackets, textColour, encoding) => {
    const lowString = formatNumbers(brackets.displayLow || brackets.low)
    const highString = formatNumbers(brackets.displayHigh || brackets.high)
    const low = brackets.displayLow || brackets.low
    const high = brackets.displayHigh || brackets.high
    const rectWidth = width * 0.7
    const rectHeight = height * 0.7
    const startX = (width - rectWidth) / 2
    const startY = (height - rectHeight) / 3

    p5.stroke(textColour)
    p5.noFill()
    p5.rect(startX, startY, rectWidth, rectHeight)

    p5.noStroke()
    p5.fill(textColour)
    p5.textSize(10)

    let increments = calculateIntervals(low, high, 2, false);
    // if (typeof(displayHigh) === 'undefined' && typeof(displayLow) === 'undefined') {
    //     increments = calculateIntervals(low, high, 2, true)
    // }
    // else {
    //     increments = calculateIntervals(low, high, 2, false)
    // }

    
    let positions = increments.map(i => calcX(i, startY, rectHeight, low, high)).reverse()

    if (encoding === 1 || encoding === 3) {
        p5.textAlign(p5.RIGHT, p5.BOTTOM)
        for (let i=0; i<increments.length; i++) {
            if (typeof(displayHigh) === 'undefined' && typeof(displayLow) === 'undefined') {
                p5.text(formatNumbers((Math.round(increments[i] * 10)/10)), startX - 5, positions[i] + 5)
            }
            else {
                p5.text(formatNumbers(increments[i]), startX - 5, positions[i] + 5)
            }
            
        }
        // increments.forEach(num => {
        //     let x = calcX(num, startY, rectHeight, low, high)
        //     console.log(x)
        //     p5.text(formatNumbers(num), startX - 5, x)
        // })


        // p5.text(lowString, startX - 5, startY + rectHeight)
        // p5.textAlign(p5.RIGHT, p5.TOP)
        // p5.text(highString, startX - 5, startY)
    }

    const spacePerMonth = rectWidth / 12
    for (let i = 0; i < 13; i++) {
        let x = startX + i * spacePerMonth
        p5.stroke(textColour, 100)
        p5.line(x, startY, x, startY + rectHeight)
        p5.noStroke()
    }

    p5.textAlign(p5.CENTER, p5.CENTER)
    for (let i = 0; i < 12; i++) {
        let x = startX + i * spacePerMonth + spacePerMonth / 2
        p5.textSize(6)
        p5.text(abbreviatedMonths[i], x, startY + rectHeight / 2)
    }
}

export const drawRowYearLegend = (p5, width, height, textColour) => {
    const rectWidth = width * 0.7
    const rectHeight = height * 0.7
    const startX = (width - rectWidth) - 7 
    const startY = (height - rectHeight) / 3
    const midX  = startX + (((startX + rectWidth) - startX)/2)
    const midY = startY + (((startY + rectHeight) - startY)/2)

    p5.stroke(textColour)
    p5.rect(startX, startY, rectWidth, rectHeight)
    p5.line(startX, midY, startX + rectWidth, midY)

    p5.fill(textColour)
    p5.noStroke()
    p5.text("2020", midX - 13, midY - 10)
    p5.text("2021", midX - 13, midY + 20)

}

export const drawSpiralYearLegend = (p5, width, height, selections) => {
    twoYearSpiralOutline(p5, width/2 + 6, height/2 ,selections)
    const { theme } = selections
    const textColour = themeColours[theme].textColour

    p5.textSize(8)
    p5.fill(textColour)
    p5.noStroke()
    p5.text("2020", width/2+ 7, height/3 + 10)
    p5.text("2021", width/2+ 7, height/3 - 5)
}

export const drawMigrationRowLegend = (p5, width, height, brackets, textColour, encoding, dataLength) => {
    const lowString = formatNumbers(brackets.displayLow || brackets.low)
    const highString = formatNumbers(brackets.displayHigh || brackets.high)
    const low = brackets.displayLow || brackets.low
    const high = brackets.displayHigh || brackets.high
    const rectWidth = width * 0.90
    const rectHeight = height * 0.5
    const startX = ((width - rectWidth) / 2) + 10
    const startY = (height - rectHeight) / 3

    p5.stroke(textColour)
    p5.noFill()
    p5.rect(startX, startY, rectWidth, rectHeight)

    p5.noStroke()
    p5.fill(textColour)
    p5.textSize(10)

    const increments = calculateIntervals(low, high, 2, false)
    let positions = increments.map(i => calcX(i, startY, rectHeight, low, high)).reverse()

    if (encoding === 1 || encoding === 3) {
        p5.textAlign(p5.RIGHT, p5.BOTTOM)
        for (let i=0; i<increments.length; i++) {
            p5.text(formatNumbers(increments[i]), startX - 5, positions[i] + 5)
        }
        // p5.textAlign(p5.RIGHT, p5.BOTTOM)
        // p5.text(lowString, startX - 5, startY + rectHeight)
        // p5.textAlign(p5.RIGHT, p5.TOP)
        // p5.text(highString, startX - 5, startY)
    }

    const spacePerMonth = rectWidth / (dataLength)
    for (let i = 0; i < dataLength; i++) {
        let x = startX + i * spacePerMonth
        p5.stroke(textColour, 100)
        p5.line(x, startY, x, startY + rectHeight)
        p5.noStroke()
    }

    p5.textAlign(p5.CENTER, p5.CENTER)

    for (let i = 0; i < dataLength; i++) {
        let x = startX + i * spacePerMonth + spacePerMonth / 2
        p5.textSize(6)
        // draw year labels horizonally
        for (let j=0; j< migrationYears[i]; j++) {
            p5.text(migrationYears[i][j], x, startY + (j*5) + (rectHeight/4))
        }
        
        
    }
}

export const drawSpiralLegend = (p5, legendWidth, legendHeight, selections, brackets, encoding) => {
    const lowString = formatNumbers(brackets.displayLow || brackets.low)
    const highString = formatNumbers(brackets.displayHigh || brackets.high)
    selections = { ...selections, ['coreSize']: 0, ['spiralWidth']: 20 }
    const { rightRadius, maxRadius, width, height } = getShapeSize(selections, shapes.SPIRAL.id, 365)

    const startX = encoding === 1 || encoding === 3 ? legendWidth * 0.30 : legendWidth / 2
    const startY = legendHeight / 2
    const textColour = themeColours[selections.theme].textColour


    spiralOutline(p5, startX, startY, selections)
    drawSpiralMonth(p5, startX, startY, selections)

    if (encoding === 1 || encoding === 3) {
        let mid;
        if (typeof(brackets.displayLow) === 'undefined' || typeof(brackets.displayHigh) === 'undefined') {
            mid = Math.round(((brackets.high - brackets.low)/2) * 10)/10
        }
        else mid = ((brackets.displayHigh - brackets.displayLow)/2)

     

        const x = legendWidth * 0.7
        const textColour = themeColours[selections.theme].textColour
        spiralOutline(p5, x, startY, selections)
        p5.stroke(textColour, 150)
        p5.line(x, startY, x + maxRadius-20, startY - 30)
        p5.line(x+(((x + (rightRadius-10)) - x)/2), startY, x + maxRadius-15, startY)
        p5.line(x + rightRadius-20, startY+20, x + maxRadius-10, startY+25)

        p5.fill(textColour)
        p5.noStroke()
        p5.textAlign(p5.LEFT, p5.CENTER)
        p5.textSize(10)
        p5.text(lowString, x + maxRadius-17, startY - 30)
        p5.text(formatNumbers(mid), x+maxRadius-14, startY)
        p5.text(highString, x + maxRadius -10, startY + 25)
    }
}

export const drawMigrationSpiralLegend = (p5, legendWidth, legendHeight, selections, brackets, encoding, dataLength) => {
    const lowString = formatNumbers(brackets.displayLow || brackets.low)
    const highString = formatNumbers(brackets.displayHigh || brackets.high)
    selections = { ...selections, ['coreSize']: 0, ['spiralWidth']: 20 }
    const { rightRadius, maxRadius, width, height } = getShapeSize(selections, shapes.SPIRAL.id, dataLength)

    const startX = encoding === 1 || encoding === 3 ? legendWidth * 0.37 : legendWidth / 2
    const startY = legendHeight / 2 + 10
    const textColour = themeColours[selections.theme].textColour


    spiralOutline(p5, startX, startY, selections, dataLength)
    drawMigrationSpiralYear(p5, startX, startY, selections, dataLength)

    if (encoding === 1 || encoding === 3) {
        let mid;
        if (typeof(brackets.displayLow) === 'undefined' || typeof(brackets.displayHigh) === 'undefined') {
            mid = (brackets.high - brackets.low)/2
        }
        else mid = (brackets.displayHigh - brackets.displayLow)/2

        const x = legendWidth * 0.78
        const textColour = themeColours[selections.theme].textColour
        spiralOutline(p5, x, startY, selections)
        p5.stroke(textColour, 150)
        p5.line(x, startY, x + maxRadius, startY - 20)
        p5.line(x + rightRadius + 8, startY+20, x + maxRadius-3, startY + 15)
        p5.line(x+(((x + rightRadius + 8) - x)/2), startY, x + maxRadius + 8, startY)

        p5.fill(textColour)
        p5.noStroke()
        p5.textAlign(p5.LEFT, p5.CENTER)
        p5.textSize(10)
        p5.text(lowString, x + maxRadius + 3, startY - 20)
        p5.text(formatNumbers(mid), x + maxRadius + 8, startY)
        p5.text(highString, x + maxRadius + 10, startY + 20)
    }
}

export const drawImportYearLegend = (p5, x, y, data, spiralSelections, background) => {
    p5.fill(background)
    p5.rect(x, y, 150, 150)

    legendGraphSpiral(p5, x +  60, y + 50, data['World']['data'], spiralSelections, background)

    // show legend for the trade balance colours
    p5.noStroke()
    p5.textSize(12)
    p5.fill("#59a14f")
    p5.ellipse(x, y + 135, 10, 10)
    p5.fill(0)
    p5.text("Positive trade balance", x + 70, y + 135)

    p5.fill('#e15759')
    p5.ellipse(x, y + 150, 10, 10)
    p5.fill(0)
    p5.text("Negative trade balance", x + 70, y + 150)

}