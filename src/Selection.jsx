import React, { useEffect, useState } from "react";

import Tile from "./Tile";
import FilterPanel from "./FilterPanel"
import { getDataBrackets, getDefaultSelections } from "./helpers";
import { formats, rectVariables, spiralVariables, views } from './constants'

const Selection = ({ data, dataType, format, locations, map }) => {
    const dataBrackets = getDataBrackets(data)
    const [error, setError] = useState(true)
    const [axis, setAxis] = useState({
        'x-axis': null,
        'y-axis': null,
    })
    const [selections, setSelections] = useState(getDefaultSelections(format, dataType))
    const [pinView, setPinView] = useState(false)
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

    const handlePinCheck = () => {
        setPinView(!pinView)
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
                format={format}
                handleSelect={handleSelect}
                handleAxisSelect={map ? null : handleAxisSelect}
                handlePinCheck={handlePinCheck}
                pinView={pinView}
                selections={selections}
                variables={variables}
            />

            {map ? (
                <Tile
                    data={data}
                    dataBrackets={dataBrackets}
                    dataType={dataType}
                    locations={locations}
                    mapPin={pinView}
                    selections={selections}
                    shape={format}
                    view={views.MAP.val}
                />
            ) : (
                error ? (
                    <h3 className="text-danger">
                        Please make a valid selection
                    </h3>
                ) : (
                    <div className="flex-row">
                        {variables[axis["x-axis"]].values.map((xval) => (
                            <div className="flex-col" key={`x-${xval}`}>
                                {variables[axis["y-axis"]].values.map((yval) => (
                                    <span
                                        key={`x-` + xval + `y-` + yval}
                                        title={variables[axis["x-axis"]].name + ': ' + xval + '  ' + variables[axis["y-axis"]].name + ': ' + yval}
                                    >
                                        <Tile
                                            data={data}
                                            dataBrackets={dataBrackets}
                                            dataType={dataType}
                                            key={`${dataType}-xval: ${xval} yval: ${yval}`}
                                            locations={locations}
                                            mapPin={pinView}
                                            numX={variables[axis["x-axis"]]?.values?.length}
                                            selections={{ ...selections, [axis["x-axis"]]: xval, [axis["y-axis"]]: yval }}
                                            shape={format}
                                            view={views.COMPARISON.val}
                                        />
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}

export default Selection
