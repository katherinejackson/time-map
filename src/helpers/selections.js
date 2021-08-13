import { shapes, themeColours, themes } from '../constants'

export const getDefaultSelections = (shape) => {
    let selections = {
        mapPin: false,
        opaque: false,
        // yearIndication: null,
        fillMissing: true,
        theme: themeColours[themes.DARK.val],
        cluster: false,
        numYears: 1,
        numColours: 6,
    }

    if (shape === shapes.SPIRAL.id) {
        selections['coreSize'] = 4
        selections['spiralWidth'] = 20
        selections['spiralTightness'] = 0.02
    } else if (shape === shapes.ROW.id) {
        selections['dayWidth'] = 0.25
        selections['rowHeight'] = 25
        selections['spaceBetween'] = 0
    }

    return selections
}

export const getBasicSelectionOptions = () => {
    return {
        mapPin: { name: 'Map Pin', values: ['true', 'false'] },
        opaque: { name: 'Opaque Background', values: ['true', 'false'] },
        fillMissing: { name: 'Fill Missing Data', values: ['true', 'false'] },
        theme: { name: 'Theme', values: Object.keys(themes) },
        cluster: { name: 'Cluster Data Points', values: ['true', 'false'] },
        numYears: { name: 'Number of Years', values: [1, 2] },
        numColours: { name: 'Number of Colours', values: [1, 2, 3, 4, 5, 6, 7, 8, 256, 360] },
    }
}

export const getShapeSelectionOptions = (shape) => {
    if (shape === shapes.SPIRAL.id) {
        return {
            coreSize: { name: 'Core Size', values: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
            spiralWidth: { name: 'Spiral Width', values: [1, 5, 10, 15, 20, 25, 30, 35] },
            spiralTightness: { name: 'Spiral Tightness', values: [0.01, 0.015, 0.02, 0.025, 0.03] }
        }
    } else if (shape === shapes.ROW.id) {
        return {
            dayWidth: { name: 'Day Width', values: [0.0625, 0.125, 0.25, 0.5] },
            rowHeight: { name: 'Row Height', values: [1, 5, 10, 15, 20, 25, 30] },
            spaceBetween: { name: 'Space between Rows', values: [0, 1, 2, 3, 4, 5] }
        }
    }
}

export const getAllOptions = (shape) => {
    const basicOpts = getBasicSelectionOptions()
    const shapeOpts = getShapeSelectionOptions(shape)
    return { ...basicOpts, ...shapeOpts }
}