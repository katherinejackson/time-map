import React, { useContext, useEffect, useState } from "react";

import Tile from "./Tile";
import LeafletMap from "./LeafletMap"
import FilterPanel from "./FilterPanel"
import { getDefaultSelections } from "./helpers/selections";
import { shapes, rectVariables, spiralVariables, views } from './constants'
import SelectionContext from "./SelectionContext";
import ScatterPlot from "./ScatterPlot"
import DataContext from "./DataContext";

const Selection = ({ shape, view }) => {
    const { dataType } = useContext(DataContext)

    const [error, setError] = useState(true)
    const [axis, setAxis] = useState({
        'x-axis': null,
        'y-axis': null,
    })
    const [selections, setSelections] = useState(getDefaultSelections(shape, dataType))
    const [mapPin, setMapPin] = useState(false)
    const [opaque, setOpaque] = useState(false)
    const [yearIndication, setYearIndication] = useState(null)
    const [fillMissing, setFillMissing] = useState(false)
    const variables = shape === shapes.SPIRAL.id ? spiralVariables[dataType] : rectVariables[dataType]

    useEffect(() => {
        setSelections(getDefaultSelections(shape, dataType))
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

    const isError = (values) => {
        return values["x-axis"] === null
            || values["y-axis"] === null
            || values["x-axis"] === values["y-axis"]
    }

    return (
        <SelectionContext.Provider value={{ selections, mapPin, fillMissing, shape, opaque, variables, yearIndication }}>
            <div>
                <FilterPanel
                    axis={axis}
                    handleSelect={handleSelect}
                    handleAxisSelect={handleAxisSelect}
                    handleFillMissingCheck={handleFillMissingCheck}
                    handlePinCheck={handlePinCheck}
                    handleOpaqueCheck={handleOpaqueCheck}
                    handleYearIndicationSelect={handleYearIndicationSelect}
                    view={view}
                />
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
            </div>
        </SelectionContext.Provider>
    )
}

export default Selection
