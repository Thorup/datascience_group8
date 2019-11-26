import HeatmapOverlay from 'leaflet-heatmap'
import L from 'leaflet'
import 'leaflet-css'
let json = require('../data/countylocations.json');
let enableInteraction = false;



let initButtonListeners = (heatMapLayer) => {
    initPlayBtnListener(heatMapLayer)
}

let initPlayBtnListener = (heatMapLayer) => {
    let playBtn = document.getElementById('btnPlay')
    playBtn.addEventListener('click', function () {
        playHeatMap(heatMapLayer)
    })
}

let initStopBtnListener = (playIntervalID) => {
    let stopBtn = document.getElementById('btnStop')
    let startBtn = document.getElementById('btnPlay')
    stopBtn.addEventListener('click', function() {
        clearInterval(playIntervalID)
        stopBtn.style.display = 'none';
        startBtn.style.display = 'block'
    })
}

let playHeatMap = (heatMapLayer) => {
    let years = ["2007", "2008", "2009", "2010"]
    let playBtn = document.getElementById('btnPlay')
    let stopBtn = document.getElementById('btnStop')
    stopBtn.style.display = "block";
    playBtn.style.display = "none";

    let index = 0;
    let playIntervalID = setInterval(function(){
        if(index == (years.length)) {
            index = 0;
        }
        setHeatmapData(heatMapLayer, years[index])
        index++;
    }, 2000)
    initStopBtnListener(playIntervalID)
}



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

let getHeatMapData = (year) => {


    let heatMapData = []
    json.forEach(cLocation => {
        if(year == 2007) {
            heatMapData.push({
                lat: cLocation.lat,
                lng: cLocation.lng,
                value: cLocation.pop_est_2007
            })
        } else  if(year == 2008) {
            heatMapData.push({
                lat: cLocation.lat,
                lng: cLocation.lng,
                value: cLocation.pop_est_2008
            })
        } else if(year == 2009) {
            heatMapData.push({
                lat: cLocation.lat,
                lng: cLocation.lng,
                value: cLocation.pop_est_2009
            })
        } else  if(year == 2010) {
            heatMapData.push({
                lat: cLocation.lat,
                lng: cLocation.lng,
                value: cLocation.pop_est_2010
            })
        }
    })

/*
    //TODO: MAKE THE POP_EST DYNAMIC SO IT TAKES THE YEAR VARIABLE AND APPENDS TO POPEST
    let heatMapData =json.map(cLocation =>
        ({
            lat: cLocation.lat,
            lng: cLocation.lng,
            value: cLocation.pop_est_2007
        }))
        */
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
    let initYear = 2007
    createHeatMap(baseLayer, heatMapLayer, maxBounds)
    setHeatmapData(heatMapLayer, initYear)
    initToolTip(heatMapLayer)
    initButtonListeners(heatMapLayer)
    
}

let createHeatMap = (baseLayer, heatMapLayer, maxBounds) => {
    let heatMap = new L.Map('heat-map', {
        center: new L.LatLng(39.099724, -94.578331),
        zoom: 5,
        layers: [baseLayer, heatMapLayer],
        maxBounds: maxBounds,
        dragging: enableInteraction,
        touchZoom: enableInteraction,
        scrollWheelZoom: enableInteraction,
        keyboard: enableInteraction,
        boxZoom: enableInteraction,
        doubleClickZoom: enableInteraction,
        zoomControl: enableInteraction
    })
    return heatMap
}



let getMaxBounds = () => {
    let maxBounds = L.latLngBounds(
        L.latLng(5.499550, -167.276413), //Southwest
        L.latLng(83.162102, -52.233040) //Northeast
    );
    return maxBounds;
}

let setHeatmapData = (heatMapLayer, year) => {

console.log(heatMapLayer)

    let heatMapData = getHeatMapData(year)
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
    let valueNode = document.createTextNode("Population: " + value)
    tooltip.style.display = 'block';
    tooltip.style.webkitTransform = transl;
    tooltip.innerHTML = "";
    if (value > 0) {
        tooltip.appendChild(valueNode)
    } else {
        tooltip.style.display = 'none';
    }
};

let initToolTip = (heatMapLayer) => {
    let tooltip = document.querySelector('.tooltip');
    let mapContainer = document.querySelector('#heat-map-container');
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