import React, {useEffect, useState} from "react";

import Tile from "./Tile"
import { getDataBrackets, getDefaultSelections } from "./helpers";
import {formats, rectVariables, spiralVariables, views} from './constants'

const MapSelection = ({ data, dataType, format, locations }) => {
    const dataBrackets = getDataBrackets(data)
    const [selections, setSelections] = useState(getDefaultSelections(format, dataType))
    const [pinView, setPinView] = useState(false)
    const variables = format === formats.SPIRAL.id ? spiralVariables[dataType] : rectVariables[dataType]

    useEffect(() => {
        setSelections(getDefaultSelections(format, dataType))
    }, [format, dataType])

    const handleSelect = (event, id) => {
        setSelections({ ...selections, [id]: parseFloat(event.currentTarget.value)})
    }

    const handlePinCheck = () => {
        setPinView(!pinView)
    }

    return (
        <div className="flex-row">
            <div className="flex-col">
                {Object.keys(variables).map(id => (
                    <div className="flex-col" key={`${format}-${id}`}>
                        <label htmlFor={`${format}-${id}`}>{variables[id].name}</label>
                        <select
                            defaultValue={selections[id]}
                            id={`${format}-${id}`}
                            key={`${format}-${id}-${Math.random().toString().slice(0, 6)}`}
                            onChange={(e) => handleSelect(e, id)}
                            name={variables[id].name}
                        >
                            {variables[id].values.map(val => <option id={`${id}-${val}`} key={`${id}-${val}`} value={val}>{val}</option>)}
                        </select>
                    </div>
                ))}
                <hr />

                <span className="flex-row">
                    <input type="checkbox" defaultChecked={pinView} onChange={handlePinCheck}/>
                    <label>View as map pin</label>
                </span>
            </div>

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
        </div>
    )
}

export default MapSelection