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

let printMinMaxValues = (stateData) => {
    //GET AND PRINT MIN AND MAX VALUES OF STATE OPIOID USE
    let min = Math.min(...stateData.features.map(state => state.properties.density))
    let max = Math.max(...stateData.features.map(state => state.properties.density))
    console.log("MIN: " + min)
    console.log("MAX: " + max)
}

let getColor = (d) => {
    return d > 50000 ? '#800026' :
        d > 35000 ? '#BD0026' :
        d > 20000 ? '#E31A1C' :
        d > 15000 ? '#FC4E2A' :
        d > 5000 ? '#FD8D3C' :
        d > 2000 ? '#FEB24C' :
        d > 1500 ? '#FED976' :
        '#FFEDA0';
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
       playChoroMap(layer)
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


let playChoroMap = (layer) => {
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
    }, 1500)
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
        zoom: 5,
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