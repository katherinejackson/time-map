export const canvasSize = 200

export const radianPerDay = 0.01721420632

export const radianPerMonth = 0.52359877559

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

export const abbreviatedMonths = ["JA", "FE", "MR", "AL", "MA", "JN", "JL", "AU", "SE", "OC", "NO", "DE"]

export const monthColours = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]

//TODO: these colours are bad
export const colours = {
    TEMP: {
        3: ['#FF0000', '#00FF00', '#0000FF'],
        4: ['#FF0000', '#FFFF00', '#00FF00','#0000FF'],
        5: ['#FF0000', '#FFFF00', '#00FF00','#0000FF', '#00FFFF'],
        6: ['#FF0000', '#FF8000', '#FFFF00', '#00FF00','#0000FF', '#00FFFF'],
        7: ['#FF00FF', '#FF0000', '#FF8000', '#FFFF00', '#00FF00','#0000FF', '#00FFFF'],
        8: ['#FF00FF', '#FF0000', '#FF8000', '#FFFF00', '#00FF00','#0000FF', '#00FFFF', '#8000FF'],
    },
    WIND: {
        2: ['#FFFFFF','#0000FF'],
        3: ['#FFFFFF', '#008B8B','#0000FF'],
        4: ['#FFFFFF', '#008B8B','#0000FF', '#FF00FF'],
    },
    PRECIP: {
        2: ['#FFFFFF','#0000FF'],
        3: ['#FFFFFF', '#00BFFF','#0000FF'],
        4: ['#FFFFFF', '#00BFFF','#0000FF', '#9932CC'],
    }
}

export const manualIntervals = {
    PRECIP: {
        2: [0],
        3: [0, 5],
        4: [0, 1, 5, 10]
    },
    WIND: {
        2: [30],
        3: [30, 50],
        4: [30, 50, 80, 100]
    }
}


export const rectVariables = {
    TEMP: {
        1: { default: 0.125, id: 1, name: "Day Width", values: [0.0625, 0.125, 0.25, 0.5, 1] },
        2: { default: 10, id: 2, name: "Row Height", values: [2, 4, 6, 8, 10, 12, 14] },
        3: { default: 1, id: 3, name: "Space Between Rows", values: [0, 1, 2] },
        4: { default: 5, id: 4, name: "Number of Colours", values: [1, 2, 3, 4, 5, 6, 7, 8, 360] },
        5: { default: 1, id: 5, name: "Number of Years", values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15] },
        6: { default: 1, id: 6, name: "Rows per Year", values: [1, 2, 3, 4, 6, 8, 10, 12] },
    },
    WIND: {
        1: { default: 0.125, id: 1, name: "Day Width", values: [0.0625, 0.125, 0.25, 0.5, 1] },
        2: { default: 10, id: 2, name: "Row Height", values: [2, 4, 6, 8, 10, 12, 14] },
        3: { default: 1, id: 3, name: "Space Between Rows", values: [0, 1, 2] },
        4: { default: 2, id: 4, name: "Number of Colours", values: [2, 3, 4] },
        5: { default: 1, id: 5, name: "Number of Years", values: [1, 2, 3] },
        6: { default: 1, id: 6, name: "Rows per Year", values: [1, 2, 3, 4, 6, 8, 10, 12] },
    },
    PRECIP: {
        1: { default: 0.125, id: 1, name: "Day Width", values: [0.0625, 0.125, 0.25, 0.5, 1] },
        2: { default: 10, id: 2, name: "Row Height", values: [2, 4, 6, 8, 10, 12, 14] },
        3: { default: 1, id: 3, name: "Space Between Rows", values: [0, 1, 2] },
        4: { default: 2, id: 4, name: "Number of Colours", values: [2, 3, 4] },
        5: { default: 1, id: 5, name: "Number of Years", values: [1, 2, 3] },
        6: { default: 1, id: 6, name: "Rows per Year", values: [1, 2, 3, 4, 6, 8, 10, 12] },
    }
}

export const rectValues = {
    DAY_WIDTH: 1,
    ROW_HEIGHT: 2,
    SPACE_BETWEEN_ROWS: 3,
    NUM_COLOURS: 4,
    NUM_YEARS: 5,
    NUM_ROWS: 6,
}

export const spiralVariables = {
    TEMP: {
        1: { default: 4, id: 1, name: "Core size", values: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
        2: { default: 10, id: 2, name: "Width of spiral", values: [2, 4, 6, 8, 10, 12, 14, 16] },
        3: { default: 0.02, id: 3, name: "Tightness of Spiral", values: [0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04] },
        4: { default: 5, id: 4, name: "Number of Colours", values: [1, 2, 3, 4, 5, 6, 7, 8, 360] },
        5: { default: 1, id: 5, name: "Number of Years", values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15] },
    },
    WIND: {
        1: { default: 4, id: 1, name: "Core size", values: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
        2: { default: 10, id: 2, name: "Width of spiral", values: [2, 4, 6, 8, 10, 12, 14, 16] },
        3: { default: 0.02, id: 3, name: "Tightness of Spiral", values: [0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04] },
        4: { default: 2, id: 4, name: "Number of Colours", values: [2, 3, 4] },
        5: { default: 1, id: 5, name: "Number of Years", values: [1, 2, 3] },
    },
    PRECIP: {
        1: { default: 4, id: 1, name: "Core size", values: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
        2: { default: 10, id: 2, name: "Width of spiral", values: [2, 4, 6, 8, 10, 12, 14, 16] },
        3: { default: 0.02, id: 3, name: "Tightness of Spiral", values: [0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04] },
        4: { default: 2, id: 4, name: "Number of Colours", values: [2, 3, 4] },
        5: { default: 1, id: 5, name: "Number of Years", values: [1, 2, 3] },
    }

}

export const spiralValues = {
    CORE_SIZE: 1,
    SPIRAL_WIDTH: 2,
    SPACE_BETWEEN_SPIRAL: 3,
    NUM_COLOURS: 4,
    NUM_YEARS: 5,
}

export const formats = {
    SPIRAL: { id: 1, name: "Spiral" },
    RECT: { id: 2, name: "Row" },
}

export const viewOptions = {
    INDIVIDUAL: { id: 1, name: "Individual" },
    ON_MAP: { id: 2, name: "On Map" },
}

export const dataSets = {
    TEMP: {id: 1, name: 'Average Temperature', val: 'TEMP',},
    WIND: {id: 2, name: 'Wind', val: 'WIND',},
    PRECIP: {id: 3, name: 'Precipitation', val: 'PRECIP',}
}

export const views = {
    COMPARISON: {id: 1, name: 'Comparison', val: 'COMPARISON'},
    MAP: {id: 2, name: 'Map', val: 'MAP'}
}

export const yearIndicators = {
    CIRCLE: {id: 1, name: 'Colour Circle', val: 'CIRCLE'},
    CLOCK: {id: 2, name: 'Clock on Hover', val: 'CLOCK'},
    TICKS: {id: 3, name: 'Tick Marks', val: 'TICKS'},
    PIZZA: {id: 4, name: 'Pizza on Hover', val: 'PIZZA'}
}