import React, {useEffect, useState} from "react";

import Tile from "./Tile"
import { getDataBrackets, getDefaultSelections } from "./helpers";
import {formats, rectVariables, spiralVariables, views} from './constants'
import FilterPanel from "./FilterPanel";

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
        <>
            <FilterPanel 
                format={format} 
                handleSelect={handleSelect}
                handlePinCheck={handlePinCheck}
                pinView={pinView}
                selections={selections}
                variables={variables}
            />

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
        </>
    )
}

export default MapSelection