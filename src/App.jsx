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

const App = () => {
    const [view, setView] = useState('MAP')
    const [shape, setShape] = useState(1)
    const [encoding, setEncoding] = useState(1)
    const [x, setX] = useState(null)
    const [y, setY] = useState(null)
    const { data, dataType, dataBrackets, yBrackets, categories, variable, totalDataPts } = getData(view)
    const [selections, setSelections] = useState(getDefaultSelections(shape, view))

    useEffect(() => {
        setX(null)
        setY(null)
        setSelections(getDefaultSelections(shape, view))
    }, [shape])

    const handleViewChange = (event) => {
        setView(event.target.value)
    }

    const handleShapeChange = (event) => {
        setShape(parseInt(event.target.value))
    }

    const handleEncodingChange = (event) => {
        setEncoding(parseInt(event.target.value))
    }

    return (
        <div className="container-fluid my-5">
            <ViewSelector handleViewChange={handleViewChange} />
            <ShapeEncodingSelector handleEncodingChange={handleEncodingChange} handleShapeChange={handleShapeChange} />


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
}

export default App;
