import vegaEmbed from 'vega-embed'
let stateYearlyOpioidUse = require("../data/full_sets/state_yearly_full.json")
const usPopulation2010 = 309011475



let initLineCharts = () => {
    let data = getLineData()
    let lineChart = createLineChart(data)
    vegaEmbed("#opioid-line-chart", lineChart)
}



let getLineData = () => {

    let yearOpioidMap = stateYearlyOpioidUse.map(state => {
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

let createLineChart = (data) => {
    let lineChart = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "description": "Google's stock price over time.",
        "data": {
            "name": "table",
            "values": data
        },
        "mark": "line",
        "encoding": {
          "x": {
            "field": "year",
            "type": "temporal",
            "timeUnit": "year"
        },
          "y": {
            "field": "opioidFactor",
            "type": "quantitative"
        }
        }
      }
    return lineChart
}



export {
    initLineCharts
}