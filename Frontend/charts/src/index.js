const barcharts = require('./barcharts.js')
const choroplethmap = require('./choroplethmap.js')
const scatterMatrix = require('./scatterplot.js')
const countyChoro = require("./countychoropleth")
const correlogram = require("./correlogram.js")

barcharts.initBarCharts(2007)
choroplethmap.initChoroMap()
scatterMatrix.initScatterMatrix()
countyChoro.initCountyChoro("2007", "1")
//correlogram.initCorrelogram()


