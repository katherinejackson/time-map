import React from "react";

import LeafletMap from "./LeafletMap"
import { getDefaultSelections } from "./helpers/selections";
import { shapes, rectVariables, spiralVariables, views, themes, sparkVariables, radialSparkVariables, radialBarSparkVariables } from './constants'
import SelectionContext from "./SelectionContext";
import ScatterPlot from "./ScatterPlot"


const getVariables = (shape, view) => {
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

const defaultGeneralSelections = {
    mapPin: false,
    opaque: false,
    yearIndication: null,
    fillMissing: true,
    theme: themes.DEFAULT.val,
    cluster: false,
}


const Selection = ({ shape, view }) => {
    const shapeSelections = getDefaultSelections(shape, view)
    const variables = getVariables(shape, view)

    return (
        <SelectionContext.Provider value={{
            cluster: defaultGeneralSelections.cluster,
            selections: shapeSelections,
            theme: defaultGeneralSelections.theme,
            mapPin: defaultGeneralSelections.mapPin,
            fillMissing: defaultGeneralSelections.fillMissing,
            shape,
            opaque: defaultGeneralSelections.opaque,
            variables,
            yearIndication: defaultGeneralSelections.yearIndication,
        }}>
            <div>
                {view === views.MAP.val ? <LeafletMap /> : null}
                {view === views.SCATTER.val ? <ScatterPlot /> : null}
            </div>
        </SelectionContext.Provider>
    )
}

export default Selection
