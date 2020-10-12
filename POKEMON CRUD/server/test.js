app.get("/:pokemon", function (req, res) {
  let params = processParams(req);
  if (
    nombrePokemonsSaved.findIndex((nombre) => nombre == params.pokemon) != -1
  ) {
    console.log("ARRAY");
    res.send(pokemonsSaved[params.pokemon]);
  } else {
    axios
      .get("https://pokeapi.co/api/v2/pokemon/" + params.pokemon)
      .then(function (response) {
        // handle success
        console.log("AXIOS");
        pokemonsSaved[params.pokemon] = response.data;
        nombrePokemonsSaved.push(params.pokemon);
        res.send(response.data);
      })
      .catch(function (error) {
        // handle error
        res.status(404).send(error);
      })
      .then(function () {
        // always executed
      });
  }
  console.log(nombrePokemonsSaved);
});
