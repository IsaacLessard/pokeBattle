var player1 ={
    name: 'ekans',
    sprite: 'http://pokeapi.co/media/sprites/pokemon/23.png',
    moves: ['bind', 'slam', 'headbutt']
  }

var player2 = {
    name: 'bulbasaur',
    sprite: 'http://pokeapi.co/media/sprites/pokemon/1.png',
    moves: ['razor-wind', 'swords-dance', 'cut']
  }

var PlayerScene = React.createClass({

  render: function() {
    return (
      <div class="battlePoke">
        <h3>{this.props.data.name}</h3>
        <img src={this.props.data.sprite}></img>
        <ul>
          {this.props.data.moves}
        </ul>
      </div>
    )
  }
})


var BattleScene = React.createClass({
  render: function() {
    return (
      <div>
        <PlayerScene data={player1}/>
        <PlayerScene data={player2}/>
      </div>
    )
  }
})


ReactDOM.render(<BattleScene/>, document.getElementById('battle-entrypoint'))
