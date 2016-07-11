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


describe('Pokemon Battle', function(){
  describe('#Main page', function(){

    it('should show a title', function(){
      browser.get('/pokemon_battle')
      element(by.tagName('h1')).getText().then(function(text){
        expect(text).to.equal('Welcome to Pokemon Battle!')
      })
    })
    it('User can see 9 pokemon to choose from', function(){
      browser.get('/pokemon_battle')
      browser.driver.sleep(10000)
      element.all(by.tagName('li')).then(function(elements){
        expect(elements.length).to.equal(9)
      })
    })
    it('User can choose a pokemon and enter battle', function (){
      rowser.get('/pokemon_battle')
      browser.driver.sleep(10000)
    })
  })
})
