var express = require('express');
var gjv = require('geojson-validation');
var router = express.Router();

/* GET home page. 
* Query string params:
*  -  'geojson' with the GeoJSON with the features
*  -  'icon' with the color of the icon: (red, blue, teal, brown, green, yellow, pink) (example: &icon=pale)
* Example: http://127.0.0.1:3000/?geojson=%7B%0A%20%20%22type%22%3A%20%22FeatureCollection%22%2C%0A%20%20%22features%22%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22Feature%22%2C%0A%20%20%20%20%20%20%22properties%22%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%22geometry%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%20%20%22coordinates%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20-0.087890625%2C%0A%20%20%20%20%20%20%20%20%20%2043.45291889355465%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22Feature%22%2C%0A%20%20%20%20%20%20%22properties%22%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%22geometry%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%20%20%22coordinates%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%201.23046875%2C%0A%20%20%20%20%20%20%20%20%20%2048.45835188280866%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22Feature%22%2C%0A%20%20%20%20%20%20%22properties%22%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%22geometry%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%20%20%22coordinates%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%204.39453125%2C%0A%20%20%20%20%20%20%20%20%20%2044.59046718130883%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22Feature%22%2C%0A%20%20%20%20%20%20%22properties%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22marker-color%22%3A%20%22%2358ca7b%22%2C%0A%20%20%20%20%20%20%20%20%22marker-size%22%3A%20%22medium%22%2C%0A%20%20%20%20%20%20%20%20%22marker-symbol%22%3A%20%22circle%22%2C%0A%20%20%20%20%20%20%20%20%22name%22%3A%20%22My%20point%22%2C%0A%20%20%20%20%20%20%20%20%22title%22%3A%20%22my%20point%202%22%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%22geometry%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22type%22%3A%20%22Point%22%2C%0A%20%20%20%20%20%20%20%20%22coordinates%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%206.6796875%2C%0A%20%20%20%20%20%20%20%20%20%2049.03786794532644%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D
* 
*/
router.get('/', function(req, res, next) {
  var geojson = { type : "FeatureCollection", features: []}
  var color = 'red'
  var colors = ['red', 'blue', 'teal', 'brown', 'green', 'yellow', 'pink', 'pale']
  try {
    geojson = JSON.parse(req.query.geojson)
    color = req.query.icon

    if (!colors.includes(color)) {
      color = 'red' // by default
    }

    if(!gjv.valid(geojson)) {
      geojson = { type : "FeatureCollection", features: []}
      console.error('Not a valid GeoJSON')
      const trace = gjv.isFeature(req.query.geojson, true)
      console.error(trace)
    }  
  } catch (e) {
    console.error('Not a valid GeoJSON ' + e)
  }
  res.render('index', { title: 'Map Generator', geojson: geojson, colorIcon: color });
});

module.exports = router;
