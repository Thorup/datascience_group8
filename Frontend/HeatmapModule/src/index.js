import h337 from 'heatmap.js'
import HeatmapOverlay from 'leaflet-heatmap'
let json = require('../data/countylocations.json');
let propertyHeatMap = {}
let heatMapLayer = {}



let getConfig = () => {
  let cfg = {
    "useLocalExtrema": true,
    valueField: 'value',
    radius: 80,
    maxOpacity: 1
  }
  return cfg;
}
let getBaseLayer = () => {
  let baseLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  )
  return baseLayer;
}

let getHeatMapData = () => {
    let heatMapData = json.map(cLocation =>
      ({
        lat: cLocation.lat,
        lng: cLocation.lng,
        value: cLocation.pop_est_2007
      }))

    heatMapData.forEach(data => {
        if (isNaN(data.value)) {
          printPop(data)
        }
      })
      return heatMapData;
    }

    let printPop = (locationPoint) => {
      console.log(locationPoint.value)
    }

    let initHeatMap = (cfg) => {
      let baseLayer = getBaseLayer();
      heatMapLayer = new HeatmapOverlay(cfg);
      propertyHeatMap = new L.Map('map', {
        center: new L.LatLng(39.099724, -94.578331),
        zoom: 5,
        layers: [baseLayer, heatMapLayer]
      })
      //disableMapManipulation()
      setHeatmapData()

    }

    let disableMapManipulation = () => {
      propertyHeatMap.dragging.disable();
      propertyHeatMap.touchZoom.disable();
      propertyHeatMap.doubleClickZoom.disable();
      propertyHeatMap.scrollWheelZoom.disable();
    }

    let setHeatmapData = () => {
      let heatMapData = getHeatMapData()
      let min = Math.min(...heatMapData.map(location => location.value))
      let max = Math.max(...heatMapData.map(location => location.value))
      heatMapLayer.setData({
        min: min,
        max: max,
        data: heatMapData
      })
    }



    let mapContainer = document.querySelector('.map-container');
    let tooltip = document.querySelector('.tooltip');

    let updateTooltip = (x, y, value) => {
      var transl = 'translate(' + (x + 15) + 'px, ' + (y + 15) + 'px)';
      tooltip.style.webkitTransform = transl;
      tooltip.innerHTML = value;
    };


    mapContainer.onmousemove = function (ev) {
      let x = ev.layerX;
      let y = ev.layerY;
      let value = heatMapLayer._heatmap.getValueAt({
        x: x,
        y: y
      });
      tooltip.style.display = 'block';
      updateTooltip(x, y, value);
    };

    let initComponent = () => {
      let cfg = getConfig()
      initHeatMap(cfg)
    }

    initComponent()