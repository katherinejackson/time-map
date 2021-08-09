import React, { useEffect, useState } from 'react'

import './App.css';
import {alaska as locations} from "./data/locationCoords";
import { dataSets, views } from "./constants";
import Selection from "./Selection";
import { bigData as covidData } from "./data/covidData";
import { data as tradeData } from "./data/tradeData"
import DataContext from './DataContext';
import { data as mapData } from "./data/weatherData"
import { getDataBrackets, getDataBracketsMultiYear, getDataCategories, getVariableBrackets, getTradeDataBrackets, getAverage } from "./helpers/data"

let shape = 1

const getData = (view) => {
    if (view === views.SCATTER.val) {
        const dataBrackets = getDataBracketsMultiYear(covidData, 'cases')
        const dataType = dataSets.COVID.val
        const yBrackets = getVariableBrackets(covidData, 'population')
        const categories = getDataCategories(covidData, 'continent')

        return { data: covidData, dataType, dataBrackets, yBrackets, categories }

    } else if (view === views.GRAPH.val) {
        let var1 = 'import'
        let var2 = 'tradeBalance'
        const dataBrackets = getTradeDataBrackets(tradeData, var1)
        const dataType = dataSets.TRADE.val
        getAverage(tradeData, var2)

        return { data: tradeData, dataType, dataBrackets, variable: var1 }

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

    return (
        <DataContext.Provider value={{ data, dataType, yBrackets, dataBrackets, categories, totalDataPts, locations, variable }}>
            <div className="row justify-content-center">
                <Selection shape={shape} view={view} />
            </div>
        </DataContext.Provider>
    )
}

export default DataSelector