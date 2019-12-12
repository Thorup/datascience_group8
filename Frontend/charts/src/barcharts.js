const json = require('../data/full_sets/state_yearly_full.json');
import vegaEmbed from 'vega-embed'


const initBarCharts = function (year) {
    let data = getDataByYear(year)
    let barChart = createBarChart(data)
    if(document.getElementById("button-container").childNodes.length == 0){
    appendYearlyButtons()
    }
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

let appendYearlyButtons = () => {
    let years = [...new Set(json
        .map(state => state.Year))]
        .filter(year => year != undefined);
    let barchartContainer = document.getElementById("button-container")
    for(let i = 0; i < years.length; i++) {
        let year = years[i]
        let btn = document.createElement('button')
        btn.classList.add("barchart-year-btn")
        btn.id = "btn-year-" + year
        btn.innerHTML = year
        btn.onclick = yearClicked
        btn.value = year
        console.log(btn)
        barchartContainer.appendChild(btn)
    }
}

let yearClicked = (e) => {
    let year = e.target.value
    initBarCharts(year)
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