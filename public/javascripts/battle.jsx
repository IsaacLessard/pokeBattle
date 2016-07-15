var PlayerScene = React.createClass({
  getMoveButtons: function() {
    return this.props.currentPlayer.moves.map(function(move) {
      return <ButtonMove moveObj={move} key={move.name} updateHealth={this.props.updateHealth} currentPlayer={this.props.currentPlayer} opponent={this.props.opponent}/>
    }.bind(this))
  },

  render: function() {
    var playerSceneDiv = null,
        el = null;
    if (!this.props.player2) {
      el = <div>{this.getMoveButtons()}</div>
    }

    if (!this.props.gameOver && this.props.currentPlayer) {
      playerSceneDiv = (
        <div className="battlePoke">
          <h3>{this.props.currentPlayer.name}</h3>
          <h2 id="pokemon-health">Health: <span id={this.props.currentPlayer.player}>{this.props.currentPlayer.health}</span></h2>
          <img src={this.props.currentPlayer.sprite}></img>
          <div id="all_buttons">
            {el}
          </div>
          <label id="waiting"></label>
        </div>
      );
    }
    return playerSceneDiv;
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
    this.socket.on('anotherPlayerMove', this._anotherPlayerMove);

    this.socket.on('connect', function(data) {
      this.socket.emit('lobby');
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
      this.setState({ sentTwice: true });
      this.state.player1.myTurn = true;
      info.myTurn = false;
      this.socket.emit('lobby', { fromClient: true });
    }
    this.setState({
      player1: this.state.player1,
      player2: info
    });
  },

  _moveAttack: function(victim) {
    this.setState({player1: victim});
  },

  _anotherPlayerMove: function() {
    $('#waiting').text('');
    $('#all_buttons').show();
  },

  updateHealth: function(victimPlayer, moveObj) {
    if (victimPlayer.health <= 0) return;

    $('#all_buttons').hide();
    $('#waiting').text('Waiting for your opponent...');
    this.socket.emit('anotherPlayerMove', this.state.myRoom);

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
    this.state.player1.sprite = this.state.player1.backSprite;
    if(this.state.player2) {
      this.state.player2.sprite = this.state.player2.frontSprite;
    }
    return (
      <div>
        <div className='opponent'>
          <PlayerScene gameOver={this.state.gameOver} currentPlayer={this.state.player2} updateHealth={this.updateHealth} player2={true}/>
        </div>

        <hr />

        <PlayerScene gameOver={this.state.gameOver} currentPlayer={this.state.player1} opponent={this.state.player2} updateHealth={this.updateHealth} />
        <GameOverMenu currentPokemon={this.state.player1.name} currentPlayer={this.state.player1} opponent={this.state.player2}/>
      </div>
    );
  }
});



ReactDOM.render(<BattleScene/>, document.getElementById('battle-entrypoint'));
