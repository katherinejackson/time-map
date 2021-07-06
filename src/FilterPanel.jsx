import React, {useContext} from "react";

import { yearIndicators } from "./constants"
import SelectionContext from "./SelectionContext";

const FilterPanel = ({
    axis,
    handleSelect,
    handleAxisSelect,
    handleFillMissingCheck,
    handlePinCheck,
    handleOpaqueCheck,
    handleYearIndicationSelect,
}) => {
    const { selections, fillMissing, mapPin, opaque, shape, variables, yearIndication } = useContext(SelectionContext)

    return (
        <div className="container row row-col-3 mt-3">
            {axis ? (
                <div className="col">
                    <div className="row mb-2">
                        <div className="col d-flex justify-content-end">
                            <label htmlFor="x-axis" className="col-form-label w-auto">x-axis</label>
                        </div>
                        <div className="col">
                            <select className="form-select" defaultValue="select" id='x-axis' onChange={(e) => handleAxisSelect(e, 'x-axis')} name='x-axis'>
                                <option disabled value="select" id="select-x"> -- select an option -- </option>
                                {Object.keys(variables).map(id => <option key={`x-axis-${id}`} value={id}>{variables[id].name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col d-flex justify-content-end">
                            <label htmlFor="y-axis" className="col-form-label w-auto">y-axis</label>
                        </div>
                        <div className="col">
                            <select className="form-select" defaultValue="select" id='y-axis' onChange={(e) => handleAxisSelect(e, 'y-axis')} name='y-axis'>
                                <option disabled value="select" id="select-y"> -- select an option -- </option>
                                {Object.keys(variables).map(id => <option key={`y-axis-${id}`} value={id}>{variables[id].name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="flex col justify-content-center gap-3">
                {Object.keys(variables).map(id => (
                    <div className="row mb-2" key={`${shape}-${id}`}>
                        <div className="col d-flex justify-content-end">
                            <label className="form-label" htmlFor={`${shape}-${id}`}>{variables[id].name}</label>
                        </div>
                        <div className="col">
                            <select
                                className="form-select w-50"
                                defaultValue={selections[id]}
                                disabled={axis ? axis["x-axis"] === parseInt(id) || axis["y-axis"] === parseInt(id) : false}
                                id={`${shape}-${id}`}
                                key={`${shape}-${id}-${Math.random().toString().slice(0, 6)}`}
                                onChange={(e) => handleSelect(e, id)}
                                name={variables[id].name}
                            >
                                {variables[id].values.map(val => <option id={`${id}-${val}`} key={`${id}-${val}`} value={val}>{val}</option>)}
                            </select>
                        </div>
                    </div>
                ))}

            </div>

            <div className="col">
                <div className="row">
                    <div className="col d-flex justify-content-end">
                        <label lass="col col-form-label w-auto">View as map pin</label>
                    </div>
                    <div className="col">
                        <input className="form-check" type="checkbox" defaultChecked={mapPin} onChange={handlePinCheck} />
                    </div>
                </div>

                <div className="row">
                    <div className="col d-flex justify-content-end">
                        <label lass="col col-form-label w-auto">Opaque Background</label>
                    </div>
                    <div className="col">
                        <input className="form-check" type="checkbox" defaultChecked={opaque} onChange={handleOpaqueCheck} />
                    </div>
                </div>

                <div className="row">
                    <div className="col d-flex justify-content-end">
                        <label lass="col col-form-label w-auto">Fill Missing Data</label>
                    </div>
                    <div className="col">
                        <input className="form-check" type="checkbox" defaultChecked={fillMissing} onChange={handleFillMissingCheck} />
                    </div>
                </div>

                <div className="row">
                    <div className="col d-flex justify-content-end">
                        <label htmlFor="yearIndication" className="col-form-label w-auto">Year Indication</label>
                    </div>
                    <div className="col">
                        <select className="form-select" defaultValue="none" id='yearIndication' onChange={(e) => handleYearIndicationSelect(e)} name='yearIndication'>
                            <option value="none" id="no-year">None</option>
                            {Object.keys(yearIndicators).map(id => <option key={`year-${id}`} value={id}>{yearIndicators[id].name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default FilterPanel
