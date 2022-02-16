                                                            /*********** PAGE CART **********/

                                                            /***********Partie panier***********/

//Récupération du panier
let panierStorage = localStorage.getItem("panier");

//Ajout d'un condition si le panier est vide
if (!panierStorage){
    alert("Le panier est vide! Veuillez séléctionner un article.");
    location.href = "index.html";
}

//Récupération des éléments du panier
let productPanier = JSON.parse(panierStorage);
for (let recupPanier of productPanier){
    let recupId = recupPanier.productId;
    let productStorage = recupPanier;

//Récupération des données de l'API
fetch (`http://localhost:3000/api/products/${recupId}`)
    .then(function(res){
        if (res.ok){
            return res.json();
        }
    })
    .then(function(card){
            displayProduct(card, productStorage);
            total(card.price);
    })
    //Retour des erreurs dans la console
    .catch(function(err){
        console.log(err);
    });
}
function displayProduct(card, productStorage){

    let recupId = productStorage.productId;
    let recupQuantity = productStorage.productQuantity;
    let recupColors = productStorage.productColors;         

    //Création des éléments à inséré dans le DOM
    let section = document.querySelector("#cart__items");
    let article = document.createElement("article");
    let divImg = document.createElement("div");
    let img = document.createElement("img");
    let divCart = document.createElement("div");
    let divDescription = document.createElement("div");
    let title = document.createElement("h2");
    let colors = document.createElement("p");
    let price = document.createElement("p");
    let divSettings = document.createElement("div");
    let divSettingsQuantity = document.createElement("div");
    let quantity = document.createElement("p");
    let input = document.createElement("input");
    let divSettingsDelete = document.createElement("div");
    let supprimer = document.createElement("p");

    //Placement des éléments créer dans le DOM
    section.appendChild(article);
    article.appendChild(divImg);
    divImg.appendChild(img);
    article.appendChild(divCart);
    divCart.appendChild(divDescription);
    divDescription.appendChild(title);
    divDescription.appendChild(colors);
    divDescription.appendChild(price);
    divCart.appendChild(divSettings);
    divSettings.appendChild(divSettingsQuantity);
    divSettingsQuantity.appendChild(quantity);
    divSettingsQuantity.appendChild(input);
    divSettings.appendChild(divSettingsDelete);
    divSettingsDelete.appendChild(supprimer);

    //Attribution des class sur les éléments créer
    article.classList.add("cart__item");
    divImg.classList.add("cart__item__img");
    divCart.classList.add("cart__item__content");
    divDescription.classList.add("cart__item__content__description");
    divSettings.classList.add("cart__item__content__settings");
    divSettingsQuantity.classList.add("cart__item__content__settings__quantity");
    input.classList.add("itemQuantity");
    divSettingsDelete.classList.add("cart__item__content__settings__delete");
    supprimer.classList.add("deleteItem");

    //Création des attribut sur les éléments créer
    article.setAttribute("data-id", recupId);
    article.setAttribute("data-color", recupColors);
    input.setAttribute("type", "number");
    input.setAttribute("name", "itemQuantity");
    input.setAttribute("min", "1");
    input.setAttribute("max", "100");
    input.setAttribute("value", recupQuantity);

    //Intégration des éléments écrits dans le DOM
    img.src = card.imageUrl;
    img.alt = card.altTxt;
    title.innerHTML = card.name;
    colors.innerHTML = recupColors;
    price.innerHTML = `${card.price} €`;
    quantity.innerHTML = `Qté ${recupColors} : `;
    supprimer.innerHTML = "Supprimer";

    //Application du changement de la quantité
    input.addEventListener("change", function (e){
        e.preventDefault();
        newQuantity = parseInt(this.value);
        modifQuantity(newQuantity, productStorage);
    })

    //Application de la supression de la carte
    supprimer.addEventListener("click", function(e){
        e.preventDefault();
        deleteCart(productStorage);
    });         
}

function modifQuantity (newQuantity, productStorage){
    
    let productPanier = JSON.parse(localStorage.getItem("panier"));
    
    //Récupération du panier
    for (let recupPanier of productPanier){
        let recupId = recupPanier.productId;
        let recupColors = recupPanier.productColors;
 
        //Ajout d'une condition si l'id et la couleur sont identiques à ceux du panier
        if (recupId == productStorage.productId && recupColors == productStorage.productColors && newQuantity >= 1 && newQuantity <= 100){
            const index = productPanier.indexOf(recupPanier);
            productPanier[index].productQuantity = parseInt(newQuantity);
        }
    }
    //Envoi des donées et rafraichis la page
    panierStorage = JSON.stringify(productPanier);
    localStorage.setItem("panier", panierStorage);
    location.reload();
}

