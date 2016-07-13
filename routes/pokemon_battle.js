var express = require('express');
var router = express.Router();
var requestify = require('requestify');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('pokemon_battle/home');
});

router.get('/battle', function(req, res) {
  var pokeCharacter = req.params.poke || 'bulbasaur';
  var path = "http://pokeapi.co/api/v2/pokemon/" + pokeCharacter;

  // requestify.get(path)
  //   .then(function(response) {
  //       // Get the response body (JSON parsed or jQuery object for XMLs)
  //       response.getBody();
  //       console.log(response.getBody());
  //       res.render('pokemon_battle/battle')
  //   });
  res.render('pokemon_battle/battle')

})

module.exports = router;
