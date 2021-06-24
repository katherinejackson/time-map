import React, { useState } from 'react'

import './App.css';
import { dataSets, formats, views } from "./constants";
import raw from "./popdataSmall.txt";
import textDecoder from "./textDecoder";
import Selection from "./Selection";
import { data } from "./data";

const App = () => {
    const [locations, setLocations] = useState(null)
    const [format, setFormat] = useState(formats.SPIRAL.id)
    const [dataSet, setDataSet] = useState(dataSets.TEMP.val)
    const [view, setView] = useState(null)

    if (!locations) {
        fetch(raw)
            .then(r => r.text())
            .then(text => textDecoder(text))
            .then(locations => setLocations(locations));
    }

    const handleFormatChange = (event) => {
        setFormat(parseInt(event.target.value))
    }

    const handleDataSetChange = (event) => {
        setDataSet(event.target.value)
    }

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
                    <div className="row justify-content-center">
                        <label className="col-form-label w-auto">Display Type</label>
                        <select className="form-select w-auto" defaultValue={format} onChange={handleFormatChange} name="Display type">
                            {Object.keys(formats).map(format => <option key={`format-${formats[format].id}`} value={formats[format].id}>{formats[format].name}</option>)}
                        </select>
                        <label className="col-form-label w-auto ms-3">Data Set</label>
                        <select className="form-select w-auto" defaultValue={dataSet} onChange={handleDataSetChange} name="DataSet">
                            {Object.keys(dataSets).map(type => <option key={`dataset-${dataSets[type].id}`} value={dataSets[type].val}>{dataSets[type].name}</option>)}
                        </select>
                        <Selection data={data[dataSets[dataSet].id].data} dataType={dataSet} format={format} locations={locations} map={view === views.MAP.val}/>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default App;