
var Pokemon = React.createClass({

  render: function(){
    return (
      <li>
        <a href={"/pokemon_battle/battle/" + this.props.name}>
          <img src={"http://pokeapi.co"+this.props.image}/>{this.props.name}
        </a>
      </li>
    )
  }
})

var PokemonList = React.createClass({

  render: function () {
    var pokemons = this.props.pokemon.map(function(pokemon, index){
      return (
        <Pokemon name={pokemon} key={index} image={this.props.images[index]}/>
      )}.bind(this));
    return (
      <ul>
        {pokemons}
      </ul>
    )
  }
})


var HomePage = React.createClass({

  getInitialState: function() {
     return {
       selectedPokemon: [],
       pokemonImages: []

     };
   },

  componentDidMount: function(){
    this.serverRequest = $.get("http://pokeapi.co/api/v1/sprite/?limit=151", function(pokemon){
      console.log(pokemon);
      var selectedpokemon = [];
      var pokeImgs = [];
      for(var i=0;i<9;i++) {
        var randomNum = Math.floor(Math.random()*151 + 1);
        selectedpokemon.push(pokemon.objects[randomNum].pokemon.name);
        pokeImgs.push(pokemon.objects[randomNum].image);
      }
      this.setState({
        selectedPokemon: selectedpokemon,
        pokemonImages: pokeImgs
      });
    }.bind(this));
  },


  render: function() {
    return (
      <PokemonList pokemon={this.state.selectedPokemon} images={this.state.pokemonImages}/>
    )
  }
})

ReactDOM.render(<HomePage/>, document.getElementById('entry-point'))
