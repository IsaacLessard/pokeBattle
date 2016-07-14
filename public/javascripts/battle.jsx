var PlayerScene = React.createClass({
  getMoveButtons: function() {
    return this.props.currentPlayer.moves.map(function(move) {
      return <ButtonMove moveObj={move} key={move.name} updateHealth={this.props.updateHealth} currentPlayer={this.props.currentPlayer} opponent={this.props.opponent}/>
    }.bind(this))
  },

  render: function() {
    var playerSceneDiv = null;
    if (!this.props.gameOver && this.props.currentPlayer) {
      playerSceneDiv = (
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
    return playerSceneDiv
  }
});

var ButtonMove = React.createClass({
  attack: function() {
    this.props.updateHealth(this.props.opponent, this.props.moveObj);
  },

  render: function() {
    return (
      <button id={this.props.moveObj.name} onClick={this.attack}>{this.props.moveObj.name}</button>
    );
  }
});

var GameOverMenu = React.createClass({
  render: function() {
    var el = null;
    if (this.props.opponent == null) return (<p>Waiting for opponent to connect...</p>)
    if (this.props.opponent.defeated){
      el = (
        <div id="gameOverMenu">
          <h4 id="result_message">You win!!!</h4>
          <h2>REMATCH</h2>
          <h2><a id="new_battle" href="/pokemon_battle">CHOOSE A NEW POKEMON</a></h2>
          <h2><a id="find_opponent" href={'/pokemon_battle/battle?poke='+this.props.currentPokemon}>FIND NEW OPPONENT</a></h2>
        </div>
      )
    }else if (this.props.currentPlayer.defeated) {
      el = (
        <div id="gameOverMenu">
          <h4 id="result_message">You lose!!!</h4>
          <h2>REMATCH</h2>
          <h2><a id="new_battle" href="/pokemon_battle">CHOOSE A NEW POKEMON</a></h2>
          <h2><a id="find_opponent" href={'/pokemon_battle/battle?poke='+this.props.currentPokemon}>FIND NEW OPPONENT</a></h2>
        </div>
      )
    }
    return el
  }
});

var BattleScene = React.createClass({
  // {
  //   player: 2,
  //   name: 'bulbasaur',
  //   health: 50,
  //   sprite: 'http://pokeapi.co/media/sprites/pokemon/1.png',
  //   moves: [{name: 'bind', damage: 40}, {name: 'slammer', damage: 50}, {name: 'headbutt', damage: 60}],
  //   defeated: false
  // },
  getInitialState: function() {
    return {
      player1: $('#battle-entrypoint').data('pokedata'),
      player2: null,
      gameOver: false,
      sentTwice: false,
      myRoom: null,
      test: false
    };
  },

  componentDidMount: function () {
    this.socket = io();
    this.socket.on('attack', this._moveAttack);
    this.socket.on('lobby', this._lobby);
    this.socket.on('game', this._game);


    this.socket.on('connect', function(data) {
      this.socket.emit('lobby', this.state.player1);
    }.bind(this));
  },

  _lobby: function(room) {
    this.setState({myRoom: room});
    this.socket.emit('game', {
      room: room,
      pokemon: this.state.player1
    });
  },

  _game: function (info) {
    if(!this.state.sentTwice) {
      this.setState({
        sentTwice: true
      })
      var incomingPlayer = {
        fromClient: true
      };
      this.socket.emit('lobby', incomingPlayer)
    }
    this.setState({
      player2: info
    })
  },

  _moveAttack: function(victim) {
    this.setState({player1: victim});
  },

  updateHealth: function(victimPlayer, moveObj) {
    if (victimPlayer.health <= 0) return;
    victimPlayer.health -= moveObj.damage;

    if (victimPlayer.health <= 0) {
      victimPlayer.health = 0
      victimPlayer.defeated = true
      this.state.gameOver = true
    };
    this.setState({player2: victimPlayer});

    var attackInfo = {
      room: this.state.myRoom,
      move: moveObj.name,
      damage: moveObj.damage,
      victim: victimPlayer
    };
    this.socket.emit('attack', attackInfo);
  },

  render: function() {
    return (
      <div>
        <PlayerScene gameOver={this.state.gameOver} currentPlayer={this.state.player1} opponent={this.state.player2} updateHealth={this.updateHealth} />
        <hr />
        <PlayerScene gameOver={this.state.gameOver} currentPlayer={this.state.player2} updateHealth={this.updateHealth} />
        <GameOverMenu currentPokemon={this.state.player1.name} currentPlayer={this.state.player1} opponent={this.state.player2}/>
      </div>
    );
  }
});



ReactDOM.render(<BattleScene/>, document.getElementById('battle-entrypoint'));
