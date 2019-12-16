import vegaEmbed from 'vega-embed'
let monthlyFips = require("../data/full_sets/fips_monthly_TRUE.json")


let initCountyChoro = (year, month) => {
  let data = createDateData(year, month)
  let choro = createChoroMap(data)
  vegaEmbed("#county-choro", choro)
}

let createDateData = (year, month) => {

console.log(year)

  let reducedMap = monthlyFips
    .filter(county => county.year == year)
    .filter(county => county.month == month)
    console.log(reducedMap)
    return reducedMap;
}

let createChoroMap = (data) => {
  let choro = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "width": 1000,
    "height": 700,
    "data": {
      "url": "https://vega.github.io/vega/data/us-10m.json",
      "format": {
        "type": "topojson",
        "feature": "counties"
      }
    },
    "transform": [{
      "lookup": "id",
      "from": {
        "data": {
          "values": data
        },
        "key": "fips",
        "fields": ["opioid_factor"]
      }
    }],
    "projection": {
      "type": "albersUsa"
    },
    "mark": "geoshape",
    "encoding": {
      "color": {
        "field": "opioid_factor",
        "type": "quantitative"
      }
    }
  }
  return choro
}



export {
  initCountyChoro
}