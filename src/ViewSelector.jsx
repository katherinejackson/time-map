import React from 'react'

import { views } from './constants'

const ViewSelector = ({ handleViewChange }) => (
    <div className="row justify-content-center gap-3">
        <label className="col-form-label w-auto">View</label>
        <select className="form-select w-auto" defaultValue="select" onChange={handleViewChange} name="Display type">
            <option disabled value="select" id="select"> -- select an option -- </option>
            {Object.keys(views).map(view => <option key={`views-${views[view].id}`} value={views[view].val}>{views[view].name}</option>)}
        </select>
    </div>

)

export default ViewSelector