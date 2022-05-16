import React, { useEffect, useState } from 'react'

import './App.css';
import LeafletMap from "./LeafletMap"
import { views } from './constants'
import ScatterPlot from "./ScatterPlot"
import DataContext from './DataContext'
import { getData } from './helpers/data'
import { alaska, yukon } from "./data/locationCoords"
import { getDefaultSelections } from "./helpers/selections"
import ViewSelector from './ViewSelector';
import ShapeEncodingSelector from './ShapeEncodingSelector'
import SelectionPanel from './SelectionPanel'
import Comparison from './Comparison';
import GraphView from './GraphView'
import MultiComparison from './MultiComparison'
import MigrationGraph from './MigrationGraph';

const options = window.options || { view: null, shape: 2, encoding: 1, practice: false };

const study = window.options !== undefined

// var highlightOptions = {
//     COVID: ["China", "Turkey"],
//     TEMP: ["Homer", "Sitka"],
//     MIGRATION: ["Croatia>Serbia", "Germany>Italy"]
// }

const App = () => {
    const [view, setView] = useState(options.view)
    const [shape, setShape] = useState(options.shape)
    const [encoding, setEncoding] = useState(options.encoding)
    const [x, setX] = useState(null)
    const [y, setY] = useState(null)
    const { data, dataType, dataBrackets, yBrackets, xBrackets, variable } = getData(view, options.practice)
    const [selections, setSelections] = useState(getDefaultSelections())
    const locations = options.practice ? yukon : alaska
    const [highlightOptions, setHighlightOptions] = useState([])

    window.triggerHighlight = (hIO = []) => {
        setHighlightOptions(hIO)
        let temp = {...selections, 
            'highlightOptions': {
                "TEMP": highlightOptions, 
                "COVID": highlightOptions, 
                "MIGRATION": highlightOptions
            }
        }
        setSelections(temp)
    }

    selections['practice'] = options.practice
    selections['highlightOptions'] = {
        // "TEMP": highlightOptions, 
        "TEMP": highlightOptions, 
        "COVID": highlightOptions, 
        "MIGRATION": highlightOptions
    }

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

    // if this is not a study
    if (!study) {
        return (
            <div className="container-fluid my-5">
                <ViewSelector handleViewChange={handleViewChange} />
                {view === views.GRAPH.val || view === views.MULTI_COMPARISON.val ? null : <ShapeEncodingSelector encoding={encoding} handleEncodingChange={handleEncodingChange} handleShapeChange={handleShapeChange} shape={shape}/>}

                {view && shape && encoding ? (
                    <DataContext.Provider value={{ data, dataType, yBrackets, xBrackets, dataBrackets, locations, variable }}>
                        {view === views.GRAPH.val ? <GraphView /> : (
                            <>
                                <SelectionPanel selections={selections} setSelections={setSelections} setX={setX} setY={setY} shape={shape} view={view} x={x} y={y} />
                                <div className="d-flex justify-content-center">
                                    {view === views.MAP.val ? <LeafletMap encoding={encoding} selections={selections} shape={shape} /> : null}
                                    {view === views.SCATTER.val ? <ScatterPlot encoding={encoding} selections={selections} shape={shape} practice={options.practice} /> : null}
                                    {view === views.COMPARISON.val ? <Comparison encoding={encoding} selections={selections} shape={shape} x={x} y={y} /> : null}
                                    {view === views.MULTI_COMPARISON.val ? <MultiComparison encoding={encoding} selections={selections} shape={shape} x={x} y={y} /> : null}
                                    {view === views.MIGRATION_GRAPH.val ? <MigrationGraph encoding={encoding} selections={selections} shape={shape} study={study} /> : null}
                                </div>
                            </>
                        )}

                    </DataContext.Provider>
                ) : null}
            </div>
        );
    } else {
        return (
            <DataContext.Provider value={{ data, dataType, yBrackets, dataBrackets, xBrackets, locations, variable }}>
                <div className="d-flex justify-content-center">
                    {view === views.MAP.val ? <LeafletMap encoding={encoding} selections={selections} shape={shape} /> : null}
                    {view === views.SCATTER.val ? <ScatterPlot encoding={encoding} selections={selections} shape={shape} practice={options.practice} /> : null}
                    {view === views.MIGRATION_GRAPH.val ? <MigrationGraph encoding={encoding} selections={selections} shape={shape} study={study} /> : null}
                </div>
            </DataContext.Provider>
        )
    }


}

export default App;
