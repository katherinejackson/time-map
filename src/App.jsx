import React, { useEffect, useState } from 'react'

import './App.css';
import LeafletMap from "./LeafletMap"
import { views } from './constants'
import ScatterPlot from "./ScatterPlot"
import { getDefaultSelections } from "./helpers/selections"
import ViewSelector from './ViewSelector';
import ShapeEncodingSelector from './ShapeEncodingSelector'
import SelectionPanel from './SelectionPanel'
import Comparison from './Comparison';
import GraphView from './GraphView'
import MigrationGraph from './MigrationGraph';
import MultiComparisonCondensed from './MultiComparisonCondensed';

const options = window.options || { view: null, shape: 2, encoding: 1, practice: false, size: 'medium' };

const study = window.options !== undefined

const App = () => {
    const [view, setView] = useState(options.view)
    const [shape, setShape] = useState(options.shape)
    const [size, setSize] = useState(options.size)
    const [encoding, setEncoding] = useState(options.encoding)
    const [x, setX] = useState(null)
    const [y, setY] = useState(null)
    const [selections, setSelections] = useState(getDefaultSelections())
    const [highlightOptions, setHighlightOptions] = useState([])
    const practice = options.practice

    window.triggerHighlight = (hIO = []) => {
        setHighlightOptions(hIO)
        let temp = {
            ...selections,
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
        "TEMP": highlightOptions,
        "COVID": highlightOptions,
        "MIGRATION": highlightOptions
    }

    useEffect(() => {
        setX(null)
        setY(null)
    }, [view])

    const handleViewChange = (event) => {
        setView(event.target.value)
    }

    const handleShapeChange = (event) => {
        setShape(parseInt(event.target.value))
    }

    const handleEncodingChange = (event) => {
        setEncoding(parseInt(event.target.value))
    }

    const handleSizeChange = (event) => {
        setSize(event.target.value)
    }

    // if this is not a study
    if (!study) {
        return (
            <div className="container-fluid my-5">
                <ViewSelector handleViewChange={handleViewChange} />
                {view === views.GRAPH.val || view === views.MULTI_COMPARISON.val
                    ? null
                    : <ShapeEncodingSelector
                        encoding={encoding}
                        handleEncodingChange={handleEncodingChange}
                        handleShapeChange={handleShapeChange}
                        handleSizeChange={handleSizeChange}
                        shape={shape}
                        size={size}
                    />}

                {view && shape && encoding ? (
                    view === views.GRAPH.val ? <GraphView /> : (
                        <>
                            <SelectionPanel selections={selections} setSelections={setSelections} setX={setX} setY={setY} shape={shape} view={view} x={x} y={y} />
                            <div className="d-flex justify-content-center">
                                {view === views.MAP.val ? <LeafletMap encoding={encoding} practice={practice} selections={selections} shape={shape} /> : null}
                                {view === views.SCATTER.val ? <ScatterPlot encoding={encoding} practice={practice} selections={selections} shape={shape} /> : null}
                                {view === views.COMPARISON.val ? <Comparison encoding={encoding} selections={selections} shape={shape} x={x} y={y} /> : null}
                                {view === views.MULTI_COMPARISON.val ? <MultiComparisonCondensed encoding={encoding} selections={selections} shape={shape} x={x} y={y} /> : null}
                                {view === views.MIGRATION_GRAPH.val ? <MigrationGraph encoding={encoding} practice={practice} selections={selections} shape={shape} study={study} /> : null}
                            </div>
                        </>
                    )
                ) : null}
            </div>
        );
    } else {
        return (
            <div className="d-flex justify-content-center">
                {view === views.MAP.val ? <LeafletMap encoding={encoding} practice={practice} selections={selections} shape={shape} size={size} /> : null}
                {view === views.SCATTER.val ? <ScatterPlot encoding={encoding} practice={practice} selections={selections} shape={shape} size={size} /> : null}
                {view === views.MIGRATION_GRAPH.val ? <MigrationGraph encoding={encoding} practice={practice} selections={selections} shape={shape} study={study} size={size} /> : null}
            </div>
        )
    }


}

export default App;
