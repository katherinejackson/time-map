import {shapes, spiralValues, spiralVariables, rectValues, rectVariables} from '../constants'

export const getDefaultSelections = (shape, dataType) => {
    let selections = {}
    if (shape === shapes.SPIRAL.id) {
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