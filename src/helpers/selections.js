import {shapes, spiralValues, spiralVariables, rectValues, rectVariables, sparkValues, sparkVariables} from '../constants'

export const getDefaultSelections = (shape, view) => {
    let selections = {}
    if (shape === shapes.SPIRAL.id) {
        Object.keys(spiralValues).forEach(val => {
            selections[spiralValues[val]] = spiralVariables[view][spiralValues[val]].default
        })
    } else if (shape === shapes.RECT.id) {
        Object.keys(rectValues).forEach(val => {
            selections[rectValues[val]] = rectVariables[view][rectValues[val]].default
        })
    } else if (shape === shapes.SPARK.id) {
        Object.keys(sparkValues).forEach(val => {
            selections[sparkValues[val]] = sparkVariables[view][sparkValues[val]].default
        })
    }

    return selections
}