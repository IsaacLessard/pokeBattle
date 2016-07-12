require('../helper');

var http = require('http'),
    server;

before(function() {
  server = http.createServer(require('../../app'));
  server.listen(0);
  browser.baseUrl = 'http://localhost:' + server.address().port;
});

beforeEach(function() {
  return browser.ignoreSynchronization = true;
});

after(function(){
  server.close();
});

describe('battle dynamics', function(){
	it('when a player clicks on a move, HP updates', function(){
    browser.get('/pokemon_battle/battle');
    element(by.id('slam')).click();
    element(by.id('2')).getText().then(function (text) {
      expect(text).to.equal('30')
    })
	})
})
