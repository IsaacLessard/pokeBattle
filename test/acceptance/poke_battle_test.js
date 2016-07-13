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
      browser.get('/pokemon_battle');
      element(by.tagName('h1')).getText().then(function(text){
        expect(text).to.equal('Welcome to Pokemon Battle!');
      });
    });

    it('User can see 9 pokemon to choose from', function(){
      // browser.get('/pokemon_battle')
      browser.wait(EC.presenceOf(element(by.tagName('li'))), 30000);
      element.all(by.tagName('li')).then(function(elements){
        expect(elements.length).to.equal(9);
      });
      element.all(by.tagName('img')).then(function(elements){
        expect(elements.length).to.equal(9);
      });
    });

    it('User can choose a pokemon and enter battle', function (){
      element(by.tagName('a')).click();
      element(by.tagName('h1')).getText().then(function(text){
        expect(text).to.equal('Poke Battle!');
      });
    });
  });


  describe('#Battle page', function () {
    it('should show a title', function(){
      browser.get('/pokemon_battle/battle?name=bulbasaur');
      element(by.tagName('h1')).getText().then(function(text){
        expect(text).to.equal('Poke Battle!');
      });
    });

    it('should have profile name and picctures of the 2 pokemons', function(){
      browser.get('/pokemon_battle/battle');
      element.all(by.tagName('h3')).then(function(elements){
        expect(elements.length).to.equal(2)
      });
      element.all(by.tagName('img')).then(function(elements){
        expect(elements.length).to.equal(2)
      });
    });

    it('should show the data of the selected pokemon', function() {
      browser.get('/pokemon_battle/battle?poke=ekans')
      element.all(by.tagName('h3')).getText().then(function(elements){
        expect(elements).to.deep.equal(['ekans', 'bulbasaur']);
      });
      element.all(by.tagName('img')).getAttribute('src').then(function(elements){
        expect(elements).to.deep.equal(['http://pokeapi.co/media/sprites/pokemon/23.png', 'http://pokeapi.co/media/sprites/pokemon/1.png']);
      });
      element.all(by.tagName('button')).then(function(elements) {
        expect(elements.length).to.equal(7);
      });
      element.all(by.id('pokemon-health')).then(function(elements) {
        expect(elements.length).to.equal(2);
      });
    });
  });

  describe('#Game Over', function(){

    it('should display options', function(){
      browser.get('/pokemon_battle/battle');
      element(by.id('gameOverMenu')).isPresent().then(function(here){
        expect(here).to.be.true;
      });
    });

    describe('Player can choose a new pokemon', function(){

      it('Player can choose option to pick new pokemon', function(){
        browser.get('/pokemon_battle/battle');
        element(by.id('new_battle')).click();
        element(by.tagName('h1')).getText().then(function(text){
          expect(text).to.equal('Welcome to Pokemon Battle!');
        });
      });
    });

    describe('Player can find a new battle with current pokemon', function() {

      it('Can choose option to find new opponent with current pokemon', function() {
        browser.get('/pokemon_battle/battle');
        element(by.id('find_opponent')).click();
        element(by.tagName('h1')).getText().then(function(text){
          expect(text).to.equal('Poke Battle!');
        });
      });

      it('should have the same pokemon from the previous battle', function(){
        browser.get('/pokemon_battle/battle?poke=ekans');
        element(by.id('find_opponent')).click();
        browser.getCurrentUrl().then(function(url){
          url = url.split('?')[1];
          expect(url).to.equal('poke=ekans');
        });
      });
    });
  });
}); // top describe
