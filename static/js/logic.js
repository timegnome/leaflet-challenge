// 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
// 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json'

// Function to determine marker size based on population
function markerSize(magnitude) {
    return Math.pow(10,magnitude) ;
  }
  
// An array containing all of the information needed to create city and state markers
var locations = [
{
    coordinates: [40.7128, -74.0059],
    state: {
    name: "New York State",
    population: 19795791
    },
    city: {
    name: "New York",
    population: 8550405
    }
},
{
    coordinates: [34.0522, -118.2437],
    state: {
    name: "California",
    population: 39250017
    },
    city: {
    name: "Lost Angeles",
    population: 3971883
    }
},
{
    coordinates: [41.8781, -87.6298],
    state: {
    name: "Illinois",
    population: 12671821
    },
    city: {
    name: "Chicago",
    population: 2695598
    }
},
{
    coordinates: [29.7604, -95.3698],
    state: {
    name: "Texas",
    population: 26960000
    },
    city: {
    name: "Houston",
    population: 2296224
    }
},
{
    coordinates: [41.2524, -95.9980],
    state: {
    name: "Nebraska",
    population: 1882000
    },
    city: {
    name: "Omaha",
    population: 446599
    }
}
];

// Define arrays to hold created city and state markers
// var cityMarkers = [];
var earthquakeMarkers = [];

// Loop through locations and create city and state markers
for (var i = 0; i < locations.length; i++) {
// Setting the marker radius for the state by passing population into the markerSize function
earthquakeMarkers.push(
    L.circle(locations[i].coordinates, {
    stroke: false,
    fillOpacity: 0.75,
    color: "white",
    fillColor: "white",
    radius: markerSize(locations[i].state.population)
    })
);
}

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
// Create two separate layer groups: one for cities and one for states
var states = L.layerGroup(stateMarkers);
// var cities = L.layerGroup(cityMarkers);

// Create a baseMaps object
var baseMaps = {
"Street Map": streetmap,
"Dark Map": darkmap,
"Light Map": lightmap
};

// Create an overlay object
var overlayMaps = {
"Earth Quakes": earthquakes,
// "Tectonic plates": plates
};

// Define a map object
var myMap = L.map("mapid", {
center: [37.09, -95.71],
zoom: 5,
layers: [streetmap, states, cities]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
collapsed: false
}).addTo(myMap);

var geoData = "static/data/Median_Household_Income_2016.geojson";

var geojson;

// Grab data with d3
d3.json(geoData, function(data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "MHI2016",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
        "$" + feature.properties.MHI2016);
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});
