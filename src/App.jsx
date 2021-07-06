import React, { useState } from 'react'

import './App.css';
import { dataSets, formats, views } from "./constants";
import raw from "./popdataSmall.txt";
import textDecoder from "./textDecoder";
import Selection from "./Selection";
import { smallData as data } from "./covidData";

const App = () => {
    const [format, setFormat] = useState(formats.SPIRAL.id)
    const [dataSet, setDataSet] = useState(dataSets.TEMP.val)
    const [view, setView] = useState(null)

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
                <div className="row justify-content-center">
                    {/* <label className="col-form-label w-auto">Display Type</label>
                    <select className="form-select w-auto" defaultValue={format} onChange={handleFormatChange} name="Display type">
                        {Object.keys(formats).map(format => <option key={`format-${formats[format].id}`} value={formats[format].id}>{formats[format].name}</option>)}
                    </select>
                    <label className="col-form-label w-auto ms-3">Data Set</label>
                    <select className="form-select w-auto" defaultValue={dataSet} onChange={handleDataSetChange} name="DataSet">
                        {Object.keys(dataSets).map(type => <option key={`dataset-${dataSets[type].id}`} value={dataSets[type].val}>{dataSets[type].name}</option>)}
                    </select> */}
                    <Selection data={data} format={format} />
                </div>
            </div>
        </div>
    );
}

export default App;
