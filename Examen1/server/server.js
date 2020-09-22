const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

function processParams(req) {
  return Object.assign({}, req.body, req.params, req.query);
}

app.get("/", function (request, response) {
  response.sendFile(
    "C:/Users/Moisés/Desktop/AppWeb/Github/AppWeb/Examen1/index.html"
  );
});

let pokemonsSaved = {};
let nombrePokemonsSaved = [];

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

app.listen(3000);
