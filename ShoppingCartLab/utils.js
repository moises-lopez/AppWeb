function get_element_li(name, price) {
  return `<li class="added-item" title= "${price}" >name: ${name} price: ${price}  <button class="remove-item">remove</button></li>`;
}

function isValidName(name) {
  if (isNaN(Number(name)) && name != "") {
    return true;
  } else {
    return false;
  }
}

function isValidPrice(price) {
  if (!isNaN(Number(price)) && price != "") {
    return true;
  } else {
    return false;
  }
}

function incorrectValues(item_name, item_price) {
  if (!isValidName(item_name) && isValidPrice(item_price)) {
    document.getElementById("item-name").className = "red";
  } else if (isValidName(item_name) && !isValidPrice(item_price)) {
    document.getElementById("item-value").className = "red";
  } else {
    document.getElementById("item-name").className = "red";
    document.getElementById("item-value").className = "red";
  }
}

function correctValues() {
  document.getElementById("item-value").className = "valid";
  document.getElementById("item-name").className = "valid";
}

function updateTotal(value) {
  document.getElementById("total").innerHTML =
    Number(document.getElementById("total").innerHTML) + Number(value);
}

function updateListeners() {
  let allButtons = document.getElementsByClassName("remove-item");
  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", remove_item);
  }
}

document.addEventListener("DOMContentLoaded", (_) => {
  let item_creator = (template_creator) => {
    return (event) => {
      correctValues();
      let item_name = document.querySelector("#item-name").value;
      let item_price = document.querySelector("#item-value").value;
      if (isValidName(item_name) && isValidPrice(item_price)) {
        let template = template_creator(item_name, item_price);
        document.getElementById("items").innerHTML += template;
        correctValues();
        updateTotal(item_price);
        updateListeners();
      } else {
        incorrectValues(item_name, item_price);
        console.log("incorrect");
      }
    };
  };
  let event_handler = item_creator(get_element_li);
  document.getElementById("add-item").addEventListener("click", event_handler);
  // use here what you have in utils.js
});

/*
 for removing elements could be this way
  let element_to_delete = document.querySelector("selector").lastElementChild;
  element_to_delete.parentNode.removeChild(element_to_delete);
  or we could use ChildNode.remove()
  https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
*/

let remove_item = (event) => {
  let total = document.getElementById("total").innerHTML;
  let element = event.target.parentElement;
  let price = element.title;
  console.log(total, price);
  document.getElementById("total").innerHTML = total - price;
  element.remove();
};
