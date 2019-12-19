import L from 'leaflet'
import 'leaflet-css'
let statesBorderPolygons = require('../data/state-border-polygons.json');
let stateYearlyOpioidUse = require('../data/full_sets/state_yearly_full.json')
let enableInteraction = false;

let getBaseLayer = () => {

    let mapboxAccessToken = 'pk.eyJ1IjoieHJvc2J5IiwiYSI6ImNrMTBqenpiZjAxMm8zcHBpM3FtdXVjcHcifQ.tndGMwRjiYvCWcry2aq8FQ'
    let tileUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken

    let baseLayer = L.tileLayer(tileUrl, {
        id: 'mapbox.light'
    })
    return baseLayer;
}

let getMaxBounds = () => {
    let maxBounds = L.latLngBounds(
        L.latLng(5.499550, -167.276413), //Southwest
        L.latLng(83.162102, -52.233040) //Northeast
    );
    return maxBounds;
}

let getPopulationByYear = (stateName, year) => {
    let state = stateYearlyOpioidUse.filter(state =>
        state.State == stateName && state.Year == year
    )
    let population = null;
    if(state[0] != undefined) {
        population = state[0].Population
    }
    return population;
}

let getOpioidUseByYear = (stateName, year) => {
    let state = stateYearlyOpioidUse.filter(state =>
        state.Year == year && state.State == stateName
    )
    let opioidFactor = null
    if(state[0] != undefined){
        opioidFactor = state[0].Opioid_Factor
    }
    return opioidFactor;
}

let calcDensity = (state, year) => {
    return getOpioidUseByYear(state, year) / getPopulationByYear(state, year)
}


let createStateDataWithOpioidData = (year, stateData) => {
    for(let i = 0; i < stateData.features.length; i++) {
        let statePolygon = stateData.features[i]
        let density = calcDensity(statePolygon.properties.name, year)
        statePolygon.properties.density = density;
    }
    stateData.features = stateData.features.filter(state => !isNaN(state.properties.density))
      return stateData
}
let getColor = (d) => {
    return d > 50000 ? '#ff0000' :
        d > 40000 ? '#ff1919' :
        d > 35000 ? '#ff3232' :
        d > 30000 ? '#ff4c4c' :
        d > 25000 ? '#ff6666' :
        d > 15000 ? '#ff7f7f' :
        d > 10000 ? '#ff9999' :
        d > 7500 ? '#ffb2b2' :
        d > 5000 ? '#ffcccc' :
        d > 2000 ? '#ffe5e5' : 
        '#ffffff';
}

let style = (feature) => {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

let initPlayButtonListener = (layer) => {
   let playBtn = document.getElementById("btnPlayChoroMap")
   playBtn.addEventListener('click', function() {
       playChoroMap(layer, 2)
   })
}

let initStopBtnListener = (layer, playIntervalID) => {
    let stopBtn = document.getElementById("btnStopChoroMap")
    let startBtn = document.getElementById("btnPlayChoroMap")
    stopBtn.addEventListener('click', function() {
        let initialYear = [...new Set(stateYearlyOpioidUse
            .map(state => state.Year))]
            .filter(year => year != undefined)[0];
        setChoroMapData(layer, initialYear)
        clearInterval(playIntervalID)
        stopBtn.style.display = 'none';
        startBtn.style.display = 'block'
    })
}


let playChoroMap = (layer, seconds) => {
    let mill = seconds * 1000;

    let years = [...new Set(stateYearlyOpioidUse
        .map(state => state.Year))]
        .filter(year => year != undefined);
    let playBtn = document.getElementById('btnPlayChoroMap')
    let stopBtn = document.getElementById('btnStopChoroMap')
    stopBtn.style.display = "block";
    playBtn.style.display = "none";
    let index = 0;
    let playIntervalID = setInterval(function () {
        if (index == (years.length)) {
            index = 0;
        }
        setYearLabel(years[index])
        setChoroMapData(layer, years[index])
        index++;
    }, mill)
    initStopBtnListener(layer, playIntervalID)
    
}

let setYearLabel = (year) => {
    document.getElementById("yearLabel").innerHTML = year
}

let setChoroMapData = (layer, year) => {
    let choroOpioidData = createStateDataWithOpioidData(year, statesBorderPolygons);
    setYearLabel(year)
    layer.clearLayers(); 
    layer.addData(choroOpioidData);
}


let initChoroMap = () => {
    let maxBounds = getMaxBounds()
    let baseLayer = getBaseLayer();
    let map = new L.Map('choro-map', {
        center: new L.LatLng(39.099724, -94.578331),
        zoom: 4,
        layers: [baseLayer],
        maxBounds: maxBounds,
        dragging: enableInteraction,
        touchZoom: enableInteraction,
        scrollWheelZoom: enableInteraction,
        keyboard: enableInteraction,
        boxZoom: enableInteraction,
        doubleClickZoom: enableInteraction,
        zoomControl: enableInteraction,
        attributionControl: false
    })
    let years = [...new Set(stateYearlyOpioidUse
        .map(state => state.Year))]
        .filter(year => year != undefined);
    let initialYear = years[0]
    let choroOpioidData = createStateDataWithOpioidData(initialYear, statesBorderPolygons);
    let layer = L.geoJson(choroOpioidData, {
        style: style
    }).addTo(map);
  
    setYearLabel(initialYear)
    initPlayButtonListener(layer)

}


export {
    initChoroMap
}