function deleteCart (productStorage){

    let productPanier = JSON.parse(localStorage.getItem("panier"));

    for (let recupPanier of productPanier){
        let recupId = recupPanier.productId;
        let recupColors = recupPanier.productColors;
 
        //Ajout d'une condition si l'id et la couleur sont identiques à ceux du panier
        if (recupId == productStorage.productId && recupColors == productStorage.productColors){
            const index = productPanier.indexOf(recupPanier);
            productPanier.splice(index, 1);
        }
    }

    if (productPanier.length == 0){
        localStorage.removeItem("panier");
    }else{
        localStorage.setItem("panier", JSON.stringify(productPanier));
    }

    location.reload();
}

function total (cardPrice){

    //Calcul du total des quantités
    let itemQuantity = document.querySelectorAll(".itemQuantity");
    let selectQuantity = itemQuantity.length;
    let totalQtt = 0;

    for (let qtt = 0; qtt < selectQuantity; qtt++){
        totalQtt += itemQuantity[qtt].valueAsNumber;
    };

    let totalQuantity = document.querySelector("#totalQuantity");
    totalQuantity.innerHTML = totalQtt;

    //Calcul du prix total
    let valuePrice = document.querySelectorAll(".cart__item__content__description");
    let selectPrice = valuePrice.length;
    price = 0;

    for (let p = 0; p < selectPrice; ++p) {
        price += (itemQuantity[p].valueAsNumber * cardPrice);
    }

    let totalPrice = document.querySelector("#totalPrice");
    totalPrice.innerHTML = price;
}

                                                            /***********Partie formulaire***********/

//Séléction des éléments du DOM
let firstName = document.querySelector("#firstName");
let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
let lastName = document.querySelector("#lastName");
let lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
let address = document.querySelector("#address");
let addressErrorMsg = document.querySelector("#addressErrorMsg");
let city = document.querySelector("#city");
let cityErrorMsg = document.querySelector("#cityErrorMsg");
let email = document.querySelector("#email");
let emailErrorMsg = document.querySelector("#emailErrorMsg");

//Ecouter les modifications pour les validations
firstName.addEventListener("change", function(){
    validFirstName(this);
});
lastName.addEventListener("change", function(){
    validLastName(this);
});
address.addEventListener("change", function(){
    validAddress(this);
});
city.addEventListener("change", function(){
    validCity(this);
});
email.addEventListener("change", function(){
    validEmail(this);
});

//Création de l'expression régulière qui va vérifier dans le prénom si les caractères nommé s'y trouve
let validFirstName = function(firstNameFunction){
    let RegExpForFirstName = new RegExp("^[a-zA-Zà-ÿ -]{2,15}$", "g");

    //Réponse au test du prénom et affichage du message 
    if (RegExpForFirstName.test(firstNameFunction.value)){
        firstNameErrorMsg.innerHTML = "Prénom valide.";
        firstNameErrorMsg.style.color = "lime";
        firstNameErrorMsg.classList.remove("text-danger");
        firstNameErrorMsg.classList.add("text-sucess");
        return true;
    }else{
        firstNameErrorMsg.innerHTML = "Prénom invalide, les seuls caractères acceptés sont : les seuls caractères acceptés sont : a-z, A-Z et entre 2 et 15 lettres maximum.";
        firstNameErrorMsg.style.color = "red";
        firstNameErrorMsg.classList.remove("text-sucess");
        firstNameErrorMsg.classList.add("text-danger");
        return false;
    }
};

//Création de l'expression régulière qui va vérifier dans le nom si les caractères nommé s'y trouve
let validLastName = function(lastNameFunction){
    let RegExpForLastName = new RegExp("^[a-zA-Zà-ÿ -]{2,15}$", "g");

    //Réponse au test du prénom et affichage du message 
    if (RegExpForLastName.test(lastNameFunction.value)){
        lastNameErrorMsg.innerHTML = "Nom valide.";
        lastNameErrorMsg.style.color = "lime";
        lastNameErrorMsg.classList.remove("text-danger");
        lastNameErrorMsg.classList.add("text-sucess");
        return true;
    }else{
        lastNameErrorMsg.innerHTML = "Nom invalide, les seuls caractères acceptés sont : les seuls caractères acceptés sont : a-z, A-Z et entre 2 et 15 lettres maximum.";
        lastNameErrorMsg.style.color = "red";
        lastNameErrorMsg.classList.remove("text-sucess");
        lastNameErrorMsg.classList.add("text-danger");
        return false;
    }
};

