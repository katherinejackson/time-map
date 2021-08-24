export const canvasSize = 200

export const radianPerDay = 0.01721420632

export const radianPerMonth = 0.52359877559

export const pinSize = 5

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

export const abbreviatedMonths = ["JA", "FE", "MR", "AL", "MA", "JN", "JL", "AU", "SE", "OC", "NO", "DE"]

export const monthColours = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"]

export const themeColours = {
    DEFAULT: {
        background: 255,
        lineColour: 50,
        textColour: 0,
        pinColour: 50,
        pinBackground: 220,
        missingData: 150,
        name: 'DEFAULT'
    },
    DARK: {
        background: 0,
        lineColour: 200,
        textColour: 255,
        pinColour: 200,
        pinBackground: 50,
        missingData: 150,
        name: 'DARK',
    },
    COLOUR_DARK: {
        background: 0,
        lineColour: 200,
        textColour: 255,
        pinColour: 200,
        pinBackground: 50,
        missingData: 150,
        name: 'COLOUR_DARK'
    },
}

export const themes = {
    DEFAULT: { id: 1, name: 'Default', val: 'DEFAULT' },
    DARK: { id: 2, name: 'Dark Mode', val: 'DARK' },
    COLOUR_DARK: { id: 3, name: 'Coloured Dark Mode', val: 'COLOUR_DARK' },
}

