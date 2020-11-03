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

var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://123:123@cluster0.qcopr.mongodb.net/POKEMONGAME?retryWrites=true&w=majority";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("POKEMONGAME");

  // app.get("/get/game", function (req, res) {
  //   dbo
  //     .collection("games")
  //     .find()
  //     .toArray(function (err, result) {
  //       res.send(result);
  //     });
  // });

  app.post("/addGame", async (req, res) => {
    let params = processParams(req);
    let myId = params.params.id;
    let numId = parseInt(myId, 10);
    console.log("numid = ", numId);
    console.log("params id = ", params.id);
    let game = {
      id: numId,
      cards: [],
    };
    dbo.collection("games").insertOne(game);
    res.send("Success");
  });

  app.get("/updateStatus", async (req, res) => {
    let params = processParams(req);
    let myId = params.id;
    let numId = parseInt(myId, 10);
    console.log("Update status server");
    dbo
      .collection("games")
      .find({ id: numId })
      .project({ _id: 0, cards: 1 })
      .toArray(function (err, result) {
        console.log(result);
        res.send(result);
      });
  });

  app.post("/add", async (req, res) => {
    let params = processParams(req);
    params = params.params;
    console.log(params);
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
    dbo
      .collection("DECK")
      .find({ name: name })
      .toArray(function (err, result) {
        res.send(result);
      });
  });

  app.delete("/delete/:id", function (req, res) {
    console.log("DELETE?");
    let params = processParams(req);
    let name = params.id; //Utilizamos el nombre de la carta como ID
    dbo.collection("DECK").remove({ name: name });

    res.send("Deleted");
  });

  app.get("/get", function (req, res) {
    dbo
      .collection("DECK")
      .find()
      .toArray(function (err, result) {
        res.send(result);
      });
  });

  app.get("/getGameID", function (req, res) {
    let myAuxArr = [];
    dbo
      .collection("games")
      .find()
      .project({ _id: 0, id: 1 })
      .toArray(function (err, result) {
        console.log(result);
        result.forEach((id) => {
          myAuxArr.push(id.id);
        });
        console.log(myAuxArr);
        var max = Math.max(...myAuxArr);
        console.log(max++);
        res.send(String(max));
      });
  });

  app.get("/draw", function (req, res) {
    let params = processParams(req);
    let fiveCards = [];
    console.log("params = ", params.id);
    let myId = params.id;
    let numId = parseInt(myId, 10);
    dbo
      .collection("DECK")
      .find()
      .toArray(function (err, result) {
        for (let index = 0; index < 5; index++) {
          let indice = Math.floor(Math.random() * 50);
          const element = result[indice];
          fiveCards.push(element);
        }
        console.log(fiveCards);
        // let cards = {
        //   cards: ...fiveCards,
        // };
        let myquery = { id: numId };
        let newvalues = { $push: { cards: { $each: fiveCards } } };
        dbo
          .collection("games")
          .updateOne(myquery, newvalues, function (err, result) {
            if (err) throw err;
            console.log("update");
            res.send(result);
          });
      });
  });

  app.put("/put/:id", function (req, res) {
    let params = processParams(req);
    params = params.params;
    console.log(params);
    let myname = params.name;
    let mydata = params.data; //el parseo de la data será desde front, data contiene todo
    var myquery = { name: myname };
    var newvalues = { $set: { data: mydata } };
    console.log(mydata, myname);
    dbo.collection("DECK").updateOne(myquery, newvalues, function (err, res) {
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
