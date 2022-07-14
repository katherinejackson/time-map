import React from 'react'

import { getBasicSelectionOptions } from './helpers/selections'
import { dataSets, views } from './constants'
import { getMigrationSizes, getShapeSelections } from "./helpers/selections";

const SelectionPanel = ({ selections, setSelections, shape, setX, setY, view, x, y }) => {
    const options = getBasicSelectionOptions()

    if (view !== views.COMPARISON.val && view !== views.MULTI_COMPARISON.val) {
        delete options['dataSet']
    }

    const handleSelectionChange = (event, option) => {
        let val = event.target.value
        if (val === 'true') {
            val = true
        } else if (val === 'false') {
            val = false
        }

        if (parseFloat(val) || parseFloat(val) === 0 ) {
            val = parseFloat(val)
        }

        let row = {}
        let spiral = {}
        if (option === 'size') {
            if (selections.dataType === dataSets.MIGRATION.val) {
                spiral = getMigrationSizes(1, val)
                row = getMigrationSizes(2, val)
            } else {
                spiral = getShapeSelections(1, val)
                row = getShapeSelections(2, val)
            }
        }

        setSelections({ ...selections, [option]: val, ...row, ...spiral })
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
                {Object.keys(options).map(option => (
                    <div className="row justify-content-center gap-3" key={`${option}-selection`}>
                        <label className="col-form-label w-auto">{options[option]['name']}</label>
                        <select className="form-select w-auto" defaultValue={selections[option]} disabled={option === x || option === y} onChange={event => handleSelectionChange(event, option)} >
                            {options[option]['values'].map(val => <option key={`basicOption-${option}-${val}`} value={val}>{getValString(val)}</option>)}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default SelectionPanel