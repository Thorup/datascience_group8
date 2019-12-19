import vegaEmbed from 'vega-embed'
import {
    reduce
} from 'vega-lite/build/src/encoding'
let countyMonthlyOpioidUse = require("../data/full_sets/LATEST_TRUE_FILE_2.json")



let initLineCharts = (year) => {
    let data = getLineData()
    let lineChart = createLineChart(data)
    vegaEmbed("#opioid-line-chart", lineChart)
}



let getLineData = () => {

    let reducedSet = []
    let combineDate = countyMonthlyOpioidUse
        .filter(county => county.opioid_factor != undefined)
        .filter(county => county.year != undefined)
        .filter(county => county.month != undefined)
        .filter(county => county.opioid_factor < 2500000)
        .map(county => {
            return {
                date: county.month + (county.year-2007)*12,
                opioid_factor: county.opioid_factor,
                fips: county.fips
            }
        })
    let distinctDates = [...new Set(combineDate
            .map(county => county.date))]
        .filter(date => date != undefined)


    console.log(distinctDates)
    console.log(combineDate)

    for (let i = 0; i < distinctDates.length; i++) {
        let date = distinctDates[i]
        let opioidSum = 0;



        combineDate.forEach(county => {
            if (county.date == date) {
                let factor = Math.floor(parseInt(county.opioid_factor))
                opioidSum = opioidSum + factor
            }
        })
        reducedSet.push({
            date: date,
            opioid_factor: opioidSum
        })

    }
    console.log(reducedSet)

    return reducedSet
}
let createLineChart = (data) => {
        let lineChart = {
            "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
            "description": "Development in Opioid Purchases By Pharmacies from 2007 to 2012",
            "title": "Development in Opioid Purchases and Thefts",
            "width": 1000,
            "height": 700,
            "data": {
                values: data
            },
            "mark": "line",
            "transform": [
                {
                  "regression": "date",
                  "on": "opioid_factor"
                }
              ],
            "encoding": {
                "x": {
                    "field": "date",
                    "type": "temporal",
                    "timeUnit": "monthyear",
                    "title": "Date"
                },
                "y": {
                    "field": "opioid_factor",
                    "type": "quantitative",
                    "title": "Opioid sales and thefts in mg"
                }
            }
            }
            return lineChart
        }



        export {
            initLineCharts
        }