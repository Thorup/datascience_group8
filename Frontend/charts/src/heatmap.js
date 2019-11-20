import HeatmapOverlay from 'leaflet-heatmap'
import L from 'leaflet'
import 'leaflet-css'
let json = require('../data/countylocations.json');



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

const initHeatMap = function () {
    let cfg = getConfig()
    let baseLayer = getBaseLayer()
    let heatMapLayer = getHeatMapLayer(cfg)
    let maxBounds = getMaxBounds()
    let propertyHeatMap = new L.Map('map', {
        center: new L.LatLng(39.099724, -94.578331),
        zoom: 4,
        layers: [baseLayer, heatMapLayer],
        maxBounds: maxBounds
    })
    setHeatmapData(heatMapLayer)
    initToolTip(heatMapLayer)
}

let getMaxBounds = () => {
    let maxBounds = L.latLngBounds(
        L.latLng(5.499550, -167.276413), //Southwest
        L.latLng(83.162102, -52.233040) //Northeast
    );
    return maxBounds;
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
    let valueNode = document.createTextNode(value)
    tooltip.style.display = 'block';
    tooltip.style.webkitTransform = transl;
    tooltip.innerHTML = "";
    tooltip.appendChild(valueNode)
};

let initToolTip = (heatMapLayer) => {
    let tooltip = document.querySelector('.tooltip');
    console.log(tooltip)
    let mapContainer = document.querySelector('.map-container');
    mapContainer.onmousemove = function (ev) {
        let x = ev.layerX;
        let y = ev.layerY;
        let value = heatMapLayer._heatmap.getValueAt({
            x: x,
            y: y
        });
        updateTooltip(x, y, value, tooltip);
    };
}


export {
    initHeatMap
}