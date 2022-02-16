                                                            /*********** PAGE INDEX ***********/
//Récupération de la section à modifier
const items = document.querySelector("#items");

//Récupération des données de l'API
fetch ("http://localhost:3000/api/products")
    .then(function(res){
        if (res.ok){
            return res.json();
        }
    })
    .then(function(tab){
        for (let card of tab){
            displayProduct(card);
        };
    })
    //Retour des erreurs dans la console
    .catch(function(err){
        console.log(err);
    }
);

function displayProduct (card){

     //Création des éléments à intégré en html
     const linkProductPage = document.createElement("a");
     const article = document.createElement("article");
     const productImage = document.createElement("img");
     const productName = document.createElement("h3");
     const productDescription = document.createElement("p");

     //Ajout des class sur les éléments créer
     productName.classList.add("productName");
     productDescription.classList.add("productDescription");

     //Intégration dans le DOM des éléments créer
     items.appendChild(linkProductPage);
     linkProductPage.appendChild(article);
     article.appendChild(productImage);
     article.appendChild(productName);
     article.appendChild(productDescription);

     //Intégration du tableau dans le DOM
     linkProductPage.href = `./product.html?id=${card._id}`;
     productImage.src = card.imageUrl;
     productImage.alt = card.altTxt;
     productName.innerHTML = card.name;
     productDescription.innerHTML = card.description;
}