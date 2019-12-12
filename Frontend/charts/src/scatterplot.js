import vegaEmbed from 'vega-embed'
let data = require('../data/full_sets/state_yearly_full.json');


let initScatterMatrix = () => {

    var scatterElement = {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        repeat: {
            row: ["Average_Income", "Homeless_Percent", "Crime_Percent", "Unemployment_Percent", "Opioid_Factor"],
            column: ["Average_Income", "Homeless_Percent", "Crime_Percent", "Unemployment_Percent", "Opioid_Factor"]
        },
        spec: {
            width: 300,
            height: 300,
            data: {
                url: "../data/full_sets/state_yearly_full.json"
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
                },
                grid: {
                    type: "interval",
                    resolve: "global",
                    bind: "scales",
                    translate: "[mousedown[!event.shiftKey], window:mouseup] > window:mousemove!",
                    zoom: "wheel![!event.shiftKey]"
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