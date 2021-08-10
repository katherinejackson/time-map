import {shapes, spiralValues, spiralVariables, rectValues, rectVariables, sparkValues, sparkVariables, radialSparkValues, radialSparkVariables, radialBarSparkValues, radialBarSparkVariables, themes} from '../constants'

export const getDefaultSelections = (shape, view) => {
    let selections = {
        mapPin: false,
        opaque: false,
        yearIndication: null,
        fillMissing: true,
        theme: themes.DARK.val,
        cluster: false,
    }

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
    } else if (shape === shapes.RADIAL_SPARK.id) {
        Object.keys(radialSparkValues).forEach(val => {
            selections[radialSparkValues[val]] = radialSparkVariables[view][radialSparkValues[val]].default
        })
    } else if (shape === shapes.RADIAL_BAR_SPARK.id) {
        Object.keys(radialBarSparkValues).forEach(val => {
            selections[radialBarSparkValues[val]] = radialBarSparkVariables[view][radialBarSparkValues[val]].default
        })
    }

    return selections
}

export const getVariables = (shape, view) => {
    if (shape === shapes.SPIRAL.id) {
        return spiralVariables[view]
    } else if (shape === shapes.RECT.id) {
        return rectVariables[view]
    } else if (shape === shapes.SPARK.id) {
        return sparkVariables[view]
    } else if (shape === shapes.RADIAL_SPARK.id) {
        return radialSparkVariables[view]
    } else if (shape === shapes.RADIAL_BAR_SPARK.id) {
        return radialBarSparkVariables[view]
    }
}