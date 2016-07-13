var express = require('express');
var router = express.Router();
var requestify = require('requestify');
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('pokemon_battle/home');
});

router.get('/battle', function(req, res) {
  var pokeCharacter = req.query.poke || 'bulbasaur';
  var path = "http://pokeapi.co/api/v2/pokemon/" + pokeCharacter;

  request(path, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);

      var pokemonData = {
        player: 1,
        name: pokeCharacter,
        health: 100,
        sprite: body.sprites.front_default
      };

      var damagePoints = 10,
          moves = [],
          selectedMoves = body.moves.slice(0,4);

      selectedMoves.forEach(function(move, index) {
        var obj = {};
        obj.name = move.move.name;
        obj.damage = damagePoints;
        damagePoints += 10;

        moves.push(obj);
      });
      pokemonData.moves = moves;

      res.render('pokemon_battle/battle', {pokemonData: pokemonData});
    }
  });
});

module.exports = router;
