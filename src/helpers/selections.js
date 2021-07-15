import {shapes, spiralValues, spiralVariables, rectValues, rectVariables} from '../constants'

export const getDefaultSelections = (shape, view) => {
    let selections = {}
    if (shape === shapes.SPIRAL.id) {
        Object.keys(spiralValues).forEach(val => {
            selections[spiralValues[val]] = spiralVariables[view][spiralValues[val]].default
        })
    } else {
        Object.keys(rectValues).forEach(val => {
            selections[rectValues[val]] = rectVariables[view][rectValues[val]].default
        })
    }

    return selections
}