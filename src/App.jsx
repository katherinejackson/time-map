import React from 'react'

import './App.css';
import LeafletMap from "./LeafletMap"
import { views } from './constants'
import ScatterPlot from "./ScatterPlot"
import DataContext from './DataContext'
import { getData } from './helpers/data'
import SelectionContext from "./SelectionContext"
import { alaska as locations } from "./data/locationCoords"
import { getDefaultSelections } from "./helpers/selections"

let options = window.options || { view: 'MAP', shape: 2, encoding: 1 };

const App = () => {
    const view = options.view
    const shape = options.shape
    const encoding = options.encoding
    const { data, dataType, dataBrackets, yBrackets, categories, variable, totalDataPts } = getData(view)
    const selections = getDefaultSelections(shape, view)

    return (
        <DataContext.Provider value={{ data, dataType, yBrackets, dataBrackets, categories, totalDataPts, locations, variable }}>
            <SelectionContext.Provider value={{
            encoding,
            shape,
            selections,
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
