var query2015 = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2015-01-01&endtime=" +
  "2015-12-31&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=7";

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2018-11-01&endtime=" +
  "2019-11-20&maxlongitude=180&minlongitude=-180&maxlatitude=70&minlatitude=-70&minmagnitude=7";


function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature(feature, layer) {
      layer.bindPopup(`<h3> Magnitued: ${feature.properties.mag}<h3> \
            <h3> Location: ${feature.properties.place}<h3> \
            <h3> Date: ${new Date(feature.properties.time)}<h3>`);
    },
    pointToLayer(feature, latlng) {
      return new L.circleMarker(latlng, {
        fillOpacity: .85,
        radius: setRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        stroke: false
      })

      function getColor(d) {
        return d >= 8 ? 'blue' :
          d > 6.4 ? 'red' :
          d > 5.2 ? 'orange' :
          d > 4 ? 'yellow' :
          d > 0 ? 'white' :
          'blue';
      }

      function setRadius(d) {
        return d * 5
      }
    }
  })
  return earthquakes
}

function createFeatures2015(earthquakeData2015) {
  var earthquakes2015 = L.geoJSON(earthquakeData2015, {
    onEachFeature(feature, layer) {
      layer.bindPopup(`<h3> Magnitued: ${feature.properties.mag}<h3> \
            <h3> Location: ${feature.properties.place}<h3> \
            <h3> Date: ${new Date(feature.properties.time)}<h3>`);
    },
    pointToLayer(feature, latlng) {
      return new L.circleMarker(latlng, {
        fillOpacity: .85,
        radius: setRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        stroke: false
      })

      function getColor(d) {
        return d >= 8 ? 'blue' :
          d > 6.4 ? 'red' :
          d > 5.2 ? 'orange' :
          d > 4 ? 'yellow' :
          d > 0 ? 'white' :
          'blue';
      }

      function setRadius(d) {
        return d * 5
      }
    }
  })
  return earthquakes2015
}


function createMap() {
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

  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Perform a GET request to the query URL
  d3.json(queryUrl, function (data) {
    var earthquakes = createFeatures(data.features);


    // Perform a GET request to the query URL
    d3.json(query2015, function (data) {
      var earthquakes2015 = createFeatures2015(data.features);

      var link2 = "TradeWar/data/countries_admn-0.geojson";
      d3.json(link2, function (data) {

        for (var i = 0; i < data.features.length; i++) {
          colorPop = data.features[i].properties.pop_est;
        }
        var countries = L.geoJson(data, {
          onEachFeature: onEachFeature,

          style: function (countries) {
            return {
              attribution: "XXXXXX 🇦🇴 XXXXXXX",
              color: "red",
              opacity: .8,
              fillColor: getColorCountry(countries.properties.pop_est),
              fillOpacity: 0.8,
              weight: 1,
            };

            function getColorCountry(d) {
              return d > 10000000000 ? '#800026' :
                d > 5000000000 ? '#BD0026' :
                d > 2000000000 ? '#E31A1C' :
                d > 100000000 ? '#FC4E2A' :
                d > 50000000 ? '#FD8D3C' :
                d > 20000000 ? '#FEB24C' :
                d > 10000000 ? '#FED976' :
                '#FFEDA0'
            }
          },
        });

        // Happens on mouse out
        function reset(e) {
          countries.resetStyle(e.target);
          displayInfo.update();
        }

        var conflicts = "TradeWar/data/countries_in_conflict.json";
        var conflictZones = [];
        d3.json(conflicts, function (data) {
          conflictZones = data.map(data => data.country);
          conflictNames = data.map(data => data);
        });

        // On hover control that displays information about hovered upon country
        var displayInfo = L.control();

        displayInfo.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info');
          this.update();
          return this._div;
        };

        // Passes properties of hovered upon country and displays it in the control
        displayInfo.update = function (props) {
          var temp = "";

          function conflictInfo() {
            var temp = "";
            for (var i = 0; i < conflictNames.length; i++) {
              ((conflictNames[i].country === props.name) ? temp = conflictNames[i].name_of_conflict : 'Off');
              while (temp == conflictNames[i].name_of_conflict) {
                return temp
              }
            }
          }
          // conflictInfo();
          function conflictDead() {
            var temp = "";
            for (var i = 0; i < conflictNames.length; i++) {
              ((conflictNames[i].country === props.name) ? temp = conflictNames[i].num_deaths_2019 : 'Off');
              while (temp == conflictNames[i].num_deaths_2019) {
                return temp
              }
            }
          }
          this._div.innerHTML = '<h2>Wealth Countries</h2>' + (props ?
            '<h3>' + props.formal_en + '</h3>' + '<b>' + 'GDP in Trillions of USD: ' + '</b>' + props.gdp_md_est / 1000000 + '<br />' +
            '<b>' + ' GDP in Billions of USD: ' + '</b>' + props.gdp_md_est / 1000 + '<br />' +
            '<b>' + 'Economic Status: ' + '</b>' + props.economy + '<br />' +
            '<b>' + 'Population: ' + '</b>' + props.pop_est / 1000000 + ' million people' + '<br />' +
            '<b>' + 'CONFLICT: ' + '</b>' + conflictInfo() + ' Deaths: ' + conflictDead() + '<br />' :

            'Hover over a country');
        };

        function style(feature) {
          return {
            fillColor: getColor(feature.properties.gdp_md_est),
            weight: 1,
            opacity: 1,
            color: 'snow',
            fillOpacity: .7
          };
        }
        // Happens on mouse hover
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
          layers: [streetmap, countries]
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

        function getColor(d) {
          return d >= 8 ? 'blue' :
            d > 6.4 ? 'red' :
            d > 5.2 ? 'orange' :
            d > 4 ? 'yellow' :
            d > 0 ? 'white' :
            'blue';
        }

        // Create overlay object to hold our overlay layer
        var overlayMaps = {
          Countries: countries,
          Earthquakes: earthquakes,
          Earthquakes2015: earthquakes2015
        };

        L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(myMap);

        displayInfo.addTo(myMap);

        var legend = L.control({
          position: 'bottomright'
        });

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


};

createMap();