                                                            /******************* PAGE CONFIRMATION ********************/

function getId(){

    //Récupération de orderId dans l'Url
    let productUrl = location.href;
    let url = new URL(productUrl);
    let orderIdUrl = url.searchParams.get("orderId");
    return orderIdUrl;
}

//Affichage de l'orderId en html
let orderId = document.querySelector("#orderId");
orderId.innerHTML = getId();