export const colours = {
    TEMP: {
        0: ['black'],
        3: ['#FF0000', '#00FF00', '#0000FF'],
        4: ['#FF0000', '#FFFF00', '#00FF00', '#0000FF'],
        5: ['#FF0000', '#FFFF00', '#00FF00', '#0000FF', '#00FFFF'],
        6: ['#FF0000','#FFFF00',"#437731","#00bfbf","#255ffb","#7f11ee"],
        7: ['#FF00FF', '#FF0000', '#FF8000', '#FFFF00', '#00FF00', '#0000FF', '#00FFFF'],
        8: ['#FF00FF', '#FF0000','#FFFF00',"#7fee11","#437731","#00bfbf","#255ffb","#7f11ee"],
    },
    WIND: {
        2: ['#FFFFFF', '#0000FF'],
        3: ['#FFFFFF', '#008B8B', '#0000FF'],
        4: ['#FFFFFF', '#008B8B', '#0000FF', '#FF00FF'],
    },
    PRECIP: {
        2: ['#FFFFFF', '#0000FF'],
        3: ['#FFFFFF', '#00BFFF', '#0000FF'],
        4: ['#FFFFFF', '#00BFFF', '#0000FF', '#9932CC'],
    },
    COVID: {
        0: ['black'],
        6: ['#FF0000','#FFFF00',"#437731","#00bfbf","#255ffb","#7f11ee"],
        8: ['#FF00FF', '#FF0000','#FFFF00',"#7fee11","#437731","#00bfbf","#255ffb","#7f11ee"],
        256: ["#ffffcc", "#fffecb", "#fffec9", "#fffdc8", "#fffdc6", "#fffcc5", "#fffcc4", "#fffbc2", "#fffac1", "#fffac0", "#fff9be", "#fff9bd", "#fff8bb", "#fff8ba", "#fff7b9", "#fff6b7", "#fff6b6", "#fff5b5", "#fff5b3", "#fff4b2", "#fff4b0", "#fff3af", "#fff2ae", "#fff2ac", "#fff1ab", "#fff1aa", "#fff0a8", "#fff0a7", "#ffefa6", "#ffeea4", "#ffeea3", "#ffeda2", "#ffeda0", "#ffec9f", "#ffeb9d", "#ffeb9c", "#ffea9b", "#ffea99", "#ffe998", "#ffe897", "#ffe895", "#ffe794", "#ffe693", "#ffe691", "#ffe590", "#ffe48f", "#ffe48d", "#ffe38c", "#fee28b", "#fee289", "#fee188", "#fee087", "#fee085", "#fedf84", "#fede83", "#fedd82", "#fedc80", "#fedc7f", "#fedb7e", "#feda7c", "#fed97b", "#fed87a", "#fed778", "#fed777", "#fed676", "#fed574", "#fed473", "#fed372", "#fed270", "#fed16f", "#fed06e", "#fecf6c", "#fece6b", "#fecd6a", "#fecb69", "#feca67", "#fec966", "#fec865", "#fec764", "#fec662", "#fec561", "#fec460", "#fec25f", "#fec15e", "#fec05c", "#febf5b", "#febe5a", "#febd59", "#febb58", "#feba57", "#feb956", "#feb855", "#feb754", "#feb553", "#feb452", "#feb351", "#feb250", "#feb14f", "#feb04e", "#feae4d", "#fead4d", "#feac4c", "#feab4b", "#feaa4a", "#fea84a", "#fea749", "#fea648", "#fea547", "#fea347", "#fea246", "#fea145", "#fda045", "#fd9e44", "#fd9d44", "#fd9c43", "#fd9b42", "#fd9942", "#fd9841", "#fd9741", "#fd9540", "#fd9440", "#fd923f", "#fd913f", "#fd8f3e", "#fd8e3e", "#fd8d3d", "#fd8b3c", "#fd893c", "#fd883b", "#fd863b", "#fd853a", "#fd833a", "#fd8139", "#fd8039", "#fd7e38", "#fd7c38", "#fd7b37", "#fd7937", "#fd7736", "#fc7535", "#fc7335", "#fc7234", "#fc7034", "#fc6e33", "#fc6c33", "#fc6a32", "#fc6832", "#fb6731", "#fb6531", "#fb6330", "#fb6130", "#fb5f2f", "#fa5d2e", "#fa5c2e", "#fa5a2d", "#fa582d", "#f9562c", "#f9542c", "#f9522b", "#f8512b", "#f84f2a", "#f74d2a", "#f74b29", "#f64929", "#f64828", "#f54628", "#f54427", "#f44227", "#f44127", "#f33f26", "#f23d26", "#f23c25", "#f13a25", "#f03824", "#f03724", "#ef3524", "#ee3423", "#ed3223", "#ed3123", "#ec2f22", "#eb2e22", "#ea2c22", "#e92b22", "#e92921", "#e82821", "#e72621", "#e62521", "#e52420", "#e42220", "#e32120", "#e22020", "#e11f20", "#e01d20", "#df1c20", "#de1b20", "#dd1a20", "#dc1920", "#db1820", "#da1720", "#d91620", "#d81520", "#d71420", "#d51320", "#d41221", "#d31121", "#d21021", "#d10f21", "#cf0e21", "#ce0d21", "#cd0d22", "#cc0c22", "#ca0b22", "#c90a22", "#c80a22", "#c60923", "#c50823", "#c40823", "#c20723", "#c10723", "#bf0624", "#be0624", "#bc0524", "#bb0524", "#b90424", "#b80424", "#b60425", "#b50325", "#b30325", "#b10325", "#b00225", "#ae0225", "#ac0225", "#ab0225", "#a90125", "#a70126", "#a50126", "#a40126", "#a20126", "#a00126", "#9e0126", "#9c0026", "#9a0026", "#990026", "#970026", "#950026", "#930026", "#910026", "#8f0026", "#8d0026", "#8b0026", "#8a0026", "#880026", "#860026", "#840026", "#820026", "#800026"],
    },
    TRADE: {
        0: ['black'],
        7: ["#4e79a7","#f28e2c","#76b7b2","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"],
        256: ["#ffffcc", "#fffecb", "#fffec9", "#fffdc8", "#fffdc6", "#fffcc5", "#fffcc4", "#fffbc2", "#fffac1", "#fffac0", "#fff9be", "#fff9bd", "#fff8bb", "#fff8ba", "#fff7b9", "#fff6b7", "#fff6b6", "#fff5b5", "#fff5b3", "#fff4b2", "#fff4b0", "#fff3af", "#fff2ae", "#fff2ac", "#fff1ab", "#fff1aa", "#fff0a8", "#fff0a7", "#ffefa6", "#ffeea4", "#ffeea3", "#ffeda2", "#ffeda0", "#ffec9f", "#ffeb9d", "#ffeb9c", "#ffea9b", "#ffea99", "#ffe998", "#ffe897", "#ffe895", "#ffe794", "#ffe693", "#ffe691", "#ffe590", "#ffe48f", "#ffe48d", "#ffe38c", "#fee28b", "#fee289", "#fee188", "#fee087", "#fee085", "#fedf84", "#fede83", "#fedd82", "#fedc80", "#fedc7f", "#fedb7e", "#feda7c", "#fed97b", "#fed87a", "#fed778", "#fed777", "#fed676", "#fed574", "#fed473", "#fed372", "#fed270", "#fed16f", "#fed06e", "#fecf6c", "#fece6b", "#fecd6a", "#fecb69", "#feca67", "#fec966", "#fec865", "#fec764", "#fec662", "#fec561", "#fec460", "#fec25f", "#fec15e", "#fec05c", "#febf5b", "#febe5a", "#febd59", "#febb58", "#feba57", "#feb956", "#feb855", "#feb754", "#feb553", "#feb452", "#feb351", "#feb250", "#feb14f", "#feb04e", "#feae4d", "#fead4d", "#feac4c", "#feab4b", "#feaa4a", "#fea84a", "#fea749", "#fea648", "#fea547", "#fea347", "#fea246", "#fea145", "#fda045", "#fd9e44", "#fd9d44", "#fd9c43", "#fd9b42", "#fd9942", "#fd9841", "#fd9741", "#fd9540", "#fd9440", "#fd923f", "#fd913f", "#fd8f3e", "#fd8e3e", "#fd8d3d", "#fd8b3c", "#fd893c", "#fd883b", "#fd863b", "#fd853a", "#fd833a", "#fd8139", "#fd8039", "#fd7e38", "#fd7c38", "#fd7b37", "#fd7937", "#fd7736", "#fc7535", "#fc7335", "#fc7234", "#fc7034", "#fc6e33", "#fc6c33", "#fc6a32", "#fc6832", "#fb6731", "#fb6531", "#fb6330", "#fb6130", "#fb5f2f", "#fa5d2e", "#fa5c2e", "#fa5a2d", "#fa582d", "#f9562c", "#f9542c", "#f9522b", "#f8512b", "#f84f2a", "#f74d2a", "#f74b29", "#f64929", "#f64828", "#f54628", "#f54427", "#f44227", "#f44127", "#f33f26", "#f23d26", "#f23c25", "#f13a25", "#f03824", "#f03724", "#ef3524", "#ee3423", "#ed3223", "#ed3123", "#ec2f22", "#eb2e22", "#ea2c22", "#e92b22", "#e92921", "#e82821", "#e72621", "#e62521", "#e52420", "#e42220", "#e32120", "#e22020", "#e11f20", "#e01d20", "#df1c20", "#de1b20", "#dd1a20", "#dc1920", "#db1820", "#da1720", "#d91620", "#d81520", "#d71420", "#d51320", "#d41221", "#d31121", "#d21021", "#d10f21", "#cf0e21", "#ce0d21", "#cd0d22", "#cc0c22", "#ca0b22", "#c90a22", "#c80a22", "#c60923", "#c50823", "#c40823", "#c20723", "#c10723", "#bf0624", "#be0624", "#bc0524", "#bb0524", "#b90424", "#b80424", "#b60425", "#b50325", "#b30325", "#b10325", "#b00225", "#ae0225", "#ac0225", "#ab0225", "#a90125", "#a70126", "#a50126", "#a40126", "#a20126", "#a00126", "#9e0126", "#9c0026", "#9a0026", "#990026", "#970026", "#950026", "#930026", "#910026", "#8f0026", "#8d0026", "#8b0026", "#8a0026", "#880026", "#860026", "#840026", "#820026", "#800026"],
    },
    BRIDGE: {
        0: ['black'],
        6: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],
    }
}

