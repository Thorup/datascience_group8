const barcharts = require('./barcharts.js')
const choroplethmap = require('./choroplethmap.js')
const scatterMatrix = require('./scatterplot.js')
//const countyChoro = require("./countychoropleth")
const correlogram = require("./correlogram.js")
const linechart = require("./linecharts.js")

const initYear = 2007
const initMonth = "Jan"

barcharts.initBarCharts(initYear)
choroplethmap.initChoroMap()
scatterMatrix.initScatterMatrix()
//countyChoro.initCountyChoro(initYear, initMonth)
linechart.initLineCharts(initYear)


