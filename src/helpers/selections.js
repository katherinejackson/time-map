import {formats, spiralValues, spiralVariables, rectValues, rectVariables} from '../constants'

export const getDefaultSelections = (format, dataType) => {
    let selections = {}
    if (format === formats.SPIRAL.id) {
        Object.keys(spiralValues).forEach(val => {
            selections[spiralValues[val]] = spiralVariables[dataType][spiralValues[val]].default
        })
    } else {
        Object.keys(rectValues).forEach(val => {
            selections[rectValues[val]] = rectVariables[dataType][rectValues[val]].default
        })
    }

    return selections
}