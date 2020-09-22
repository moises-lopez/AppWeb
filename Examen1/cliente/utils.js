document.addEventListener("DOMContentLoaded", (_) => {
  // use here what you have in utils.js
  document.getElementById("add-item").addEventListener("click", getPokemon);
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
// are id, weight, all the types, height, base_experience

function addPokemon(datos) {
  let typeNames = [];
  datos.types.forEach((typeData) => {
    typeNames.push(typeData.type.name);
  });
  let template = get_element_li(
    datos.name,
    datos.id,
    datos.weight,
    datos.height,
    datos.base_experience,
    datos.sprites.front_default,
    typeNames
  );

  document.getElementById("items").innerHTML += template;
}

function getPokemon() {
  let name = document.querySelector("#pokemon-name").value;
  let errorP = document.getElementById("error");
  axios
    .get("http://localhost:3000/" + name)
    .then((response) => {
      addPokemon(response.data);
      errorP.innerHTML = "";
    })
    .catch((err) => {
      errorP.innerHTML = "NO EXISTE";
    });
}
