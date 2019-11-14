import h337 from 'heatmap.js'
import HeatmapOverlay from 'leaflet-heatmap'
let json = require('../data/countylocations.json');



function initComponent() {
  let cfg = {
    "radius": 40,
    "useLocalExtrema": true,
    valueField: 'value'
  };
  let heatmapLayer = new HeatmapOverlay(cfg);

  let baseLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  )

  let heatMapData = json.map(cLocation =>
    ({
      lat: cLocation.lat,
      lng: cLocation.lng,
      value: cLocation.pop_est_2007
    })
  )

  console.log(heatMapData)

  let min = Math.min(...heatMapData.map(location => location.value))
  let max = Math.max(...heatMapData.map(location => location.value))



  // heatmap.setData(data);
  let propertyHeatMap = new L.Map('map', {
    center: new L.LatLng(32.78306, -96.80667),
    zoom: 15,
    layers: [baseLayer, heatmapLayer]
  })
  propertyHeatMap.setZoom(3.9)


  heatmapLayer.setData({
    min: min,
    max: max,
    data: heatMapData
  })
}

initComponent()