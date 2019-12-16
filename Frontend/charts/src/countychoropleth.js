import vegaEmbed from 'vega-embed'


let initCountyChoro = () => {
    let choro = {
    
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 960,
        "height": 500,
        "autosize": "none",
      
        "data": [
          {
            "name": "unemp",
            "url": "../data/full_sets/fips_monthly_TRUE.json",
            "format": {"type": "json", "parse": "auto"}
          },
          {
            "name": "counties",
            "url": "https://vega.github.io/vega/data/us-10m.json",
            "format": {"type": "topojson", "feature": "counties"},
            "transform": [
              { "type": "lookup", "from": "unemp", "key": "fips", "fields": ["id"], "values": ["opioid_factor"] },
              { "type": "filter", "expr": "datum.opioid_factor != null"},
              { "type": "filter", "expr": "datum.year == 2007"},
              { "type": "filter", "expr": "datum.month == 1"}


              //{ "type": "filter", "expr": "datum.opioid_factor != null && datum.year == 2007 and datum.month == 1" },
            ]
          }
        ],
      
        "projections": [
          {
            "name": "projection",
            "type": "albersUsa"
          }
        ],
      
        "scales": [
          {
            "name": "color",
            "type": "quantize",
            "domain": [0, 0.15],
            "range": {"scheme": "blues", "count": 7}
          }
        ],
      
        "legends": [
          {
            "fill": "color",
            "orient": "bottom-right",
            "title": "Opioid use (monthly use in mg)",
            "format": "0.1%"
          }
        ],
      
        "marks": [
          {
            "type": "shape",
            "from": {"data": "counties"},
            "encode": {
              "enter": { "tooltip": {"signal": "format(datum.opioid_factor, '0.1%')"}},
              "update": { "fill": {"scale": "color", "field": "opioid_factor"} },
              "hover": { "fill": {"value": "red"} }
            },
            "transform": [
              { "type": "geoshape", "projection": "projection" }
            ]
          }
        ]
      }
      vegaEmbed("#county-choro", choro)
}

export {
    initCountyChoro
}