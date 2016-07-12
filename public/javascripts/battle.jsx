var player1 ={
    name: 'ekans',
    health: 100,
    sprite: 'http://pokeapi.co/media/sprites/pokemon/23.png',
    moves: [{name: 'bind', damage: 10}, {name: 'slam', damage: 10}, {name: 'headbutt', damage: 10}]
  }

var player2 = {
    name: 'bulbasaur',
    health: 100,
    sprite: 'http://pokeapi.co/media/sprites/pokemon/1.png',
    moves: [{name: 'razor-wind', damage: 10}, {name: 'swords-dance', damage: 10}, {name: 'cut', damage: 10}]
  }

var PlayerScene = React.createClass({
  getMoveButtons: function() {
    return this.props.pokemon.moves.map(function(move, index) {
      return <ButtonMove moveObj={move} key={index}/>
    })
  },

  render: function() {
    return (
      <div className="battlePoke">
        <h3>Name: {this.props.pokemon.name}</h3>
        <h2>Health: {this.props.pokemon.health}</h2>
        <img src={this.props.pokemon.sprite}></img>
        <div>
          {this.getMoveButtons()}
        </div>
      </div>
    )
  }
});

var ButtonMove = React.createClass({
  render: function() {
    return (
      <button>{this.props.moveObj.name}</button>
    );
  }
});

var BattleScene = React.createClass({
  render: function() {
    return (
      <div>
        <PlayerScene pokemon={player1}/>
        <hr />
        <PlayerScene pokemon={player2}/>
      </div>
    )
  }
})


ReactDOM.render(<BattleScene/>, document.getElementById('battle-entrypoint'))
