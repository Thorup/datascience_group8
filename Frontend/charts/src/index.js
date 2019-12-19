const barcharts = require('./barcharts.js')
const choroplethmap = require('./choroplethmap.js')
const scatterMatrix = require('./scatterplot.js')
const linechart = require("./linecharts.js")
const clusteringPlots = require("./clusteringplots.js")

const initYear = 2007
barcharts.initBarCharts(initYear)
choroplethmap.initChoroMap()
scatterMatrix.initScatterMatrix()
linechart.initLineCharts()
clusteringPlots.initClusterPlots()


