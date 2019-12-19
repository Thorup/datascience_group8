import vegaEmbed from 'vega-embed'
let clusters = require("../data/full_sets/clusters/clusters_10k.json")
let width = 300;
let height = 300;


let initClusterPlots = () => {
    initHomelessPlot(clusters)
    initIncomePlot(clusters)
    initCrimePlot(clusters)
    initUnempCluster(clusters)

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
                "field": "z_score_AvgInc",
                "type": "quantitative"
            },
            "y": {
                "title": "Opioid Use",
                "field": "z_score_opioid",
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
                "field": "z_score_Crime",
                "type": "quantitative"
            },
            "y": {
                "title": "Opioid Use",
                "field": "z_score_opioid",
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
                "field": "z_score_Unem",
                "type": "quantitative"
            },
            "y": {
                "title": "Opioid Use",
                "field": "z_score_opioid",
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
                "title": "Homelessness",
                "field": "z_score_Homeless",
                "type": "quantitative"
            },
            "y": {
                "title": "Opioid Use",
                "field": "z_score_opioid",
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