var $ = require("jquery");

var HandlebarLoader = require("./services/handlebar-loader");
var AddCreditCard = require("./controllers/add-credit-card");
var CreditCardList = require("./controllers/credit-card-list");

$(document).ready(() => {

  let loader = new HandlebarLoader();
  loader.loadTemplate("checkout")
    .into("#checkout-token-portlet")
    .then(() => {
//      new CreditCardList().load();
      new AddCreditCard().load();
    });

});
