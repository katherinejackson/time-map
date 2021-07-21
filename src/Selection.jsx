import React, { useContext, useEffect, useState } from "react";

import Tile from "./Tile";
import LeafletMap from "./LeafletMap"
import FilterPanel from "./FilterPanel"
import { getDefaultSelections } from "./helpers/selections";
import { shapes, rectVariables, spiralVariables, views, themes } from './constants'
import SelectionContext from "./SelectionContext";
import ScatterPlot from "./ScatterPlot"
import DataContext from "./DataContext";
import GraphView from "./GraphView"


const Selection = ({ shape, view }) => {
    const { dataType } = useContext(DataContext)

    const [error, setError] = useState(true)
    const [axis, setAxis] = useState({
        'x-axis': null,
        'y-axis': null,
    })
    const [selections, setSelections] = useState(getDefaultSelections(shape, view))
    const [mapPin, setMapPin] = useState(false)
    const [opaque, setOpaque] = useState(false)
    const [yearIndication, setYearIndication] = useState(null)
    const [fillMissing, setFillMissing] = useState(false)
    const [theme, setTheme] = useState(themes.DEFAULT.val)
    const variables = shape === shapes.SPIRAL.id ? spiralVariables[view] : rectVariables[view]

    useEffect(() => {
        setSelections(getDefaultSelections(shape, view))
    }, [shape, dataType, view])

    const handleSelect = (event, id) => {
        setSelections({ ...selections, [id]: parseFloat(event.currentTarget.value) })
    }

    const handleAxisSelect = (event, id) => {
        setAxis({ ...axis, [id]: parseInt(event.currentTarget.value) })
        setError(isError({ ...axis, [id]: parseInt(event.currentTarget.value) }))
    }

    const handleYearIndicationSelect = (event) => {
        setYearIndication(event.currentTarget.value)
    }

    const handlePinCheck = () => {
        setMapPin(!mapPin)
    }

    const handleOpaqueCheck = () => {
        setOpaque(!opaque)
    }

    const handleFillMissingCheck = () => {
        setFillMissing(!fillMissing)
    }

    const handleThemeSelect = (event) => {
        setTheme(event.currentTarget.value)
    }

    const isError = (values) => {
        return values["x-axis"] === null
            || values["y-axis"] === null
            || values["x-axis"] === values["y-axis"]
    }

    return (
        <SelectionContext.Provider value={{ selections, theme, mapPin, fillMissing, shape, opaque, variables, yearIndication }}>
            <div>
                {view !== views.GRAPH.val ? (
                    <FilterPanel
                        axis={axis}
                        handleSelect={handleSelect}
                        handleAxisSelect={handleAxisSelect}
                        handleThemeSelect={handleThemeSelect}
                        handleFillMissingCheck={handleFillMissingCheck}
                        handlePinCheck={handlePinCheck}
                        handleOpaqueCheck={handleOpaqueCheck}
                        handleYearIndicationSelect={handleYearIndicationSelect}
                        view={view}
                    />
                ) : null}
                {view === views.MAP.val ? <LeafletMap /> : null}
                {view === views.SCATTER.val ? <ScatterPlot /> : null}
                {view === views.COMPARISON.val ? error ? (
                    <h3 className="text-danger">
                        Please make a valid selection
                    </h3>
                ) : (
                    <span className="d-flex flex-row">
                        {variables[axis["x-axis"]].values.map((xval) => (
                            <span className="flex-col" key={`x-${axis["x-axis"]}-${xval}`}>
                                {variables[axis["y-axis"]].values.map((yval) => (
                                    <span
                                        key={`x-${axis["x-axis"]}-${xval} y-${axis["y-axis"]}-${yval}`}
                                        title={variables[axis["x-axis"]].name + ': ' + xval + '  ' + variables[axis["y-axis"]].name + ': ' + yval}
                                    >
                                        <Tile
                                            key={`${dataType}-xval: ${xval} yval: ${yval}`}
                                            numX={variables[axis["x-axis"]]?.values?.length}
                                            selections={{ ...selections, [axis["x-axis"]]: xval, [axis["y-axis"]]: yval }}
                                        />
                                    </span>
                                ))}
                            </span>
                        ))}
                    </span>
                ) : null}
                {view === views.GRAPH.val ? <GraphView /> : null}
            </div>
        </SelectionContext.Provider>
    )
}

export default Selection
