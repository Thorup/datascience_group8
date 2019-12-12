const json = require('../data/full_sets/state_yearly_full.json');
import vegaEmbed from 'vega-embed'


const initBarCharts = function () {
    let data = getDataByYear("2007")
    let barChart = createBarChart(data)
    vegaEmbed('#opioid-bar-chart', barChart)
}


let  getDataByYear = (year) => {
    let opioidFactorByYear = json.map(state => {
        return {
            state: state.State,
            opioidFactor: (state.Opioid_Factor/state.Population),
            year: state.Year
        }
    }).filter(state => state.year == year)
    return opioidFactorByYear
}


let createBarChart = (data) => {

    let barChart = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "description": "A simple bar chart with embedded data.",
        "data": {
            "values": data
        },
        "mark": "bar",
        "encoding": {
            "x": {
                "field": "state",
                "type": "ordinal"
            },
            "y": {
                "field": "opioidFactor",
                "type": "quantitative",
                "sort": "-x"
            }
        }
    }
    return barChart;



}


export {
    initBarCharts
}