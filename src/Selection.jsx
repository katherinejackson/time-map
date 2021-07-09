import React, { useContext, useEffect, useState } from "react";

import Tile from "./Tile";
import LeafletMap from "./LeafletMap"
import FilterPanel from "./FilterPanel"
import { getDefaultSelections } from "./helpers/selections";
import { formats, rectVariables, spiralVariables } from './constants'
import SelectionContext from "./SelectionContext";
import ScatterPlot from "./ScatterPlot"
import DataContext from "./DataContext";

const Selection = ({ format, map }) => {
    const {dataType} = useContext(DataContext)

    const [error, setError] = useState(true)
    const [axis, setAxis] = useState({
        'x-axis': null,
        'y-axis': null,
    })
    const [selections, setSelections] = useState(getDefaultSelections(format, dataType))
    const [pinView, setPinView] = useState(false)
    const [opaque, setOpaque] = useState(false)
    const [yearIndication, setYearIndication] = useState(null)
    const [fillMissing, setFillMissing] = useState(false)
    const variables = format === formats.SPIRAL.id ? spiralVariables[dataType] : rectVariables[dataType]

    useEffect(() => {
        setSelections(getDefaultSelections(format, dataType))
    }, [format, dataType])

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
        setPinView(!pinView)
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
        <SelectionContext.Provider value={{ selections, pinView, fillMissing, format, opaque, variables, yearIndication }}>
            <div>
                <FilterPanel
                    axis={map ? null : axis}
                    handleSelect={handleSelect}
                    handleAxisSelect={map ? null : handleAxisSelect}
                    handleFillMissingCheck={handleFillMissingCheck}
                    handlePinCheck={handlePinCheck}
                    handleOpaqueCheck={handleOpaqueCheck}
                    handleYearIndicationSelect={handleYearIndicationSelect}
                />
                <ScatterPlot />
            </div>
        </SelectionContext.Provider>
    )
}

export default Selection
