import React, {useEffect, useState} from "react";

import Tile from "./Tile";
import { getDataBrackets } from "./helpers";
import {formats, rectValues, rectVariables, spiralValues, spiralVariables, views} from './constants'

const getDefaultSelections = (format, dataType) => {
    let selections = {}
    if (format === formats.SPIRAL.id) {
        Object.keys(spiralValues).forEach(val => {
            selections[spiralValues[val]] = spiralVariables[dataType][spiralValues[val]].default
        })
    } else {
        Object.keys(rectValues).forEach(val => {
            selections[rectValues[val]] = rectVariables[dataType][rectValues[val]].default
        })
    }

    return selections
}

const ComparisonSelection = ({ data, dataType, format, locations }) => {
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
    }, [format])

    const handleSelect = (event, id) => {
        setSelections({ ...selections, [id]: parseFloat(event.currentTarget.value)})
    }

    const handleAxisSelect = (event, id) => {
        setAxis({ ...axis, [id]: parseInt(event.currentTarget.value)})
        setError(isError({ ...axis, [id]: parseInt(event.currentTarget.value)}))
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
        <div className="flex-row">
            <div className="flex-col">
                <label>x-axis</label>
                <select defaultValue="select" id='x-axis' onChange={(e) => handleAxisSelect(e, 'x-axis')} name='x-axis'>
                    <option disabled value="select" id="select"> -- select an option -- </option>
                    {Object.keys(variables).map(id => <option key={`x-axis-${id}`} value={id}>{variables[id].name}</option>)}
                </select>
                <label>y-axis</label>
                <select defaultValue="select" id='y-axis' onChange={(e) => handleAxisSelect(e, 'y-axis')} name='y-axis'>
                    <option disabled value="select" id="select"> -- select an option -- </option>
                    {Object.keys(variables).map(id => <option key={`y-axis-${id}`} value={id}>{variables[id].name}</option>)}
                </select>
                <hr />
                <span className="flex-row">
                    <input type="checkbox" defaultChecked={pinView} onChange={handlePinCheck}/>
                    <label>View as map pin</label>
                </span>
            </div>

            <div className="flex-col">
                {Object.keys(variables).map(id => (
                    <div className="flex-col" key={`${format}-${id}`}>
                        <label htmlFor={`${format}-${id}`}>{variables[id].name}</label>
                        <select
                            defaultValue={selections[id]}
                            disabled={axis["x-axis"] === parseInt(id) || axis["y-axis"] === parseInt(id)}
                            id={`${format}-${id}`}
                            key={`${format}-${id}-${Math.random().toString().slice(0, 6)}`}
                            onChange={(e) => handleSelect(e, id)}
                            name={variables[id].name}
                        >
                            {variables[id].values.map(val => <option id={`${id}-${val}`} key={`${id}-${val}`} value={val}>{val}</option>)}
                        </select>
                    </div>
                ))}
            </div>

            {error ? "Please make a valid selection" : (
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
                                      key={`x-` + xval + `y-` + yval}
                                      locations={locations}
                                      mapPin={pinView}
                                      selections={{...selections, [axis["x-axis"]]: xval, [axis["y-axis"]]: yval}}
                                      shape={format}
                                      view={views.COMPARISON.val}
                                  />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ComparisonSelection
