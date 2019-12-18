import vegaEmbed from 'vega-embed'
let homelessCluster = require("../data/full_sets/clusters/homeless_cluster.json")
let incomeCluster = require("../data/full_sets/clusters/income_cluster.json")
let crimeCluster = require("../data/full_sets/clusters/crime_cluster.json")
let unempCluster = require("../data/full_sets/clusters/unemp_cluster.json")
let width = 450;
let height = 450;


let initClusterPlots = () => {
    initHomelessPlot(homelessCluster)
    initIncomePlot(incomeCluster)
    initCrimePlot(crimeCluster)
    initUnempCluster(unempCluster)

}



let initIncomePlot = (data) => {
    let plot = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "title": "Clusters for opioid use and average income",
        "height": height,
        "width": width,
        "data": {
            values: data
        },
        "mark": "point",
        "encoding": {
            "x": {
                "title": "Average Income",
                "field": "Average_Income",
                "type": "quantitative"
            },
            "y": {
                "title": "Opioid Use",
                "field": "new_opioid_factor",
                "type": "quantitative"
            },
            "color": {
                "title": "Clusters",
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
        "title": "Clusters for opioid use and reported crimes",
        "width": width,
        "height": height,
        "data": {
            values: data
        },
        "mark": "point",
        "encoding": {
            "x": {
                "title": "Crime",
                "field": "Crime_Percent",
                "type": "quantitative"
            },
            "y": {
                "title": "Opioid Use",
                "field": "new_opioid_factor",
                "type": "quantitative"
            },
            "color": {
                "title": "Clusters",
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
        "width": width,
        "height": height,
        "title": "Clusters for opioid use and unemployment",
        "data": {
            values: data
        },
        "mark": "point",
        "encoding": {
            "x": {
                "title": "Unemployment",
                "field": "Unemployment_Percent",
                "type": "quantitative"
            },
            "y": {
                "title": "Opioid Use",
                "field": "new_opioid_factor",
                "type": "quantitative"
            },
            "color": {
                "title": "Clusters",
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
        "title": "Clusters for opioid use and homelessness",
        "width": width,
        "height": height,
        "data": {
            values: data
        },
        "mark": "point",
        "encoding": {
            "x": {
                "title": "",
                "field": "Homeless_Percent",
                "type": "quantitative"
            },
            "y": {
                "title": "Opioid Use",
                "field": "new_opioid_factor",
                "type": "quantitative"
            },
            "color": {
                "title": "Clusters",
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