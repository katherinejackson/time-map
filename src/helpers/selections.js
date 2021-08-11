import { shapes, themeColours, themes } from '../constants'

export const getDefaultSelections = (shape) => {
    let selections = {
        mapPin: false,
        opaque: false,
        yearIndication: null,
        fillMissing: true,
        theme: themeColours[themes.DARK.val],
        cluster: false,
        numYears: 1,
        numColours: 8,
    }

    if (shape === shapes.SPIRAL.id) {
        selections['coreSize'] = 4
        selections['spiralWidth'] = 10
        selections['spiralTightness'] = 0.02
    } else if (shape === shapes.RECT.id) {
        selections['dayWidth'] = 0.125
        selections['rowHeight'] = 10
        selections['spaceBetween'] = 1
    }

    return selections
}