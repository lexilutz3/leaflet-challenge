// 1. create map object
var map = L.map('map').setView([37.09, -95.71], 5);

// 2. add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 3. define URL
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// 4. fetch data
d3.json(earthquakeUrl).then(function(data) {
    console.log(data);
    // 5. create features
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // 7. function for features array
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
            "<p>Magnitude: " + feature.properties.mag + "</p>" +
            "<p>Depth: " + feature.geometry.coordinates[2] + " km</p>");
    }

    // 6. create geoJSON layer
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    });

    // 7. add earthquakes to map
    earthquakes.addTo(map);
}

// 8. define function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 4;
}

// 9. define function to determine marker color based on depth
function markerColor(depth) {
    return depth > 90 ? '#800026' :
           depth > 70  ? '#BD0026' :
           depth > 50  ? '#E31A1C' :
           depth > 30  ? '#FC4E2A' :
           depth > 10   ? '#FD8D3C' :
                          '#FEB24C';
}

// 10. create legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 30, 50, 70, 90],
        labels = [];

    // 11. loop through depth intervals to create colored square labels
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

// 12. adjust legend characteristics to match rubric image
function markerSize(magnitude) {
    return magnitude * 4;
}
function markerColor(depth) {
    return depth > 90 ? '#800026' :  
           depth > 70  ? '#BD0026' :  
           depth > 50  ? '#E31A1C' :  
           depth > 30  ? '#FC4E2A' :  
           depth > 10  ? '#FEB24C' : 
                         '#00FF00';   
}
