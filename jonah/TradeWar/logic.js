
var query2015 = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2015-01-01&endtime=" +
"2015-12-31&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=7";
var query2016 = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2016-01-01&endtime=" +
"2016-12-31&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=5";
var query2017 = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2017-01-01&endtime=" +
"2017-12-31&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=5";
var query2018 = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-01-01&endtime=" +
"2018-12-31&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=5";


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-11-01&endtime=" +
  "2019-11-20&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=7";


function createFeatures(earthquakeData) {
  
  var earthquakes = L.geoJSON(earthquakeData, {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
   onEachFeature: function(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + 
      "</p>" +  "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>" +
      "</p>" +  "</h3><hr><p>" + "Location: " + feature.geometry.coordinates + "</p>" +
      "</p>" +  "</h3><hr><p>" + "Tsunami: " + feature.properties.tsunami + "</p>" 
      )},

    pointToLayer: function(feature, latlng){

        if (feature.properties.mag < 5.2) {
          colorMag = "yellow";
          radiusMag = (feature.properties.mag ) *20000;
        }
        else if (feature.properties.mag >= 5.2 && feature.properties.mag < 6.4) {
          colorMag = "orange";
          radiusMag = (feature.properties.mag ) *24000;
        }   
        else if (feature.properties.tsunami) {
          colorMag = "blue";
          radiusMag = (feature.properties.mag *1.4) *24000;
        }   
        else  {
          colorMag = "red";
          radiusMag = (feature.properties.mag *1.4) *24000;
        }

        function getColor(d) {
          return d >= 8 ? 'blue' :
                 d > 6.4  ? 'red' :
                 d > 5.2  ? 'orange' :
                 d > 4   ? 'yellow' :
                 d > 0   ? 'white' :
                            'blue';
      }

        var geojsonMarkerOptions = {
          radius: radiusMag,
          fillColor: colorMag,
          color: getColor(feature.properties.mag),
          weight: 3,
          opacity: 1,
          fillOpacity: 0.5
      };
        // return new L.circle(latlng, {
        //   // color: 'red',
        //   fillColor: '#f03',
        //   fillOpacity: 0.0,
        //   radius:  radiusMag,
        //   color: colorMag
        // })
        return L.circle(latlng, geojsonMarkerOptions )
      }
    })

  return earthquakes
}

function createFeatures2015(earthquakeData2015) {
  
  var earthquakes2015 = L.geoJSON(earthquakeData2015, {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
   onEachFeature: function(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + 
      "</p>" +  "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>" +
      "</p>" +  "</h3><hr><p>" + "Location: " + feature.geometry.coordinates + "</p>" +
      "</p>" +  "</h3><hr><p>" + "Tsunami: " + feature.properties.tsunami + "</p>" 
      )},

    pointToLayer: function(feature, latlng){

        if (feature.properties.mag < 5.2) {
          colorMag = "yellow";
          radiusMag = (feature.properties.mag ) *20000;
        }
        else if (feature.properties.mag >= 5.2 && feature.properties.mag < 6.4) {
          colorMag = "orange";
          radiusMag = (feature.properties.mag ) *24000;
        }   
        else if (feature.properties.tsunami) {
          colorMag = "blue";
          radiusMag = (feature.properties.mag *1.4) *24000;
        }   
        else  {
          colorMag = "red";
          radiusMag = (feature.properties.mag *1.4) *24000;
        }

        function getColor(d) {
          return d >= 8 ? 'blue' :
                 d > 6.4  ? 'red' :
                 d > 5.2  ? 'orange' :
                 d > 4   ? 'yellow' :
                 d > 0   ? 'white' :
                            'blue';
      }

        var geojsonMarkerOptions = {
          radius: radiusMag,
          fillColor: colorMag,
          color: getColor(feature.properties.mag),
          weight: 3,
          opacity: 1,
          fillOpacity: 0.5
      };

    
        // return new L.circle(latlng, {
        //   // color: 'red',
        //   fillColor: '#f03',
        //   fillOpacity: 0.0,
        //   radius:  radiusMag,
        //   color: colorMag
        // })
        return L.circle(latlng, geojsonMarkerOptions )
      }
    })

  return earthquakes2015
}


