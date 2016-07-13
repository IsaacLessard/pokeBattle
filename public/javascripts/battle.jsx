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
        <h2 id="pokemon-health">Health: <span id={this.props.currentPlayer.player}>{this.props.currentPlayer.health}</span></h2>
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

var GameOverMenu = React.createClass({
  render: function() {
    return (
      <div id="gameOverMenu">
        <h2>REMATCH</h2>
        <h2><a id="new_battle" href="/pokemon_battle">CHOOSE A NEW POKEMON</a></h2>
        <h2><a id="find_opponent" href={'/pokemon_battle/battle?poke='+this.props.currentPokemon}>FIND NEW OPPONENT</a></h2>
      </div>
    )
  }
});

var BattleScene = React.createClass({
  getInitialState: function() {
    return {
      player1: $('#battle-entrypoint').data('pokedata'),
      player2: {
        player: 2,
        name: 'bulbasaur',
        health: 50,
        sprite: 'http://pokeapi.co/media/sprites/pokemon/1.png',
        moves: [{name: 'bind', damage: 40}, {name: 'slam', damage: 50}, {name: 'headbutt', damage: 60}]
      },
      gameOver: true
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
        <GameOverMenu currentPokemon={this.state.player1.name}/>
      </div>
    );
  }
});



ReactDOM.render(<BattleScene/>, document.getElementById('battle-entrypoint'));
