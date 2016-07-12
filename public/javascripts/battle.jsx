var PlayerScene = React.createClass({
  getMoveButtons: function() {
    return this.props.currentPlayer.moves.map(function(move) {
      return <ButtonMove moveObj={move} key={move.name} updateHealth={this.props.updateHealth} currentPlayer={this.props.currentPlayer} opponent={this.props.opponent}/>
    }.bind(this))
  },

  render: function() {
    return (
      <div className="battlePoke">
        <h3>{this.props.currentPlayer.name}</h3>
        <h2>Health: <span id={this.props.currentPlayer.player}>{this.props.currentPlayer.health}</span></h2>
        <img src={this.props.currentPlayer.sprite}></img>
        <div>
          {this.getMoveButtons()}
        </div>
      </div>
    )
  }
});

var ButtonMove = React.createClass({
  attack: function() {
    console.log('button clicked by', this.props.currentPlayer.player, "reduce opponet health", this.props.opponent.health, 'by', this.props.moveObj.damage);
    this.props.updateHealth(this.props.opponent, this.props.moveObj.damage);
  },

  render: function() {
    return (
      <button id={this.props.moveObj.name} onClick={this.attack}>{this.props.moveObj.name}</button>
    );
  }
});

var BattleScene = React.createClass({
  getInitialState: function() {
    return {
      player1: {
        player: 1,
        name: 'ekans',
        health: 100,
        sprite: 'http://pokeapi.co/media/sprites/pokemon/23.png',
        moves: [{name: 'bind', damage: 10}, {name: 'slam', damage: 20}, {name: 'headbutt', damage: 30}]
      },
      player2: {
        player: 2,
        name: 'bulbasaur',
        health: 50,
        sprite: 'http://pokeapi.co/media/sprites/pokemon/1.png',
        moves: [{name: 'razor-wind', damage: 40}, {name: 'swords-dance', damage: 50}, {name: 'cut', damage: 60}]
      }
    };
  },

  updateHealth: function(victimPlayer, damage) {
    if (victimPlayer.health <= 0) return;

    victimPlayer.health -= damage;
    if (victimPlayer.health <= 0) victimPlayer.health = 0;

    if (victimPlayer.player == 1) {
      this.setState({player1: victimPlayer});
    } else {
      this.setState({player2: victimPlayer});
    }
  },

  render: function() {
    return (
      <div>
        <PlayerScene currentPlayer={this.state.player1} opponent={this.state.player2} updateHealth={this.updateHealth} />
        <hr />
        <PlayerScene currentPlayer={this.state.player2} opponent={this.state.player1} updateHealth={this.updateHealth} />
      </div>
    )
  }
})


ReactDOM.render(<BattleScene/>, document.getElementById('battle-entrypoint'))
