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
    return new CheckoutService()
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
    return this.loadInstallments();
  };
  loadInstallmentsSelect() {
    return this.handlebarLoader
      .loadTemplate("sections/installments-select", { options: this.installmentsOptions })
      .into("#installmentSelectDiv")
        .then(() => this.jQuerySelect())
        .then(() => this.selectInstallmentOption(0));
  };
  loadInstallmentsDescription(options) {
    return this.handlebarLoader
      .loadTemplate("sections/installments-description", { data: options })
      .into("#installmentDescriptionDiv");
  };
  loadInstallmentsTooltip(options) {
    this.handlebarLoader
      .loadTemplate("sections/installments-tooltip", { data: options })
      .into("#installmentTooltipDiv")
      .then(() => this.jQueryTooltip());
  };

  selectInstallmentOption(key) {
    let options = this.installmentsOptions[key];
    console.info("selected: ", options);
    this.loadInstallmentsDescription(options);
    this.loadInstallmentsTooltip(options);
  };

  jQuerySelect() {
    $("#installmentSelect").on("change", (evt) => {
      let value = evt.target.value;
      this.selectInstallmentOption(value);
    });
  };
  jQueryTooltip() {
    $("#entendaParc").on("click", () => {
      $(".understand-installments").toggle();
    });
  };

  selectBrand(b) {
    let brand = String(b).toUpperCase();
    this.installmentsOptions = this.creditCardList[brand];
    this.loadInstallmentsSelect();
  };

};
