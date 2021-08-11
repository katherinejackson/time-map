import React from 'react'

import './App.css';
import LeafletMap from "./LeafletMap"
import { views } from './constants'
import ScatterPlot from "./ScatterPlot"
import DataContext from './DataContext'
import { getData } from './helpers/data'
import SelectionContext from "./SelectionContext"
import { alaska as locations } from "./data/locationCoords"
import { getDefaultSelections, getVariables } from "./helpers/selections"

let options = window.options || { view: 'SCATTER', shape: 5 };

const App = () => {
    const view = options.view
    const shape = options.shape
    const { data, dataType, dataBrackets, yBrackets, categories, variable, totalDataPts } = getData(view)
    const selections = getDefaultSelections(shape, view)
    const variables = getVariables(shape, view)

    return (
        <DataContext.Provider value={{ data, dataType, yBrackets, dataBrackets, categories, totalDataPts, locations, variable }}>
            <SelectionContext.Provider value={{
            cluster: selections.cluster,
            selections: selections,
            theme: selections.theme,
            mapPin: selections.mapPin,
            fillMissing: selections.fillMissing,
            shape,
            opaque: selections.opaque,
            variables,
            yearIndication: selections.yearIndication,
        }}>
            <div className="d-flex justify-content-center">
                {view === views.MAP.val ? <LeafletMap /> : null}
                {view === views.SCATTER.val ? <ScatterPlot /> : null}
            </div>
        </SelectionContext.Provider>
        </DataContext.Provider>
    )
}

export default App;
