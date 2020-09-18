/*this is one template function that can be passed to add_item_to_list_with_template 
  and add the remove event of the button
  or you can create another template function wich create a dom element like 
  Document.createElement() and add the event to that element
  https://developer.mozilla.org/es/docs/Web/API/Document/createElement 
*/

document.addEventListener("DOMContentLoaded", (_) => {
  // use here what you have in utils.js
  document
    .getElementById("add-item")
    .addEventListener("click", get_pokemon_data);
});

let get_element_li = (name, weight, image) => {
  return `<li class="added-pokemon" title= "${weight}" >name: ${name} <div class="weight">weight: ${weight} <div class="image"><img src="${image}"></div> <button class="remove-pokemon">remove</button></li>`;
};

function updateTotal(value) {
  document.getElementById("total").innerHTML =
    Number(document.getElementById("total").innerHTML) + Number(value);
}

function updateListeners() {
  let allButtons = document.getElementsByClassName("remove-pokemon");
  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", remove_item);
  }
}

let remove_item = (event) => {
  let total = document.getElementById("total").innerHTML;
  let element = event.target.parentElement.parentElement;
  let weight = element.title;
  document.getElementById("total").innerHTML = total - weight;
  element.remove();
};

let addPokemonToList = (response) => {
  let template = get_element_li(
    response.name,
    response.weight,
    response.sprites.front_default
  );
  document.getElementById("items").innerHTML += template;
  document.getElementById("error").innerHTML = "";
  updateTotal(response.weight);
  updateListeners();
};

let handleNoExists = (name) => {
  document.getElementById("error").innerHTML =
    "POKEMON: " + name + " no existe";
};

let get_pokemon_data = () => {
  let miPrimeraPromise = new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();
    let name = document.querySelector("#pokemon-name").value;
    req.open("GET", `https://pokeapi.co/api/v2/pokemon/${name}`);

    req.onload = function () {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      } else if (req.status == 404) {
        handleNoExists(name);
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function () {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });

  miPrimeraPromise.then((response) => {
    // succesMessage es lo que sea que pasamos en la función resolve(...) de arriba.
    // No tiene por qué ser un string, pero si solo es un mensaje de éxito, probablemente lo sea.
    response = JSON.parse(response);
    addPokemonToList(response);
  });
};
