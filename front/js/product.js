                                                            /*********** PAGE PRODUCT ***********/

function getId(){
  //Récupération de l'id dans l'Url
  let productUrl = location.href;
  let url = new URL(productUrl);
  let idUrl = url.searchParams.get("id");
  return idUrl;
}

//Récupération des sections à modifier
let headTitle = document.querySelector("title");
let itemImg = document.querySelector(".item__img");
let title = document.querySelector("#title");
let price = document.querySelector("#price");
let description = document.querySelector("#description");
let colors = document.querySelector("#colors");
let quantity = document.querySelector("#quantity");

//Création de l'élément à intégré en html
const productImage = document.createElement("img");

//Intégration dans le DOM de l'élément créer
itemImg.appendChild(productImage);

//Récupération des données de l'API
fetch (`http://localhost:3000/api/products/${getId()}`)
  .then(function(res){
    if (res.ok){
      return res.json();
    }
  })
  .then(function(card){
    displayProduct(card);
    headTitle.innerHTML = card.name;
  })
  //Retour des erreurs dans la console
  .catch(function(err){
    console.log(err);
    return;
  }
);

function displayProduct (card){

  //Intégration du tableau dans le DOM
  productImage.src = card.imageUrl;
  productImage.alt = card.altTxt;
  title.innerHTML = card.name;
  description.innerHTML = card.description;
  price.innerHTML = card.price;

  //Boucle pour incorporer les couleurs dans les options 
  for (let options of card.colors){
    let select = document.createElement("option");
    colors.appendChild(select);
    select.value = options;
    select.innerHTML = options; 
  };
}

//Ajout d'une fonction de confirmation d'envoi au panier
function validPanier (){
    if (confirm(`${quantity.value} article(s) ajouté(s) au panier. Cliquez sur ok pour accédés au panier.`)){
      location.href = "cart.html";  
    }
}

function bouton(){

  //Récupération des éléments
  let panierStorage = localStorage.getItem("panier"); 
  let colors = document.querySelector("#colors");
  let quantity = document.querySelector("#quantity"); 

  //Ajout d'une condition d'envoi pour la couleur
  if (colors.value == ""){
    alert("Veuillez séléctionner une couleur");
    return;
  }

  //Ajout d'une condition d'envoi pour la quantité
  if (quantity.value < 1 || quantity.value > 100){
    alert("Veuillez séléctionner une quantité comprise entre 1 et 100");
    return;
  }

  //Création du tableau à transmettre au panier
  let productPanier = [];

  //Ajout de condition si le panier est plein
  if(panierStorage){
    productPanier = JSON.parse(panierStorage);
    let existProduct = false;

    //Récupération des éléments du panier
    for (let recupPanier of productPanier){
      recupId = recupPanier.productId,
      recupQuantity = parseInt(recupPanier.productQuantity),
      recupColors = recupPanier.productColors

      //Ajout d'une condition si l'id et la couleur à ajouter sont identiques à ceux du panier
      if (recupId == getId() && recupColors == colors.value){
        const index = productPanier.indexOf(recupPanier);
        productPanier[index].productQuantity += parseInt(quantity.value);
        existProduct = true;
      }
    }

    //Ajout d'une condition si le panier est plein sans éléments identiques
    if(!existProduct){
      productPanier.push({
        productId : getId(),
        productQuantity : parseInt(quantity.value),
        productColors : colors.value
      })
    }

  //Ajout d'une condition si le panier est vide 
  }else{
    productPanier.push({
      productId : getId(),
      productQuantity : parseInt(quantity.value),
      productColors : colors.value
    })
  }

  //Envoi au panier
  panierStorage = JSON.stringify(productPanier);
  localStorage.setItem("panier", panierStorage);
  validPanier();
}

//Ajout d'un évènement click sur le boutton
document.querySelector("#addToCart").addEventListener("click", function(){
  bouton();
});

//////////////////////////////////////////////////////////////////////////////////Code pour assurer la cohérence entre les navigateurs du local storage (source MDN)////////////////////////////////////////////////////////

if (!window.localStorage) {
    Object.defineProperty(window, "localStorage", new (function () {
      var aKeys = [], oStorage = {};
      Object.defineProperty(oStorage, "getItem", {
        value: function (sKey) { return sKey ? this[sKey] : null; },
        writable: false,
        configurable: false,
        enumerable: false
      });
      Object.defineProperty(oStorage, "key", {
        value: function (nKeyId) { return aKeys[nKeyId]; },
        writable: false,
        configurable: false,
        enumerable: false
      });
      Object.defineProperty(oStorage, "setItem", {
        value: function (sKey, sValue) {
          if(!sKey) { return; }
          document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
        },
        writable: false,
        configurable: false,
        enumerable: false
      });
      Object.defineProperty(oStorage, "length", {
        get: function () { return aKeys.length; },
        configurable: false,
        enumerable: false
      });
      Object.defineProperty(oStorage, "removeItem", {
        value: function (sKey) {
          if(!sKey) { return; }
          document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        },
        writable: false,
        configurable: false,
        enumerable: false
      });
      this.get = function () {
        var iThisIndx;
        for (var sKey in oStorage) {
          iThisIndx = aKeys.indexOf(sKey);
          if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
          else { aKeys.splice(iThisIndx, 1); }
          delete oStorage[sKey];
        }
        for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
        for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
          aCouple = aCouples[nIdx].split(/\s*=\s*/);
          if (aCouple.length > 1) {
            oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
            aKeys.push(iKey);
          }
        }
        return oStorage;
      };
      this.configurable = false;
      this.enumerable = true;
    })());
}