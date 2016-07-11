
var Pokemon = React.createClass({

  render: function(){
    return (
      <li>{this.props.name}</li>
    )
  }
})

var PokemonList = React.createClass({

  getInitialState: function(){
    return {
      pokemons: [],
      rendered: false
    }
  },

  apiCall: function () {
    if (this.state.rendered) return;
    console.log("Hey I was called yo!")
    var pokeArray = [];
    for(var i=0;i<9;i++) {
      var randomNum = Math.floor(Math.random()*700 + 1);
      var pokeApi = "http://pokeapi.co/api/v2/pokemon/" + randomNum;
      var pokePromise = $.get(pokeApi)
      pokeArray.push(pokePromise)
    }
    Promise.all(pokeArray).then((resultArray) => {
      var finalArray = resultArray.map(function (item) {
        return {
          name: item.name,
          moves: item.moves.slice(0,3)
        }
      })
      this.setState({
        finalArray: finalArray
      })
      this.setState({
        pokemons: this.state.finalArray.map(function(pokemon, index){
          return (
            <Pokemon name={pokemon.name} key={index}/>
          )
        })
      });
      this.setState({
        rendered: true
      })
    })


  },

  // pokemons: this.state.finalArray.map(function(pokemon){
  //   return (
  //     <Pokemon name={pokemon.name}/>
  //   )
  // }),

  render: function () {
      this.apiCall()
    return (
      <ul>
        {this.state.pokemons}
      </ul>
    )
  }
})


var HomePage = React.createClass({

  render: function() {
    return (
      <PokemonList/>
    )
  }
})

ReactDOM.render(<HomePage/>, document.getElementById('entry-point'))
