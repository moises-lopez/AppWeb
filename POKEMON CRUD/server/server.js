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


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://123:123@cluster0.qcopr.mongodb.net/POKEMONGAME?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("POKEMONGAME");

  app.post("/add", async (req, res) => {
    let params = processParams(req);
    params = params.params
    console.log(params)
    let typecard = params.type;
    let name = params.name;
    let data;
    //console.log(params.params.name, typecard)
    if (typecard != "pokemon") {
      data = params.data;
    } else {
      data = await getPokemonCard(name);
    }
    let card = { name: name, typecard: typecard, data: data };
    dbo.collection("DECK").insertOne(card);
    res.send("Success");
  });


  app.get("/get/:id", (req, res) => {
    let params = processParams(req);
    let name = params.id; //Utilizamos el nombre de la carta como ID
    dbo.collection("DECK").find({name : name}).toArray(function(err, result){ res.send(result) });
    
  });
  
  app.delete("/delete/:id", function (req, res) {
    console.log("DELETE?")
    let params = processParams(req);
    let name = params.id; //Utilizamos el nombre de la carta como ID
    dbo.collection("DECK").remove({name : name})
    
    res.send("Deleted")
  });
  
  app.get("/get", function (req, res) {
    dbo.collection("DECK").find().toArray(function(err, result){ res.send(result) });
  });
  
  app.put("/put/:id", function (req, res) {
    let params = processParams(req);
    params = params.params
    console.log(params)
    let myname = params.name;
    let mydata = params.data; //el parseo de la data será desde front, data contiene todo
    var myquery = { name : myname };
    var newvalues = { $set: {data: mydata } };
    console.log(mydata, myname)
    dbo.collection("DECK").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
    res.send("Success");
  });
  
});

function processParams(req) {
  return Object.assign({}, req.body, req.params, req.query);
}

let mazo = {};

const getPokemon = (name) => {
  return axios
    .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then((response) => response.data);
};

const getPokemonCard = async (name) => {
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
    sprites: rawData.sprites,
    typeNames,
  };
  return card;
};



  app.listen(3000);

