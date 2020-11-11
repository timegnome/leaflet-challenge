// Function to determine marker size based on population
function markerSize(magnitude) {
    return 6000*magnitude ;
  }
// Define a map object
var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 3,
    });
// api get request for the earthquake data
earthquakeData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
d3.json(earthquakeData, function(data) {
var locations = data.features;

// Define arrays to hold created city and state markers
// var cityMarkers = [];
var earthquakeMarkers = [];

// Loop through locations and create city and state markers
for (var i = 0; i < locations.length; i++) {
// Setting the marker radius for the state by passing population into the markerSize function
// console.log(locations[i].geometry.coordinates.slice(0,2))
// break
earthquakeMarkers.push(
    L.circle([locations[i].geometry.coordinates[1],locations[i].geometry.coordinates[0]], {
    stroke: false,
    fillOpacity: 0.75,
    color: locations[i].properties.mag,
    fillColor: locations[i].properties.mag,
    radius: markerSize(locations[i].properties.mag)
    }).bindPopup("<br> Magnitude: " + locations[i].properties.mag + "<br> Latitude:" + locations[i].geometry.coordinates[1] + "<br> Longitude:" + locations[i].geometry.coordinates[1])
);
}
// console.log(earthquakeMarkers)
// Create base layers

// Streetmap Layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "dark-v10",
accessToken: API_KEY
});

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "light-v10",
accessToken: API_KEY
});
// Create two separate layer groups: one for quakes and one for plates
var quakes = L.layerGroup(earthquakeMarkers);
// console.log(streetmap)
// var cities = L.layerGroup(cityMarkers);

// Create a baseMaps object
var baseMaps = {
"Street Map": streetmap,
"Dark Map": darkmap,
"Light Map": lightmap
};

// Create an overlay object
var overlayMaps = {
"Earth Quakes": quakes,
};

streetmap.addTo(myMap)
darkmap.addTo(myMap)
lightmap.addTo(myMap)
quakes.addTo(myMap)
console.log(myMap)
// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
collapsed: false
}).addTo(myMap);


var geoData = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json';

var geojson;

// Grab data with d3
d3.json(geoData, function(data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "PlateName",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.2
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Plate Name: " + feature.properties.PlateName + "<br>PLate code:<br>" +
        "$" + feature.properties.Code);
    }
  }).addTo(myMap);

  // Set up the legend
//   var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = geojson.options.limits;
//     var colors = geojson.options.colors;
//     var labels = [];

//     // Add min & max
//     var legendInfo = "<h1>Median Income</h1>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

  // Adding legend to the map
//   legend.addTo(myMap);

});

});