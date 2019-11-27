const json = require('../data/countylocations.json');
import vegaEmbed from 'vega-embed'


const initBarCharts = function () {
    let data = getDummyData()
    let barChart = createBarChart(data)
    vegaEmbed('#opioid-bar-chart', barChart)
}


let getDummyData = () => {
    return [{
            "state": "Alabama",
            "opioidFactor": 105
        },
        {
            "state": "Colorado",
            "opioidFactor": 54
        },
        {
            "state": "Washington",
            "opioidFactor": 19
        },
        {
            "state": "California",
            "opioidFactor": 191
        },
        {
            "state": "Utah",
            "opioidFactor": 71
        },
        {
            "state": "Michigan",
            "opioidFactor": 211
        },
        {
            "state": "Alaska",
            "opioidFactor": 132
        },

    ]
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
                "type": "quantitative"
            }
        }
    }
    return barChart;



}


export {
    initBarCharts
}