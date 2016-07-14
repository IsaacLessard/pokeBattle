require('../helper');

var io = require('socket.io-client');

var socketURL = 'http://localhost:3000';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

var pokemon1 = {
    "player": 1,
    "name": "ivysaur",
    "health": 100,
    "sprite": "http://pokeapi.co/media/sprites/pokemon/2.png",
    "moves": [{
        "name": "swords-dance",
        "damage": 10
    }, {
        "name": "cut",
        "damage": 20
    }, {
        "name": "bind",
        "damage": 30
    }, {
        "name": "vine-whip",
        "damage": 40
    }]
}

var pokemon2 = {
    "player": 1,
    "name": "ekans",
    "health": 100,
    "sprite": "http://pokeapi.co/media/sprites/pokemon/2.png",
    "moves": [{
        "name": "bite",
        "damage": 10
    }, {
        "name": "cut",
        "damage": 20
    }, {
        "name": "bind",
        "damage": 30
    }, {
        "name": "vine-whip",
        "damage": 40
    }]
}

describe('sockets', function() {
    it('should match 2 users together', function(done) {
        var client1 = io.connect(socketURL, options);

        client1.on('connect', function(data) {
            client1.emit('lobby', pokemon1);
            var client2 = io.connect(socketURL, options);
            client2.on('connect', function(data) {
                client2.emit('lobby', pokemon2);
                client2.on('lobby', function(roomName) {
                  expect(roomName).to.equal("room: 1");
                  client2.emit('game', {
                    room: roomName,
                    pokemon: pokemon2
                  });
                  client1.on('game', function(opponentPokemon) {
                    expect(opponentPokemon.name).to.equal("ekans");
                    done();
                  });
                });
            });
        });
    });
    it('should send attacks', function(done) {
      var client1 = io.connect(socketURL, options);

      client1.on('connect', function(data) {
          client1.emit('lobby', pokemon1);
          var client2 = io.connect(socketURL, options);
          client2.on('connect', function(data) {
              client2.emit('lobby', pokemon2);
              client2.on('lobby', function(roomName) {
                client2.emit('attack', {
                  room: roomName,
                  move: "bite"
                });
                client1.on('attack', function(move) {
                  expect(move).to.equal("bite");
                  done();
                })
              });
          });
      });
    });
    // it('should send attacks', function(done) {
    //     var client1 = io.connect(socketURL, options);
    //
    //     client1.on('connect', function(data) {
    //         client1.emit('lobby', pokemon);
    //         var client2 = io.connect(socketURL, options);
    //         client2.on('connect', function(data) {
    //             client2.emit('lobby', pokemon);
    //             client1.on('game', function(gameState1) {
    //               console.log("Gamestate1:", gameState1)
    //                 gameState1.nextMove = 'cut';
    //                 console.log("Emmitting:", gameState1)
    //                 client1.emit('game', gameState1);
    //                 client2.on('game', function(gameState2) {
    //                   console.log("Gamestate2:", gameState2)
    //                     expect(gameState2.nextMove).to.equal('cut');
    //                     client1.disconnect();
    //                     client2.disconnect();
    //                     done();
    //                 });
    //             });
    //         });
    //     });
    // });
});
