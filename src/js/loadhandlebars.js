var $ = require("jquery");

var HandlebarLoader = require("./services/handlebar-loader");

var AddCreditCard = require("./controllers/add-credit-card");
var CreditCardList = require("./controllers/credit-card-list");
var Installment = require("./controllers/installments");

$(document).ready(() => {

  let loader = new HandlebarLoader();
  loader.loadTemplate("checkout")
    .into("#checkout-token-portlet")
    .then(() => {
      // step 1:
//      new CreditCardList().load();
      new AddCreditCard().load();

      // step 2:
      new Installment().load();
    });

});
