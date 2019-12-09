import L from 'leaflet'
import 'leaflet-css'
let statesData = require('../data/states-data.json');
let stateYearlyOpioidUse = require('../data/full_sets/state_yearly.json')
let stateYearlyPopulation = require('../data/full_sets/state_population.json')

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

let getPopulationByYear = (year) => {
    for(let i = 0; i < stateYearlyPopulation.length; i++) {
        if(stateYearlyPopulation.year == year){
            return stateYearlyPopulation.population;
        }
    }
}

let getOpioidUseByYear = (state, year) => {
    for(let i = 0; i < stateYearlyOpioidUse.length; i++) {
        if(stateYearlyOpioidUse.year == year && stateYearlyOpioidUse.state == state) {
            return stateYearlyOpioidUse.opioid_factor
        }
    }
}

let createStateDataWithOpioidData = (year) => {
    /*
    statesDataForYear = statesData.map(stateData => {
        population = getPopulationByYear(year)
        opioidUse = getOpioidUseByYear(stateData.features.properties.name, year)
        density = opioidUse/population
        return {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "id": stateData.features[0].id,
                "properties": {
                    "name": stateData[0].properties.name,
                    "density": density
                },
                "geometry": stateData.geometry
            }]

        }
    })
    */

    return statesData;
}

let getColor = (d) => {
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
        d > 200 ? '#E31A1C' :
        d > 100 ? '#FC4E2A' :
        d > 50 ? '#FD8D3C' :
        d > 20 ? '#FEB24C' :
        d > 10 ? '#FED976' :
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

    let choroOpioidData = createStateDataWithOpioidData("2007");
    L.geoJson(choroOpioidData, {
        style: style
    }).addTo(map);

}


export {
    initChoroMap
}