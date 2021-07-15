import React, { useEffect, useState } from 'react'

import './App.css';
import raw from "./popdataSmall.txt";
import textDecoder from "./textDecoder";
import { dataSets, shapes, views } from "./constants";
import Selection from "./Selection";
import { bigData as covidData } from "./covidData";
import { data as tradeData } from "./tradeData"
import DataContext from './DataContext';
import { data as mapData } from "./data"
import { getDataBrackets, getDataBracketsMultiYear, getDataCategories, getVariableBrackets, getTradeDataBrackets } from "./helpers/data"

const getData = (view) => {
    if (view === views.SCATTER.val) {
        const dataBrackets = getDataBracketsMultiYear(covidData, 'cases')
        const dataType = dataSets.COVID.val
        const yBrackets = getVariableBrackets(covidData, 'population')
        const categories = getDataCategories(covidData, 'continent')

        return { data: covidData, dataType, dataBrackets, yBrackets, categories }

    } else if (view === views.GRAPH.val) {
        let variable = 'export'
        const dataBrackets = getTradeDataBrackets(tradeData, variable )
        const dataType = dataSets.TRADE.val

        return { data: tradeData, dataType, dataBrackets, variable }

    } else if (view === views.COMPARISON.val || view === views.MAP.val) {
        let data = mapData[dataSets.TEMP.id].data
        const dataType = dataSets.TEMP.val
        const dataBrackets = getDataBrackets(data)

        return { data, dataType, dataBrackets }
    }

    return {}
}

const DataSelector = ({ view }) => {
    const [totalDataPts, setTotalDataPts] = useState(null)
    const [locations, setLocations] = useState([])
    const [shape, setShape] = useState(shapes.SPIRAL.id)
    const { data, dataType, dataBrackets, yBrackets, categories, variable } = getData(view)

    useEffect(() => {
        if (!totalDataPts && categories) {
            let total = 0
            Object.keys(categories).forEach(cat => {
                total += categories[cat]
            })

            setTotalDataPts(total)
        }
    }, [categories])

    if (!locations.length) {
        fetch(raw)
            .then(r => r.text())
            .then(text => textDecoder(text))
            .then(locations => setLocations(locations));
    }

    const handleShapeChange = (event) => {
        setShape(parseInt(event.target.value))
    }

    return (
        <DataContext.Provider value={{ data, dataType, yBrackets, dataBrackets, categories, totalDataPts, locations, variable }}>
            <div className="row justify-content-center">
                <label className="col-form-label w-auto">Display Type</label>
                <select className="form-select w-auto" defaultValue={shape} onChange={handleShapeChange} name="Display type">
                    {Object.keys(shapes).map(shape => <option key={`shape-${shapes[shape].id}`} value={shapes[shape].id}>{shapes[shape].name}</option>)}
                </select>
                {/* <label className="col-form-label w-auto ms-3">Data Set</label>
                            <select className="form-select w-auto" defaultValue={dataSet} onChange={handleDataSetChange} name="DataSet">
                                {Object.keys(dataSets).map(type => <option key={`dataset-${dataSets[type].id}`} value={dataSets[type].val}>{dataSets[type].name}</option>)}
                            </select> */}
                <Selection shape={shape} view={view} />
            </div>
        </DataContext.Provider>
    )
}

export default DataSelector