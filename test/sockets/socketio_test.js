require('../helper');

var io = require('socket.io-client');

var socketURL = 'http://localhost:3000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

describe('sockets', function() {
  it('should match 2 users together', function(done) {
    var client1 = io.connect(socketURL, options);
    var client2 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      // client1.emit('testing', 'hello');
      // client1.on('testing', function(message) {
      //   expect(message).to.equal('hi');
      //   done();
      // })
    });

  });
});
