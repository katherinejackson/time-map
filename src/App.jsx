import React, { useEffect, useState } from 'react'

import './App.css';
import LeafletMap from "./LeafletMap"
import { views } from './constants'
import ScatterPlot from "./ScatterPlot"
import DataContext from './DataContext'
import { getData } from './helpers/data'
import { alaska as locations } from "./data/locationCoords"
import { getDefaultSelections } from "./helpers/selections"
import ViewSelector from './ViewSelector';
import ShapeEncodingSelector from './ShapeEncodingSelector'
import SelectionPanel from './SelectionPanel'
import Comparison from './Comparison';
import GraphView from './GraphView'

let options = window.options || { view: null, shape: 2, encoding: 1 };
// let options = window.options || { view: 'MAP', shape: 2, encoding: 1 };

const App = () => {
    const [view, setView] = useState(options.view)
    const [shape, setShape] = useState(options.shape)
    const [encoding, setEncoding] = useState(options.encoding)
    const [x, setX] = useState(null)
    const [y, setY] = useState(null)
    const { data, dataType, dataBrackets, yBrackets, categories, variable, totalDataPts } = getData(view)
    const [selections, setSelections] = useState(getDefaultSelections(shape, view))

    useEffect(() => {
        setX(null)
        setY(null)
    }, [shape, view])

    const handleViewChange = (event) => {
        setView(event.target.value)
    }

    const handleShapeChange = (event) => {
        setShape(parseInt(event.target.value))
    }

    const handleEncodingChange = (event) => {
        setEncoding(parseInt(event.target.value))
    }

    if (!window.options) {
        return (
            <div className="container-fluid my-5">
                <ViewSelector handleViewChange={handleViewChange} />
                {view === views.GRAPH.val ? null : <ShapeEncodingSelector handleEncodingChange={handleEncodingChange} handleShapeChange={handleShapeChange} />}

                {view && shape && encoding ? (
                    <DataContext.Provider value={{ data, dataType, yBrackets, dataBrackets, categories, totalDataPts, locations, variable }}>
                        {view === views.GRAPH.val ? <GraphView /> : (
                            <>
                                <SelectionPanel selections={selections} setSelections={setSelections} setX={setX} setY={setY} shape={shape} view={view} x={x} y={y} />
                                <div className="d-flex justify-content-center">
                                    {view === views.MAP.val ? <LeafletMap encoding={encoding} selections={selections} shape={shape} /> : null}
                                    {view === views.SCATTER.val ? <ScatterPlot encoding={encoding} selections={selections} shape={shape} /> : null}
                                    {view === views.COMPARISON.val ? <Comparison encoding={encoding} selections={selections} shape={shape} x={x} y={y} /> : null}
                                </div>
                            </>
                        )}

                    </DataContext.Provider>
                ) : null}
            </div>
        );
    } else {
        return (
            <DataContext.Provider value={{ data, dataType, yBrackets, dataBrackets, categories, totalDataPts, locations, variable }}>
                <div className="d-flex justify-content-center">
                    {view === views.MAP.val ? <LeafletMap encoding={encoding} selections={selections} shape={shape} /> : null}
                    {view === views.SCATTER.val ? <ScatterPlot encoding={encoding} selections={selections} shape={shape} /> : null}
                </div>
            </DataContext.Provider>
        )
    }


}

export default App;
