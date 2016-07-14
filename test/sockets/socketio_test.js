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
                  expect(roomName).to.equal("Room: 1");
                  client2.emit('game', {
                    room: roomName,
                    pokemon: pokemon2
                  });
                  client1.on('game', function(opponentPokemon) {
                    expect(opponentPokemon.name).to.equal("ekans");
                    client1.disconnect();
                    client2.disconnect();
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
                  client1.disconnect();
                  client2.disconnect();
                  done();
                })
              });
          });
      });
    });
    it('should pair players in different rooms', function(done) {
      var client1 = io.connect(socketURL, options);

      client1.on('connect', function(data) {
          client1.emit('lobby', pokemon1);
          var client2 = io.connect(socketURL, options);
          client2.on('connect', function(data) {
              client2.emit('lobby', pokemon2);

              var client3 = io.connect(socketURL, options);
              client3.on('connect', function(data) {
                  client3.emit('lobby', pokemon2);
                  client3.on('lobby', function(roomName) {
                    expect(roomName).to.equal('Room: 2');
                    client1.disconnect();
                    client2.disconnect();
                    client3.disconnect();
                    done();
                  });
                });
          });
      });
    });
    it('should only have two people per room', function(done) {
      var client1 = io.connect(socketURL, options);

      client1.on('connect', function(data) {
          client1.emit('lobby', pokemon1);
          var client2 = io.connect(socketURL, options);
          client2.on('connect', function(data) {
              client2.emit('lobby', pokemon2);

              var client3 = io.connect(socketURL, options);
              client3.on('connect', function(data) {

                  client3.emit('lobby', pokemon2);

                  var client4 = io.connect(socketURL, options);
                  client4.on('connect', function(data) {
                    client4.emit('lobby', pokemon2);

                    var client5 = io.connect(socketURL, options);
                    client5.on('connect', function(data) {
                      client5.emit('lobby', pokemon2);

                      client5.on('lobby', function(roomName) {
                        expect(roomName).to.equal('Room: 3');
                        client1.disconnect();
                        client2.disconnect();
                        client3.disconnect();
                        client4.disconnect();
                        client5.disconnect();
                        done();
                      });
                    })

                  })

                });
          });
      });
    });

    it('should only reset roomcount when people disconnect', function(done) {
      var client1 = io.connect(socketURL, options);

      client1.on('connect', function(data) {
          client1.emit('lobby', pokemon1);
          var client2 = io.connect(socketURL, options);
          client2.on('connect', function(data) {
              client2.emit('lobby', pokemon2);

              var client3 = io.connect(socketURL, options);
              client3.on('connect', function(data) {

                  client3.emit('lobby', pokemon2);

                  var client4 = io.connect(socketURL, options);
                  client4.on('connect', function(data) {
                    client4.emit('lobby', pokemon2);

                    var client5 = io.connect(socketURL, options);
                    client5.on('connect', function(data) {

                      client1.disconnect();
                      client2.disconnect();
                      client3.disconnect();
                      client4.disconnect();

                      client5.emit('lobby', pokemon2);

                      client5.on('lobby', function(roomName) {
                        expect(roomName).to.equal('Room: 1');

                        client5.disconnect();
                        done();
                      });
                    })

                  })

                });
          });
      });
    });
});
