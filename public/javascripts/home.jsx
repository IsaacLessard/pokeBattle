
var Pokemon = React.createClass({

  render: function(){
    return (
      <li><img src={"http://pokeapi.co"+this.props.image}/>{this.props.name}</li>
    )
  }
})

var PokemonList = React.createClass({

  // getInitialState: function(){
  //   return {
  //     pokemons: [],
  //     rendered: false
  //   }
  // },

  // apiCall: function () {
  //   if (this.state.rendered) return;
  //   console.log("Hey I was called yo!")
  //   // var pokeArray = [];
  //   var pokeApi = "http://pokeapi.co/api/v2/pokemon?limit=721";
  //   var pokePromise = $.get(pokeApi)
  //   pokePromise.then(function(pokemon) {
  //     var selectedpokemon = [];
  //     for(var i=0;i<9;i++) {
  //       var randomNum = Math.floor(Math.random()*721 + 1);
  //       selectedpokemon.push(pokemon.results[randomNum].name);
  //     }
  //   });
    // for(var i=0;i<9;i++) {
    //   var randomNum = Math.floor(Math.random()*700 + 1);
    //   var pokeApi = "http://pokeapi.co/api/v2/pokemon/" + randomNum;
    //   var pokePromise = $.get(pokeApi)
    //   pokeArray.push(pokePromise)
    // }
  //   Promise.all(pokeArray).then((resultArray) => {
  //     var finalArray = resultArray.map(function (item) {
  //       return {
  //         name: item.name,
  //         moves: item.moves.slice(0,3)
  //       }
  //     })
  //     this.setState({
  //       finalArray: finalArray
  //     })
  //     this.setState({

  //       })
  //     });
  //     this.setState({
  //       rendered: true
  //     })
  //   })
  //
  //
  // },

  // pokemons: this.state.finalArray.map(function(pokemon){
  //   return (
  //     <Pokemon name={pokemon.name}/>
  //   )
  // }),

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
