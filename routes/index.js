const express = require('express');
const gjv = require('geojson-validation');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');

/* GET home page. 
* Query string params:
*  - 'icon' with the color of the icon: (red, blue, teal, brown, green, yellow, pink) (example: &icon=pale)
*  - 'geojson' with the geojson string to show on the map (if this is found, the rest of the parameters are omitted)
*  - 'url' with the url of the database to extract the features
*  - 'locale' the lang tag of the content to extract the names of the features
*/
router.get('/', function(req, res, next) {
  var geojson = { type : "FeatureCollection", features: []}
  var colors = ['red', 'blue', 'teal', 'brown', 'green', 'yellow', 'pink', 'pale']

  // Get the color
  var color = req.query.icon
  if (!color || !colors.includes(color)) {
    color = 'red' // by default
  }

  // First, checks the geojson parameter (top priority)
  try {
    if (req.query.geojson) {
      geojson = JSON.parse(req.query.geojson)
      if(!gjv.valid(geojson)) {
        geojson = { type : "FeatureCollection", features: []}
        console.error('Not a valid GeoJSON')
        const trace = gjv.isFeature(req.query.geojson, true)
        console.error(trace)
      } 
      res.render('index', { title: 'Map Generator', geojson: geojson, colorIcon: color });
    }
    // It could receive the URL to the configuration file
    if (req.query.url && req.query.locale) {
      fetch(req.query.url)
      .then(res => res.json())
      .then(json => {
        const items = json.content[req.query.locale].pois
        for (let i = 0; i < items.length; i++) {
          const element = items[i];
          geojson.features.push({
            type: "Feature",
            properties: {
              popupContent: element.name.replace(/"/g, "&quot;").replace(/'/g, "&#039;")
            },
            geometry: {
              type: "Point",
              coordinates: [ parseFloat(element.lon), parseFloat(element.lat) ]
            }
          })
        }
        if(!gjv.valid(geojson)) {
          // reset the geojson
          geojson = { type : "FeatureCollection", features: []}
          console.error('Not a valid GeoJSON')
          const trace = gjv.isFeature(geojson, true)
          console.error(trace)
        } 
        res.render('index', { title: 'Map Generator', geojson: geojson, colorIcon: color }); 
      }).catch(err => {
        console.error(`I cannot parse the JSON file (request query: ${req.query})`)
        console.error(err)
        geojson = { type : "FeatureCollection", features: []}
        res.render('index', { title: 'Map Generator', geojson: geojson, colorIcon: color });
      })
    }
  } catch (e) {
    geojson = { type : "FeatureCollection", features: []}
    console.error('Not a valid GeoJSON ' + e)
    res.render('index', { title: 'Map Generator', geojson: geojson, colorIcon: color });
  }
});

module.exports = router;
