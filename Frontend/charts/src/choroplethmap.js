import L from 'leaflet'
import 'leaflet-css'
let enableInteraction = false;

let getBaseLayer = () => {

    let mapboxAccessToken = 'pk.eyJ1IjoieHJvc2J5IiwiYSI6ImNrMTBqenpiZjAxMm8zcHBpM3FtdXVjcHcifQ.tndGMwRjiYvCWcry2aq8FQ'
    let tileUrl =  'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken

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


let initChoroMap = () => {
    let maxBounds = getMaxBounds()
    let baseLayer = getBaseLayer();
    let map= new L.Map('choro-map', {
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
    
}


export {
    initChoroMap
}