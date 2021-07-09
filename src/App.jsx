import React, { useState } from 'react'

import './App.css';
import { views } from "./constants";

import DataSelector from './DataSelector';

const App = () => {
    const [view, setView] = useState(null)

    const handleViewChange = (event) => {
        setView(event.target.value)
    }

    return (
        <div className="container-fluid my-5">
            <div className="row justify-content-center gap-3">
                <label className="col-form-label w-auto">View</label>
                <select className="form-select w-auto" defaultValue="select" onChange={handleViewChange} name="Display type">
                    <option disabled value="select" id="select"> -- select an option -- </option>
                    {Object.keys(views).map(view => <option key={`views-${views[view].id}`} value={views[view].val}>{views[view].name}</option>)}
                </select>
                {view ? (
                    <DataSelector view={view} />
                ) : null}
            </div>
        </div>
    );
}

export default App;
