import React, { useEffect, useState } from "react";

import Tile from "./Tile";
import LeafletMap from "./LeafletMap"
import FilterPanel from "./FilterPanel"
import { getDefaultSelections } from "./helpers/selections";
import { getDataBrackets } from "./helpers/data";
import { formats, rectVariables, spiralVariables } from './constants'

const Selection = ({ data, dataType, format, locations, map }) => {
    const dataBrackets = getDataBrackets(data)
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
        <div>
            <FilterPanel
                axis={map ? null : axis}
                fillMissing={fillMissing}
                format={format}
                handleSelect={handleSelect}
                handleAxisSelect={map ? null : handleAxisSelect}
                handleFillMissingCheck={handleFillMissingCheck}
                handlePinCheck={handlePinCheck}
                handleOpaqueCheck={handleOpaqueCheck}
                handleYearIndicationSelect={handleYearIndicationSelect}
                opaque={opaque}
                pinView={pinView}
                selections={selections}
                variables={variables}
                yearIndication={yearIndication}
            />

            {map ? (
                <LeafletMap
                    data={data}
                    dataBrackets={dataBrackets}
                    dataType={dataType}
                    fillMissing={fillMissing}
                    locations={locations}
                    mapPin={pinView}
                    opaque={opaque}
                    selections={selections}
                    shape={format}
                    yearIndication={yearIndication}
                />
            ) : (
                error ? (
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
                                            data={data}
                                            dataBrackets={dataBrackets}
                                            dataType={dataType}
                                            fillMissing={fillMissing}
                                            key={`${dataType}-xval: ${xval} yval: ${yval}`}
                                            locations={locations}
                                            mapPin={pinView}
                                            numX={variables[axis["x-axis"]]?.values?.length}
                                            opaque={opaque}
                                            selections={{ ...selections, [axis["x-axis"]]: xval, [axis["y-axis"]]: yval }}
                                            shape={format}
                                            yearIndication={yearIndication}
                                        />
                                    </span>
                                ))}
                            </span>
                        ))}
                    </span>
                )
            )}
        </div>
    )
}

export default Selection
