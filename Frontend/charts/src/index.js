const heatmap = require('./heatmap.js');
const barcharts = require('./barcharts.js')
const choroplethmap = require('./choroplethmap.js')
const scatterMatrix = require('./scatterplot.js')
const correlationHeatMap = require('./correlation-heatmap.js')



barcharts.initBarCharts()
heatmap.initHeatMap()
choroplethmap.initChoroMap()
scatterMatrix.initScatterMatrix()
correlationHeatMap.initCorrelationHeatMap()



