var $ = require("jquery");

var HandlebarLoader = require("../services/handlebar-loader");
var CheckoutService = require("../services/checkout-service");

var InstallmentInstance = null;
module.exports = class Installments {
  constructor() {
    if(InstallmentInstance) return InstallmentInstance;
    this.hb = null;
    this.handlebarLoader = new HandlebarLoader();
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
      this.hb = this.handlebarLoader
        .loadTemplate("sections/installments", {});
    }
    this.hb.into("#checkout-step-2");
    this.loadInstallments();
  };
  loadInstallmentsSelect() {
    this.handlebarLoader
      .loadTemplate("sections/installments-select", { options:this.installmentsOptions })
      .into("#installmentSelectDiv")
      .then(() => this.jQuerySelect());
  };
  loadInstallmentsTooltip() {
    this.handlebarLoader
      .loadTemplate("sections/installments-tooltip", { options:this.installmentsOptions })
      .into("#entendaParc");
  };

  jQuerySelect() {
    $("#installmentSelect").on("change", (evt) => {
      let value = evt.target.value;
      console.info("selected: ", this.installmentsOptions[value]);
    });
  };

  selectBrand(b) {
    let brand = String(b).toUpperCase();
    this.installmentsOptions = this.creditCardList[brand];
    this.loadInstallmentsSelect();
    console.info(this.installmentsOptions);
  };

};
