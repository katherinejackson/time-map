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
            spiralTightness: 0.02,
        },
        medium: {
            coreSize: 0,
            spiralWidth: 10,
            spiralTightness: 0.03,
        },
        large: {
            coreSize: 0,
            spiralWidth: 15,
            spiralTightness: 0.04,
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
            dayWidth: 0.11,
            rowHeight: 11,
            spaceBetween: 3,
        },
        medium: {
            dayWidth: 0.19,
            rowHeight: 19,
            spaceBetween: 4,
        },
        large: {
            dayWidth: 0.26,
            rowHeight: 26,
            spaceBetween: 5,
        },
        xlarge: {
            dayWidth: 0.25,
            rowHeight: 30,
            spaceBetween: 0,
        },
    }
}

export const migrationDefaultSizes = {
    spiral: {
        xsmall: {
            coreSize: 0,
            spiralWidth: 2,
            spiralTightness: 0.015,
        },
        small: {
            coreSize: 0,
            spiralWidth: 6,
            spiralTightness: 0.02,
        },
        medium: {
            coreSize: 0,
            spiralWidth: 11,
            spiralTightness: 0.03,
        },
        large: {
            coreSize: 0,
            spiralWidth: 15,
            spiralTightness: 0.04,
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
            dayWidth: 0.0725,
            rowHeight: 7,
            spaceBetween: 3,
        },
        medium: {
            dayWidth: 0.129,
            rowHeight: 12,
            spaceBetween: 4,
        },
        large: {
            dayWidth: 0.175,
            rowHeight: 17,
            spaceBetween: 5,
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
        numColours: 'rainbow',
    }

    return {...selections, ...getShapeSelections(shapes.SPIRAL.id), ...getShapeSelections(shapes.ROW.id)}
}

export const getShapeSelections = (shape) => {

    if (shape === shapes.SPIRAL.id) {
        return defaultSizes['spiral'][size]
    } 
    else if (shape === shapes.ROW.id) {
        return defaultSizes['row'][size]
    }
}

export const getMigrationSizes = (shape) => {

    if (shape === shapes.SPIRAL.id) {
        return migrationDefaultSizes['spiral'][size]
    } 
    else if (shape === shapes.ROW.id) {
        return migrationDefaultSizes['row'][size]
    }
}

export const getBasicSelectionOptions = () => {
    return {
        mapPin: { name: 'Map Pin', values: [true, false] },
        opaque: { name: 'Opaque Background', values: [true, false] },
        fillMissing: { name: 'Fill Missing Data', values: [true, false] },
        theme: { name: 'Theme', values: Object.keys(themes) },
        cluster: { name: 'Cluster Data Points', values: [true, false] },
        numYears: { name: 'Number of Years', values: [1, 2, 3] },
        numColours: { name: 'Number of Colours', values: ['rainbow', 'viridis', 'magma', 'redBlue'] },
    }
}

export const getShapeSelectionOptions = (shape) => {
    if (shape === shapes.SPIRAL.id) {
        return {
            coreSize: { name: 'Core Size', values: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
            spiralWidth: { name: 'Spiral Width', values: [1, 2, 5, 6, 10, 11, 15, 20, 25, 30, 35] },
            spiralTightness: { name: 'Spiral Tightness', values: [0.01, 0.015, 0.02, 0.03, 0.04] }
        }
    } else if (shape === shapes.ROW.id) {
        return {
            dayWidth: { name: 'Day Width', values: [0.03125, 0.0625, 0.0725, 0.11,, 0.129, 0.125, 0.175, 0.19, 0.25, 0.26, 0.5] },
            rowHeight: { name: 'Row Height', values: [1, 2, 5, 7, 10, 11, 12, 15, 17, 19, 20, 25, 26, 30] },
            spaceBetween: { name: 'Space between Rows', values: [0, 1, 2, 3, 4, 5] }
        }
    }
}

export const getAllOptions = (shape) => {
    const basicOpts = getBasicSelectionOptions()
    const shapeOpts = getShapeSelectionOptions(shape)
    return { ...basicOpts, ...shapeOpts }
}