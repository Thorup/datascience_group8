import vegaEmbed from 'vega-embed'
let homelessCluster = require("../data/full_sets/clusters/homeless_cluster.json")
let incomeCluster = require("../data/full_sets/clusters/income_cluster.json")
let crimeCluster = require("../data/full_sets/clusters/crime_cluster.json")
let unempCluster = require("../data/full_sets/clusters/unemp_cluster.json")



let initClusterPlots = () => {
    initHomelessPlot(homelessCluster)
    initIncomePlot(incomeCluster)
    initCrimePlot(crimeCluster)
    initUnempCluster(unempCluster)

}



let initIncomePlot = (data) => {
    let plot = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "description": "A scatterplot showing horsepower and miles per gallons for various cars.",
        "data": {
            values: data
        },
        "mark": "point",
        "encoding": {
            "x": {
                "field": "Average_Income",
                "type": "quantitative"
            },
            "y": {
                "field": "new_opioid_factor",
                "type": "quantitative"
            },
            "color": {
                "field": "prediction",
                "type": "nominal"
            }
        }
    }
    vegaEmbed("#income-cluster", plot)
}

let initCrimePlot = (data) => {
    let plot = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "description": "A scatterplot showing horsepower and miles per gallons for various cars.",
        "data": {
            values: data
        },
        "mark": "point",
        "encoding": {
            "x": {
                "field": "Crime_Percent",
                "type": "quantitative"
            },
            "y": {
                "field": "new_opioid_factor",
                "type": "quantitative"
            },
            "color": {
                "field": "prediction",
                "type": "nominal"
            }
        }
    }
    vegaEmbed("#crime-cluster", plot)
}

let initUnempCluster = (data) => {
    let plot = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "description": "A scatterplot showing horsepower and miles per gallons for various cars.",
        "data": {
            values: data
        },
        "mark": "point",
        "encoding": {
            "x": {
                "field": "Unemployment_Percent",
                "type": "quantitative"
            },
            "y": {
                "field": "new_opioid_factor",
                "type": "quantitative"
            },
            "color": {
                "field": "prediction",
                "type": "nominal"
            }
        }
    }
    vegaEmbed("#unemp-cluster", plot)
}

let initHomelessPlot = (data) => {
    let plot = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "description": "A scatterplot showing horsepower and miles per gallons for various cars.",
        "data": {
            values: data
        },
        "mark": "point",
        "encoding": {
            "x": {
                "field": "Homeless_Percent",
                "type": "quantitative"
            },
            "y": {
                "field": "new_opioid_factor",
                "type": "quantitative"
            },
            "color": {
                "field": "prediction",
                "type": "nominal"
            }
        }
    }
    vegaEmbed("#homeless-cluster", plot)
}

export {
    initClusterPlots
}