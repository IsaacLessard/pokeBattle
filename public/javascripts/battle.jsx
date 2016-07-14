var PlayerScene = React.createClass({
  getMoveButtons: function() {
    return this.props.currentPlayer.moves.map(function(move) {
      return <ButtonMove moveObj={move} key={move.name} updateHealth={this.props.updateHealth} currentPlayer={this.props.currentPlayer} opponent={this.props.opponent}/>
    }.bind(this))
  },

  render: function() {
    var playerSceneDiv = null;
    console.log('Curr: ', this.props.currentPlayer)
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
  getInitialState: function() {
    return {
      player1: $('#battle-entrypoint').data('pokedata'),

      player2: null,
      // {
      //   player: 2,
      //   name: 'bulbasaur',
      //   health: 50,
      //   sprite: 'http://pokeapi.co/media/sprites/pokemon/1.png',
      //   moves: [{name: 'bind', damage: 40}, {name: 'slammer', damage: 50}, {name: 'headbutt', damage: 60}],
      //   defeated: false
      // },
      gameOver: false,
      sentTwice: false
    };
  },

  componentDidMount: function () {
    console.log('state: ', this.state.player1)
    var that = this;
    this.socket = io();
    this.socket.on('connect', function(data) {
      //console.log('player connected')
      this.socket.emit('lobby', this.state.player1)
      this.socket.on('lobby', function(room) {
        //console.log('lobbyed: joining: ', room)
        this.socket.emit('game', {
          room: room,
          pokemon: this.state.player1
        })
        this.socket.on('game', function (info) {
          console.log('game: ', info.name)
          if(!this.state.sentTwice) {
            this.setState({
              sentTwice: true
            })
            this.socket.emit('lobby', this.state.player1)
          }
          this.setState({
            player2: info
          })
          console.log('state',this.state)
        }.bind(this))
      }.bind(this))
    }.bind(this))
  },

  updateHealth: function(victimPlayer, damage) {
    if (victimPlayer.health <= 0) return;

    victimPlayer.health -= damage;
    if (victimPlayer.health <= 0) {
      victimPlayer.health = 0
      victimPlayer.defeated = true
      this.state.gameOver = true
    };
      this.setState({player2: victimPlayer});
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
