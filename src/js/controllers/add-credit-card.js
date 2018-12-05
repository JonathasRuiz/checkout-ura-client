var $ = require("jquery");

var SmilesServer = require("../services/smiles-server");
var HandlebarLoader = require("../services/handlebar-loader");

var CreditCardList = require("./credit-card-list");

module.exports = class AddCreditCard{
  constructor() {};

  load(){
    new HandlebarLoader()
      .loadTemplate("sections/add-credit-card", {})
      .into("#checkout-step-1")
      .then(() => this.loadJQuery());
  };

  resetForm() {
    $('#cardNumber').val('');
    $('#cardHolderName').val('');
    $('.cardCvc').val('');
    $('input[name=member-card]').removeAttr('checked');
    $('input[id^=secure-code-member-card]').val('');
    $('.div-secure-code-member-card').hide();
    $('#member-card-list li').removeClass('selected-one-click-card');
  };

  loadJQuery() {
    $('#back-to-member-card-list').on('click', () => {
      this.resetForm();
      new CreditCardList().load();
    });        
  };

};
