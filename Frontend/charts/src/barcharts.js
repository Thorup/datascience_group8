const json = require('../data/full_sets/state_yearly_full.json');
const usPopulation2010 = 309011475
import vegaEmbed from 'vega-embed'


const initBarCharts = function (year) {
    let data = getDataByYear(year)
    let barChart = createBarChart(data)
    let yearlyBarDataAcc = getYearAccData()
    let yearlyAccBarChart = createYearBarChart(yearlyBarDataAcc)
    appendYearlyButtons()
    //vegaEmbed("#opioid-bar-chart-year-acc", yearlyAccBarChart)
    vegaEmbed('#opioid-bar-chart', barChart)
}


let getDataByYear = (year) => {
    let opioidFactorByYear = json.map(state => {
        return {
            state: state.State,
            opioidFactor: Math.floor(Math.floor(state.Opioid_Factor) / state.Population),
            year: state.Year
        }
    }).filter(state => state.year == year)
    return opioidFactorByYear
}

let getYearAccData = () => {

    let yearOpioidMap = json.map(state => {
        return {
            year: state.Year,
            opioidFactor: state.Opioid_Factor
        }
    })
    let yearOpioidMapReduced = []
    const years = [...new Set(yearOpioidMap.map(o => o.year))].filter(year => year != undefined);
    years.forEach(year => {
        let sum = 0;
        yearOpioidMap.forEach( o => {
            if(o.year == year){
            sum += o.opioidFactor;
            }
        })
        sum = Math.floor(sum/usPopulation2010)
        yearOpioidMapReduced.push({
            year: year,
            opioidFactor: sum
        })
    })
    return yearOpioidMapReduced
}

let createYearBarChart = (data) => {
    let barChart = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "description": "A simple bar chart with embedded data.",
        "title": "Average Opioid Sale and Thefts By Year",
        "width": 300,
        "height": 550,
        "data": {
            "values": data
        },
        "mark": "bar",
        "encoding": {
            "y": {
                "field": "year",
                "type": "ordinal",
                "title": "Year"
            },
            "x": {
                "field": "opioidFactor",
                "type": "quantitative",
                "title": "Opioid sales and thefts in mg",
                "scale": {
                    "domain": [0, 12000]
                }
            }
        }
    }
    return barChart;
}


let appendYearlyButtons = () => {
    if (document.getElementById("button-container").childNodes.length == 0) {
        let years = [...new Set(json
                .map(state => state.Year))]
            .filter(year => year != undefined);
        let barchartContainer = document.getElementById("button-container")
        for (let i = 0; i < years.length; i++) {
            let year = years[i]
            let btn = document.createElement('button')
            btn.classList.add("barchart-year-btn")
            btn.classList.add("btn")
            btn.classList.add("btn-primary")
            btn.id = "btn-year-" + year
            btn.innerHTML = year
            btn.onclick = yearClicked
            btn.value = year
            barchartContainer.appendChild(btn)
        }
    }
}

let yearClicked = (e) => {
    let year = e.target.value
    initBarCharts(year)
}


let createBarChart = (data) => {

    let barChart = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "description": "Opioid Purchases and Thefts By States",
        "title": "Opioid Purchases and Thefts By States",
        "width": 1000,
        "height": 800,
        "data": {
            "values": data
        },
        "mark": "bar",
        "encoding": {
            "x": {
                "field": "state",
                "type": "ordinal",
                "title": "States",
                "sort": "-y"
            },
            "y": {
                "field": "opioidFactor",
                "type": "quantitative",
                "title": "Opioid sales and thefts in mg",
                "sort": "-x",
                "scale": {
                    "domain": [0, 60000]
                }
            }
        }
    }
    return barChart;
}


export {
    initBarCharts
}