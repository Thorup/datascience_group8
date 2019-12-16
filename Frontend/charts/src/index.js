const heatmap = require('./heatmap.js');
const barcharts = require('./barcharts.js')
const choroplethmap = require('./choroplethmap.js')
const scatterMatrix = require('./scatterplot.js')
const countyChoro = require("./countychoropleth")

barcharts.initBarCharts(2007)
heatmap.initHeatMap()
choroplethmap.initChoroMap()
scatterMatrix.initScatterMatrix()
countyChoro.initCountyChoro()