//Création de l'expression régulière qui va vérifier dans l'adresse si les caractères nommé s'y trouve
let validAddress = function(addressFunction){
    let RegExpForAddress = new RegExp("^[0-9a-zA-Zà-ÿ -]+$", "g");

    //Réponse au test de l'adresse et affichage du message 
    if (RegExpForAddress.test(addressFunction.value)){
        addressErrorMsg.innerHTML = "Adresse valide.";
        addressErrorMsg.style.color = "lime";
        addressErrorMsg.classList.remove("text-danger");
        addressErrorMsg.classList.add("text-sucess");
        return true;
    }else{
        addressErrorMsg.innerHTML = "Adresse invalide, les seuls caractères acceptés sont : 0-9, a-z, A-Z.";
        addressErrorMsg.style.color = "red";
        addressErrorMsg.classList.remove("text-sucess");
        addressErrorMsg.classList.add("text-danger");
        return false;
    }
};

//Création de l'expression régulière qui va vérifier dans la ville si les caractères nommé s'y trouve
let validCity = function(cityFunction){
    let RegExpForCity = new RegExp("^[0-9a-zA-Zà-ÿ -]+$", "g");

    //Réponse au test de la ville et affichage du message 
    if (RegExpForCity.test(cityFunction.value)){
        cityErrorMsg.innerHTML = "Ville valide.";
        cityErrorMsg.style.color = "lime";
        cityErrorMsg.classList.remove("text-danger");
        cityErrorMsg.classList.add("text-sucess");
        return true;
    }else{
        cityErrorMsg.innerHTML = "Ville invalide, les seuls caractères acceptés sont : 0-9, a-z, A-Z.";
        cityErrorMsg.style.color = "red";
        cityErrorMsg.classList.remove("text-sucess");
        cityErrorMsg.classList.add("text-danger");
        return false;
    }
};

//Création de l'expression régulière qui va vérifier dans l'email si les caractères nommé s'y trouve
let validEmail = function(emailFunction){
    let RegExpForEmail = new RegExp ("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g");

    //Réponse au test d'email et affichage du message 
    if (RegExpForEmail.test(emailFunction.value)){
        emailErrorMsg.innerHTML = "Adresse email valide.";
        emailErrorMsg.style.color = "lime";
        emailErrorMsg.classList.remove("text-danger");
        emailErrorMsg.classList.add("text-sucess");
        return true;
    }else{
        emailErrorMsg.innerHTML = "Adresse email invalide, le seul format valide est : exemple@kanap.com";
        emailErrorMsg.style.color = "red";
        emailErrorMsg.classList.remove("text-sucess");
        emailErrorMsg.classList.add("text-danger");
        return false;
    }
};

//Création d'un évènement click
let order = document.querySelector("#order");
order.addEventListener("click", function send (e){

    //Récupérer les éléments du formulaire pour créer l'objet contact
    let contact = {
        firstName : document.querySelector("#firstName").value,
        lastName : document.querySelector("#lastName").value,
        address : document.querySelector("#address").value,
        city : document.querySelector("#city").value,
        email : document.querySelector("#email").value
    };

    if (validFirstName(firstName) && validLastName(lastName) && validAddress(address) && validCity(city) && validEmail(email)){

        //Récupération des products id dans un array de string
        let productPanier = JSON.parse(panierStorage);
        let products = [];
        productPanier.forEach(function (order){
            products.push(order.productId);
        });

        //Récupération des éléments à envoyer
        let pageOrder = {contact, products};

        //Envoi le tout à l'api
        e.preventDefault();
        fetch("http://localhost:3000/api/products/order", {
            method: "post",
            headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify(pageOrder)
        })
        .then(function(res){
            if (res.ok){
                return res.json();
            }
        })
        .then(function(value){
            location.href = `./confirmation.html?orderId=${value.orderId}`;
            localStorage.removeItem("panier");
        })
        //Retour des erreurs dans la console
        .catch(function(error){
            console.log(error);
        });
    }else{
        alert("Veuillez entrez toutes les informations dans le formulaire svp")
    }
})