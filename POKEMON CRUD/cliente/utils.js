document.addEventListener("DOMContentLoaded", (_) => {
  // use here what you have in utils.js
  if (document.getElementById("index").innerHTML == ".") {
    document.getElementById("add-item").addEventListener("click", getPokemon);
    document.getElementById("getAll").addEventListener("click", getAll);
    document.getElementById("getID").addEventListener("click", getID);
    document.getElementById("delete").addEventListener("click", toDelete);
    document.getElementById("update").addEventListener("click", handleUpdate);
  } else if (document.getElementById("index").innerHTML == ",") {
    document.getElementById("play").addEventListener("click", handlePlay);
    document.getElementById("draw").addEventListener("click", handleDraw);
    document.getElementById("upsta").addEventListener("click", updateStatus);
  }
});

let get_element_li = (
  name,
  id,
  weight,
  height,
  base_experience,
  image,
  types
) => {
  return `<div class="added-pokemon pokecard" ><h1>Name: ${name} id: ${id} </h1> <div><img src="${image}"></div> <div>types: ${types}<div>weight: ${weight} height: ${height} <div> base experience: ${base_experience} </div>`;
};

let get_element_li_not_pokemon = (name, type, data) => {
  return `<div class="added-pokemon pokecard"><h1>Name: ${name} Type Card: ${type} </h1> <div> Data: ${data} </div>`;
};

function handlePlay() {
  axios
    .get(`http://localhost:3000/getGameID`)
    .then((response) => {
      let id = response.data;
      localStorage.setItem("GameID", id);
      document.getElementById("status").innerHTML =
        "Connected " + localStorage.getItem("GameID");

      // axios.post("http://localhost:3000/addGame", params : {
      //   id : localStorage.getItem("GameID")
      // }).then((response) => {

      // });
      updateStatus();
      setInterval(updateStatus, 5000);
    })
    .catch((err) => {
      //div.innerHTML = "NO EXISTE";
    });
}

function handleDraw() {
  axios
    .get(`http://localhost:3000/draw`, {
      params: {
        id: 2,
      },
    })
    .then((response) => {
      console.log("HOLA == ", response.data);
      updateStatus();
    })
    .catch((err) => {
      //div.innerHTML = "NO EXISTE";
    });
}

function updateStatus() {
  console.log("update status client");
  axios
    .get(`http://localhost:3000/updateStatus`, {
      params: {
        id: 2,
      },
    })
    .then((response) => {
      console.log(response);
      console.log("HOLA ? ", response.data[0].cards);
      document.getElementById("items").innerHTML = "";
      response.data[0].cards.forEach((element) => {
        if (element.typecard == "pokemon") {
          addPokemon(element);
        } else {
          addCard(element);
        }
      });
      //div.innerHTML = "";
    })
    .catch((err) => {
      //div.innerHTML = "NO EXISTE";
    });
}

function handleUpdate() {
  let name = document.querySelector("#update-pokemon").value;
  let data = document.querySelector("#data-update").value;
  axios
    .put(`http://localhost:3000/put/${name}`, {
      params: {
        name: name,
        data: data,
      },
    })
    .then((response) => {
      console.log(response);
      //div.innerHTML = "";
    })
    .catch((err) => {
      //div.innerHTML = "NO EXISTE";
    });
}

function prueba() {
  console.log("UPDATED");
}
function addPokemon(datos) {
  let myData = datos.data;
  let typeNames = [];
  let arrayTypes = myData.typeNames;
  arrayTypes.forEach((typeData) => {
    typeNames.push(typeData);
  });
  let template = get_element_li(
    myData.name,
    myData.id,
    myData.weight,
    myData.height,
    myData.base_experience,
    myData.sprites.front_default,
    typeNames
  );
  document.getElementById("items").innerHTML += template;
  //document.getElementById("items").innerHTML = datos.name
}

function addCard(datos) {
  console.log(datos);
  let myData = datos;
  let template = get_element_li_not_pokemon(
    myData.name,
    myData.typecard,
    myData.data
  );
  document.getElementById("items").innerHTML += template;
}

function toDelete() {
  let name = document.querySelector("#delete-pokemon").value;
  axios
    .delete(`http://localhost:3000/delete/${name}`)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      //div.innerHTML = "NO EXISTE";
    });
}

function getAll() {
  document.getElementById("items").innerHTML = "";
  axios
    .get(`http://localhost:3000/get`)
    .then((response) => {
      console.log("response", response);
      pokearray = response.data;
      //console.log(pokearray)
      pokearray.forEach((element) => {
        if (element.typecard == "pokemon") {
          addPokemon(element);
        } else {
          addCard(element);
        }
      });
      //div.innerHTML = "";
    })
    .catch((err) => {
      //div.innerHTML = "NO EXISTE";
    });
}

function getID() {
  document.getElementById("items").innerHTML = "";
  let name = document.querySelector("#get-pokemon-name").value;
  axios
    .get(`http://localhost:3000/get/${name}`)
    .then((response) => {
      console.log("response", response);
      pokearray = response.data;
      //console.log(pokearray)
      pokearray.forEach((element) => {
        if (element.typecard == "pokemon") {
          addPokemon(element);
        } else {
          addCard(element);
        }
      });
      //div.innerHTML = "";
    })
    .catch((err) => {
      //div.innerHTML = "NO EXISTE";
    });
}

function getPokemon() {
  let name = document.querySelector("#pokemon-name").value;
  let type = document.querySelector("#type").value;
  let data = document.querySelector("#data").value;
  let errorP = document.getElementById("error");
  axios
    .post(`http://localhost:3000/add`, {
      params: {
        type: type,
        name: name,
        data: data,
      },
    })
    .then((response) => {
      //refreshDeck();
      console.log(response);
      errorP.innerHTML = "";
    })
    .catch((err) => {
      errorP.innerHTML = "NO EXISTE";
    });
}
