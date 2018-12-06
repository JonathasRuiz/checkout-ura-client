var $ = require("jquery");
var CreditCardType = require('credit-card-type');

var FormService = require("../services/form-service.js");
var HandlebarLoader = require("../services/handlebar-loader");
var SmilesServer = require("../services/smiles-server");

var AddCreditCardInstance = null;

module.exports = class AddCreditCard {
  constructor() {
    if(AddCreditCardInstance) return AddCreditCardInstance;
    this.hb = null;
    AddCreditCardInstance = this;
  };

  load(){
    if(this.hb == null) {
      this.hb = new HandlebarLoader()
        .loadTemplate("sections/add-credit-card", {});
    }
    this.hb.into("#checkout-step-1")
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

  checkIsCardSmiles(cardNumber){
    return ( cardNumber.indexOf('542661') === 0 || cardNumber.indexOf('545053') === 0
          || cardNumber.indexOf('514895') === 0 || cardNumber.indexOf('510147') === 0
          || cardNumber.indexOf('512427') === 0 || cardNumber.indexOf('514911') === 0 )
  }

  // input: credit card number (full or partial)
  // output: credit card brand (or false for unknown)
  detectCardType(number) {
    let result = CreditCardType(number);
    if(result.length != 1) return false;
    let cc = result[0];
    let brand = cc.type;
    if(brand == "mastercard") {
      brand = this.checkIsCardSmiles(number) ? "mastercard_smiles" : brand;
    }
    return brand;
  }

  loadJQuery() {
    var formService = new FormService();
    formService.setCardNumber('#cardNumber');
    $('#back-to-member-card-list').on('click', () => {
      this.resetForm();
      var CreditCardList = require("./credit-card-list");
      new CreditCardList().load();
    });
    $('#cardNumber').on('keyup', (evt) => {
      let elem = "#" + evt.target.id;
      let val = $(elem).val();
      let brand = this.detectCardType(val);
      $('#smls-card-icon').attr('class', 'cards');
      if( brand !== false ) {
        $('#smls-card-icon').addClass(brand);
      }
    });
  };

};
