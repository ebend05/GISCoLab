var leaflet = function() {
// setting for the map
    var map = L.map('map').setView([51.975, 7.61], 13);
// add a OpenStreetMap layer
    var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    osm.addTo(map);

// include your geojson object to the map as a polygon
    // var layer1 = L.geoJson().addTo(map);
    // layer1.addData(linienGeojsonFeature);

// add a humanitarian OpenStreetMap layer
    var hotOSM = new L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors. Tiles courtesy of <a href="http://hot.openstreetmap.org/" target ="_blank">Humanitarian OpenStreetMap Team'
    })

    hotOSM.addTo(map);
}