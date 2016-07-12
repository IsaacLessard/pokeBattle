require('../helper');

var http = require('http'),
    server;

var EC = protractor.ExpectedConditions;

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
      // browser.get('/pokemon_battle')
      browser.wait(EC.presenceOf(element(by.tagName('li'))), 30000);
      element.all(by.tagName('li')).then(function(elements){
        expect(elements.length).to.equal(9)
      })
      element.all(by.tagName('img')).then(function(elements){
        expect(elements.length).to.equal(9)
      })
    })

    it('User can choose a pokemon and enter battle', function (){
      element(by.tagName('li')).click()
      element(by.tagName('h1')).getText().then(function(text){
        expect(text).to.equal('Poke Battle!');
      });
    })
  })

  describe('#Battle page', function () {
    it('should show a title', function(){
      browser.get('/pokemon_battle/battle');
      element(by.tagName('h1')).getText().then(function(text){
        expect(text).to.equal('Poke Battle!');
      });
    });

    it('should have profile name and picctures of the 2 pokemons', function(){
      browser.get('/pokemon_battle/battle');
      element.all(by.tagName('h3')).then(function(elements){
        expect(elements.length).to.equal(2)
      })
      element.all(by.tagName('img')).then(function(elements){
        expect(elements.length).to.equal(2)
      })
    });
    it('should show the data of the selected pokemon', function() {
      browser.get('/pokemon_battle/battle')
      element.all(by.tagName('h3')).getText().then(function(elements){
        expect(elements).to.deep.equal(['ekans', 'bulbasaur'])
      })
      element.all(by.tagName('img')).getAttribute('src').then(function(elements){
        expect(elements).to.deep.equal(['http://pokeapi.co/media/sprites/pokemon/23.png', 'http://pokeapi.co/media/sprites/pokemon/1.png'])
      })
      element.all(by.tagName('ul')).then(function(elements) {
        expect(elements.length).to.equal(2)
      })
    })
  })
})
