import React from 'react'

import { getBasicSelectionOptions, getShapeSelectionOptions } from './helpers/selections'
import { views } from './constants'

const SelectionPanel = ({ selections, setSelections, shape, setX, setY, view, x, y }) => {
    const basicOptions = getBasicSelectionOptions()
    const shapeOptions = getShapeSelectionOptions(shape)
    const options = { ...basicOptions, ...shapeOptions }

    const handleSelectionChange = (event, option) => {
        let val = event.target.value
        if (val === 'true') {
            val = 1
        } else if (val === 'false') {
            val = 0
        }

        if (parseFloat(val)) {
            val = parseFloat(val)
        }

        setSelections({ ...selections, [option]: val })
    }

    const getValString = (val) => {
        if (typeof val === "boolean" && val) {
            val = 'true'
        } else if (typeof val === "boolean" && !val) {
            val = 'false'
        }

        return val
    }

    return (
        <div className="row justify-content-center gap-3">
            {view === views.COMPARISON.val ? (
                <div className="col justify-content-center gap-3">
                    <label className="col-form-label w-auto">X-Axis</label>
                    <select className="form-select w-auto" defaultValue={x || 'select'} onChange={e => setX(e.target.value)} >
                        <option disabled value="select" id="select"> -- select an option -- </option>
                        {Object.keys(options).map(opt => <option key={`x-${opt}`} value={opt}>{options[opt].name}</option>)}
                    </select>

                    <label className="col-form-label w-auto">Y-Axis</label>
                    <select className="form-select w-auto" defaultValue={y || 'select'} onChange={e => setY(e.target.value)} >
                        <option disabled value="select" id="select"> -- select an option -- </option>
                        {Object.keys(options).map(opt => <option key={`y-${opt}`} value={opt}>{options[opt].name}</option>)}
                    </select>
                </div>
            ) : null}

            <div className="col justify-content-center gap-3">
                {Object.keys(shapeOptions).map(option => (
                    <div className="row justify-content-center gap-3">
                        <label className="col-form-label w-auto">{shapeOptions[option]['name']}</label>
                        <select className="form-select w-auto" defaultValue={selections[option]} disabled={option === x || option === y} onChange={event => handleSelectionChange(event, option)}>
                            {shapeOptions[option]['values'].map(val => <option key={`shapeOption-${option}-${val}`} value={val}>{val}</option>)}
                        </select>
                    </div>
                ))}
            </div>

            <div className="col justify-content-center gap-3">
                {Object.keys(basicOptions).map(option => (
                    <div className="row justify-content-center gap-3">
                        <label className="col-form-label w-auto">{basicOptions[option]['name']}</label>
                        <select className="form-select w-auto" defaultValue={selections[option]} disabled={option === x || option === y} onChange={event => handleSelectionChange(event, option)} >
                            {basicOptions[option]['values'].map(val => <option key={`basicOption-${option}-${val}`} value={val}>{getValString(val)}</option>)}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default SelectionPanel