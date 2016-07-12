var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('pokemon_battle/home');
});

router.get('/battle', function(req, res) {
  res.render('pokemon_battle/battle')
})

module.exports = router;
