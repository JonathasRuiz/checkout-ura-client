var HandlebarLoader = require("./services/handlebar-loader");

var CreditCardList = require("./controllers/credit-card-list");
var AddCreditCard = require("./controllers/credit-card-form");
var Installment = require("./controllers/installments");
var Confirm = require("./controllers/confirm");

$(document).ready(() => {
  let loader = new HandlebarLoader();
  loader.loadTemplate("checkout")
    .into("#checkout-token-portlet")
    .then(() => {
      // step 1:
      new CreditCardList().load();
      // step 2:
      new Installment().load();
      // step 3:
      new Confirm().load();
    });
});
