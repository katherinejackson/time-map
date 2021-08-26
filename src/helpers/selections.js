import { shapes, themes } from '../constants'

const size = window?.options?.size || 'medium'

const defaultSizes = {
    spiral: {
        xsmall: {
            coreSize: 0,
            spiralWidth: 2,
            spiralTightness: 0.015,
        },
        small: {
            coreSize: 0,
            spiralWidth: 5,
            spiralTightness: 0.015,
        },
        medium: {
            coreSize: 0,
            spiralWidth: 15,
            spiralTightness: 0.02,
        },
        large: {
            coreSize: 0,
            spiralWidth: 15,
            spiralTightness: 0.03,
        },
        xlarge: {
            coreSize: 0,
            spiralWidth: 20,
            spiralTightness: 0.03,
        },
    },
    row: {
        xsmall: {
            dayWidth: 0.0625,
            rowHeight: 5,
            spaceBetween: 0,
        },
        small: {
            dayWidth: 0.125,
            rowHeight: 5,
            spaceBetween: 0,
        },
        medium: {
            dayWidth: 0.125,
            rowHeight: 15,
            spaceBetween: 0,
        },
        large: {
            dayWidth: 0.25,
            rowHeight: 20,
            spaceBetween: 0,
        },
        xlarge: {
            dayWidth: 0.25,
            rowHeight: 30,
            spaceBetween: 0,
        },
    }
}
export const getDefaultSelections = () => {
    let selections = {
        mapPin: false,
        opaque: false,
        // yearIndication: null,
        fillMissing: true,
        theme: themes.DARK.val,
        cluster: false,
        numYears: 1,
        numColours: 6,
    }

    return {...selections, ...getShapeSelections(shapes.SPIRAL.id), ...getShapeSelections(shapes.ROW.id)}
}

export const getShapeSelections = (shape) => {
    if (shape === shapes.SPIRAL.id) {
        return defaultSizes['spiral'][size]

    } else if (shape === shapes.ROW.id) {
        return defaultSizes['row'][size]
    }
}

export const getBasicSelectionOptions = () => {
    return {
        mapPin: { name: 'Map Pin', values: [true, false] },
        opaque: { name: 'Opaque Background', values: [true, false] },
        fillMissing: { name: 'Fill Missing Data', values: [true, false] },
        theme: { name: 'Theme', values: Object.keys(themes) },
        cluster: { name: 'Cluster Data Points', values: [true, false] },
        numYears: { name: 'Number of Years', values: [1, 2] },
        numColours: { name: 'Number of Colours', values: [1, 2, 3, 4, 5, 6, 7, 8, 360] },
    }
}

export const getShapeSelectionOptions = (shape) => {
    if (shape === shapes.SPIRAL.id) {
        return {
            coreSize: { name: 'Core Size', values: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
            spiralWidth: { name: 'Spiral Width', values: [1, 2, 5, 10, 15, 20, 25, 30, 35] },
            spiralTightness: { name: 'Spiral Tightness', values: [0.01, 0.015, 0.02, 0.03, 0.04] }
        }
    } else if (shape === shapes.ROW.id) {
        return {
            dayWidth: { name: 'Day Width', values: [0.03125, 0.0625, 0.125, 0.25, 0.5] },
            rowHeight: { name: 'Row Height', values: [1, 2, 5, 10, 15, 20, 25, 30] },
            spaceBetween: { name: 'Space between Rows', values: [0, 1, 2, 3, 4, 5] }
        }
    }
}

export const getAllOptions = (shape) => {
    const basicOpts = getBasicSelectionOptions()
    const shapeOpts = getShapeSelectionOptions(shape)
    return { ...basicOpts, ...shapeOpts }
}