export const manualIntervals = {
    PRECIP: {
        2: [0],
        3: [0, 5],
        4: [0, 1, 10]
    },
    WIND: {
        2: [30],
        3: [30, 50],
        4: [30, 50, 100]
    },
    COVID: {
        6: [1, 10, 100, 1000, 10000, 100000, 1000000],
        256: [1, 10, 100, 1000, 10000, 100000, 1000000]
    },
    TRADE: {
        7: [1000000, 10000000, 20000000, 40000000, 80000000, 160000000, 320000000, 640000000],
        256: [1, 10, 100, 1000, 10000, 100000, 1000000]
    },
    BRIDGE: {
        6: [0, 10, 50, 100, 200, 300, 400],
    }
}

export const shapes = {
    SPIRAL: { id: 1, name: "Spiral" },
    ROW: { id: 2, name: "Row" },
}

export const encodings = {
    DISTANCE: { id: 1, name: "Distance" },
    COLOUR: { id: 2, name: "Colour" },
    DISTANCE_COLOUR: {id: 3, name: "Distance and Colour"},
}

export const dataSets = {
    TEMP: { id: 1, name: 'Average Temperature', val: 'TEMP' },
    WIND: { id: 2, name: 'Wind', val: 'WIND' },
    PRECIP: { id: 3, name: 'Precipitation', val: 'PRECIP' },
    COVID: { id: 4, name: 'Covid', val: 'COVID' },
    TRADE: { id: 5, name: 'Trade', val: 'TRADE' },
}

export const views = {
    COMPARISON: { id: 1, name: 'Comparison', val: 'COMPARISON' },
    MAP: { id: 2, name: 'Map', val: 'MAP' },
    SCATTER: { id: 3, name: 'Scatter Plot', val: 'SCATTER' },
    GRAPH: { id: 4, name: 'Graph', val: 'GRAPH' },
    MULTI_COMPARISON: {id: 5, name: 'Multi Comparison', val: 'MULTI_COMPARISON'}
}

export const yearIndicators = {
    COLOURS: { id: 1, name: 'Colour Line', val: 'COLOURS' },
    MONTHS: { id: 2, name: 'Month Names', val: 'MONTHS' },
    TICKS: { id: 3, name: 'Tick Marks', val: 'TICKS' },
    MONTHS_TICKS: { id: 4, name: 'Months and Ticks', val: 'MONTHS_TICKS' }
}