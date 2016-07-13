require('../helper');

var io = require('socket.io-client');

var socketURL = 'http://localhost:3000';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

var pokemon = {
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

describe('sockets', function() {
    it('should check that 2 users connect', function(done) {
        var client1 = io.connect(socketURL, options);

        client1.on('connect', function(data) {
            client1.emit('lobby', pokemon);
            var client2 = io.connect(socketURL, options);
            client2.on('connect', function(data) {
                client2.emit('lobby', pokemon);
                client2.on('game', function(gameState) {
                    expect(gameState.gameOver).to.equal(false);
                    client2.disconnect();
                    done();
                });
            });
        });
    });

    it('should match 2 users together', function(done) {
        var client1 = io.connect(socketURL, options);

        client1.on('connect', function(data) {
            client1.emit('lobby', pokemon);
            var client2 = io.connect(socketURL, options);
            client2.on('connect', function(data) {
                client2.emit('lobby', pokemon);
                client2.on('game', function(gameState) {
                  expect(gameState.player1).toExist();
                  client1.disconnect();
                  client2.disconnect();
                  done();
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
