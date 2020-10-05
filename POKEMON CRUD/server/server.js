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

let mazo = {};

function getPokemon(name) {
  return axios
    .get("https://pokeapi.co/api/v2/pokemon/" + name)
    .then((response) => response.data);
}

async function getPokemonCard(name) {
  let rawData = await getPokemon(name);
  let typeNames = [];
  rawData.types.forEach((typeData) => {
    typeNames.push(typeData.type.name);
  });
  let card = {
    name: rawData.name,
    id: rawData.id,
    weight: rawData.weight,
    height: rawData.height,
    base_experience: rawData.base_experience,
    sprite: rawData.sprite,
    typeNames,
  };
  return card;
}

app.post("/add", async function (req, res) {
  let params = processParams(req);
  let typecard = params.type;
  let name = params.name;
  let data;
  if (typecard != "pokemon") {
    data = params.data;
  } else {
    data = await getPokemonCard(name);
  }
  let card = { name: name, typecard: typecard, data: data };
  mazo[`${name}`] = card;
  res.send("Success");
});

app.get("/get/:id", function (req, res) {
  let params = processParams(req);
  let name = params.id; //Utilizamos el nombre de la carta como ID
  let card = mazo[`${name}`];
  if (card == null) {
    res.send("NOT FOUND");
  } else {
    res.send(card);
  }
});

app.delete("/delete/:id", function (req, res) {
  let params = processParams(req);
  let name = params.id; //Utilizamos el nombre de la carta como ID
  delete mazo[`${name}`];
  res.send("Success");
});

app.get("/get", function (req, res) {
  let card = mazo;
  if (card == null) {
    res.send("NOT FOUND");
  } else {
    res.send(card);
  }
});

app.put("/put/:id", function (req, res) {
  let params = processParams(req);
  let name = params.id;
  let data = params.data; //el parseo de la data será desde front, data contiene todo
  mazo[`${name}`].data = data;
  console.log(mazo);
  res.send("Success");
});

app.listen(3000);
