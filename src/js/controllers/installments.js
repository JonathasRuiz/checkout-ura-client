var $ = require("jquery");

var HandlebarLoader = require("../services/handlebar-loader");
var CheckoutService = require("../services/checkout-service");

var InstallmentInstance = null;
module.exports = class Installments {
  constructor() {
    if(InstallmentInstance) return InstallmentInstance;
    this.hb = null;
    this.creditCardList = [];
    this.installmentsOptions = {};
    InstallmentInstance = this;
  };

  loadInstallments() {
    new CheckoutService()
      .load()
      .then((service) => {
        this.creditCardList = service.getInstallments();
      });
  };

  load(){
    if(this.hb == null) {
      this.hb = new HandlebarLoader()
        .loadTemplate("sections/installments", {});
    }
    this.hb.into("#checkout-step-2")
      .then(() => this.loadJQuery());
    this.loadInstallments();
  };

  loadJQuery() {
  };

  selectBrand(b) {
    let brand = String(b).toUpperCase();
    this.installmentsOptions = this.creditCardList[brand];
  };

};
