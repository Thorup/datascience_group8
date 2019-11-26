import vegaEmbed from 'vega-embed'
let data = require('../data/data.json');


let initScatterMatrix = () => {

    console.log(data)

    var scatterElement = {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        repeat: {
            row: ["avgInc", "homelessPercent", "crimePercent", "unemployedPercent"],
            column: ["avgInc", "homelessPercent", "crimePercent", "unemployedPercent"]
        },
        spec: {
            width: 200,
            height: 200,
            data: {
                url: "../data/data.json"
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