import vegaEmbed from 'vega-embed'
let data = require('../data/full_sets/state_yearly_full.json');





let initScatterMatrix = () => {
    let opioidFactorAndPopulation = data.map(state => {
        return {
            State: state.State,
            Opioid_Factor: state.Opioid_Factor/state.Population,
            Crime_Percent: state.Crime_Percent,
            Homeless_Percent: state.Homeless_Percent,
            Average_Income: state.Average_Income,
            Unemployment_Percent: state.Unemployment_Percent,
            Year: state.Year
        }
    })

    var scatterElement = {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        repeat: {
            row: ["Average_Income", "Homeless_Percent", "Crime_Percent", "Unemployment_Percent", "Opioid_Factor"],
            column: ["Average_Income", "Homeless_Percent", "Crime_Percent", "Unemployment_Percent", "Opioid_Factor"]
        },
        spec: {
            width: 150,
            height: 150,
            data: {
              "values": opioidFactorAndPopulation
            },
            selection: "",
            mark: "point",
            "calculate": "'https://en.wikipedia.org/wiki/' + datum.State",
            "as": "url",
            description: "State",
            selection: {
                brush: {
                    type: "interval",
                    resolve: "union",
                    on: "[mousedown[event.shiftKey], window:mouseup] > window:mousemove!",
                    translate: "[mousedown[event.shiftKey], window:mouseup] > window:mousemove!",
                    zoom: "wheel![event.shiftKey]"
                }
            },
            encoding: {
                "tooltip": {
                    "field": "State",
                    "type": "nominal"
                },
                "href": {
                    "field": "url",
                    "type": "nominal"
                },
                x: {
                    "field": {
                        "repeat": "column"
                    },
                    "type": "quantitative"
                },
                y: {
                    field: {
                        "repeat": "row"
                    },
                    type: "quantitative",
                    axis: {
                        "minExtent": 30
                    }
                },
                color: {
                    value: "#ffa000"
                }
            }
        }
    }
    vegaEmbed("#scatter", scatterElement);
}

export {
    initScatterMatrix
}