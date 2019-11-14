import h337 from 'heatmap.js'
import HeatmapOverlay from 'leaflet-heatmap'
let json = require('../data/countylocations.json');

function getConfig() {
  let cfg = {
    "radius": 40,
    "useLocalExtrema": true,
    valueField: 'value'
  };
  return cfg;
}

function getBaseLayer() {
  let baseLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  )
  return baseLayer;
}

function getHeatMapData() {
   let heatMapData = json.map(cLocation =>
    ({
      lat: cLocation.lat,
      lng: cLocation.lng,
      value: cLocation.pop_est_2007
    }))

    return heatMapData;
}

function initHeatMap(cfg) {
  let baseLayer = getBaseLayer();
  let heatmapLayer = new HeatmapOverlay(cfg);
  let propertyHeatMap = new L.Map('map', {
    center: new L.LatLng(32.78306, -96.80667),
    zoom: 15,
    layers: [baseLayer, heatmapLayer]
  })
  propertyHeatMap.setZoom(3.9)
  setHeatmapData(heatmapLayer)

}

function setHeatmapData(heatmapLayer){
  let heatMapData = getHeatMapData()
  let min = Math.min(...heatMapData.map(location => location.value))
  let max = Math.max(...heatMapData.map(location => location.value))
  heatmapLayer.setData({
    min: min,
    max: max,
    data: heatMapData
  })
}

function initComponent() {
  let cfg = getConfig()
  initHeatMap(cfg) 
}

initComponent()