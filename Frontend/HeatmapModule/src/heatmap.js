import h337 from 'heatmap.js'
import HeatmapOverlay from 'leaflet-heatmap'
const json = require('../data/countylocations.json');


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
    return heatMapData;
}

let getHeatMapLayer = (cfg) => {
    let heatMapLayer = new HeatmapOverlay(cfg)
    return heatMapLayer
}

const initHeatMap = function() {
    let cfg = getConfig()
    let baseLayer = getBaseLayer()
    let heatMapLayer = getHeatMapLayer(cfg)
    let propertyHeatMap = new L.Map('map', {
        center: new L.LatLng(39.099724, -94.578331),
        zoom: 5,
        layers: [baseLayer, heatMapLayer]
    })
    setHeatmapData(heatMapLayer)
    initToolTip(heatMapLayer)
}

let setHeatmapData = (heatMapLayer) => {
    let heatMapData = getHeatMapData()
    let min = Math.min(...heatMapData.map(location => location.value))
    let max = Math.max(...heatMapData.map(location => location.value))
    heatMapLayer.setData({
        min: min,
        max: max,
        data: heatMapData
    })
}

let updateTooltip = (x, y, value, tooltip) => {
    var transl = 'translate(' + (x + 15) + 'px, ' + (y + 15) + 'px)';
    tooltip.style.webkitTransform = transl;
    tooltip.innerHTML = value;
};

let initToolTip = (heatMapLayer) => {
    let tooltip = document.querySelector('.tooltip');
    let mapContainer = document.querySelector('.map-container');
    mapContainer.onmousemove = function (ev) {
        let x = ev.layerX;
        let y = ev.layerY;
        let value = heatMapLayer._heatmap.getValueAt({
            x: x,
            y: y
        });
        tooltip.style.display = 'block';
        updateTooltip(x, y, value, tooltip);
    };
}
export{initHeatMap}