function createMap() {

    // Perform a GET request to the query URL
  d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    var earthquakes =  createFeatures(data.features);


  // Perform a GET request to the query URL
  d3.json(query2015, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    var earthquakes2015 = createFeatures2015(data.features);


  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // var link2 = "TradeWar/data/ne_10m_admin_0_countries.geojson";
  // var link2 = "TradeWar/data/customLO.geo.json";
  var link2 = "TradeWar/data/countries_admn-0.geojson";
  d3.json(link2, function(data) {

    for (var i = 0; i < data.features.length; i++) {
      //   // console.log(data.features[i].properties.pop_est);
        colorPop = data.features[i].properties.pop_est;
    }

    // Once we get a response, send the data.features object to the createFeatures function
    var countries = L.geoJson(data, {
      onEachFeature: onEachFeature,

      style: function(countries) {

        return {
          attribution: "XXXXXX 🇦🇴 XXXXXXX",
          color:  "red", // chooseColor(feature.properties.PlateName), // "white", 
          opacity: .8,
          fillColor: getColorCountry(countries.properties.pop_est),
          fillOpacity: 0.8,
          weight: 1,
          // pointerEvents: 'none',
          // zIndex: 650
        }; 

        function getColorCountry(d) {
          return d > 10000000000 ? '#800026' :
                 d > 5000000000  ? '#BD0026' :
                 d > 2000000000  ? '#E31A1C' :
                 d > 100000000  ? '#FC4E2A' :
                 d > 50000000  ? '#FD8D3C' :
                 d > 20000000   ? '#FEB24C' :
                 d > 10000000   ? '#FED976' :
                              '#FFEDA0'
      } 
      },
      

    }); 
    
    
// Happens on mouse out
function reset(e) {
  countries.resetStyle(e.target);
  // Resets custom legend when user unhovers
  displayInfo.update();
}

//////////////

// On hover control that displays information about hovered upon country
var displayInfo = L.control();

displayInfo.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// Passes properties of hovered upon country and displays it in the control
displayInfo.update = function (props) {

    this._div.innerHTML = '<h2>Wealth Countries</h2>' + (props ?
        '<h3>' + props.formal_en + '</h3>' + '<b>' + 'GDP in Trillions of USD: ' + '</b>' + props.gdp_md_est / 1000000 + '<br />' +
        '<b>' + ' GDP in Billions of USD: ' + '</b>' + props.gdp_md_est / 1000 + '<br />' +
        '<b>' + 'Economic Status: ' + '</b>' + props.economy + '<br />' +
        '<b>' + 'Population: ' + '</b>' + props.pop_est / 1000000 + ' million people' :
        'Hover over a European country');
};

// displayInfo.addTo(myMap);

// Happens on mouse hover
function highlight(e) {
  onEachFeature: onEachFeature;
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#ffd32a'
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    // Updates custom legend on hover
    displayInfo.update(layer.feature.properties);
}

function style(feature) {
  return {
      fillColor: getColor(feature.properties.gdp_md_est),
      weight: 1,
      opacity: 1,
      color: 'snow',
      fillOpacity: .7
  };
}

function highlight(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 3,
      color: '#ffd32a',
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }

  displayInfo.update(layer.feature.properties);
}

function reset(e) {
  countries.resetStyle(e.target);
  displayInfo.update();
}

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      worldCopyJump: true,
      center: [
        37.09, -70.00
      ],
      zoom: 3,
      layers: [streetmap, countries]  // , earthquakes, earthquakes2015]
    });

function zoomToCountry(e) {
  myMap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlight,
      mouseout: reset,
      click: zoomToCountry
  });
}

////////////////////////////////////////////////////////
    
  var link = "TradeWar/data/PB2002_plates.json";
  d3.json(link, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    var plates = L.geoJson(data, {
  
      style: function(plates) {
        return {
          color:  "magenta", // chooseColor(feature.properties.PlateName), // "white", 
          opacity: .8,
          fillColor: "white", 
          fillOpacity: 0.0,
          weight: 1,
          // pointerEvents: 'none',
          // zIndex: 650
        };
      }
    }); // .addTo(myMap);
  // console.log(plates);

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Countries: countries,
      Plates: plates,
      Earthquakes: earthquakes,
      Earthquakes2015: earthquakes2015
      // Earthquakes2015: earthquakes2015, 
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    // var myMap = L.map("map", {
    //   worldCopyJump: true,
    //   center: [
    //     37.09, -70.00
    //   ],
    //   zoom: 3,
    //   layers: [streetmap, plates, countries]  // , earthquakes, earthquakes2015]
    // });


    L.control.layers(baseMaps, overlayMaps,  {
      collapsed: false
    }).addTo(myMap);

    displayInfo.addTo(myMap);   //////////////////////////

////////////////////////////////////////////
////////// LEGEND /////////////////////////////
    function getColor(d) {
      return d >= 8 ? 'blue' :
             d > 6.4  ? 'red' :
             d > 5.2  ? 'orange' :
             d > 4   ? 'yellow' :
             d > 0   ? 'white' :
                        'blue';
  }
  
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');
          grades = [0, 4, 5.2, 6.4, 'tsunami'],
          labels = [];
          div.innerHTML += "<h4>Magnitude</h4>";
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
  
  })
  
  
})

})

})


  };


createMap();



// var geoKeys = Object.keys(countries);
// console.log(geoKeys);

    // console.log(data.features[176].properties.name);
    // console.log(data.features[176].properties.pop_est);
    // console.log(data.features.length);
    // console.log(countries._layers[100].options);

//     console.dir(countries._layers[39].feature.properties.name);
//     console.dir(countries._layers[39].feature.properties.pop_est)
//     console.dir(countries._layers[39].feature.properties.income_grp)
//     console.dir(countries._layers[39].feature.properties.economy)
//     console.dir(countries._layers[39].feature.properties.formal_en)
//     console.dir(countries._layers[39].feature.properties.brk_a3)
//     console.dir(countries._layers[39].feature.properties.continent)

//     console.dir(countries._layers)
