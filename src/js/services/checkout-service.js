var $ = require("jquery");

var SmilesServer = require("./smiles-server");

var CheckoutServiceInstance = null;

module.exports = class Installment {
  constructor() {
    if(CheckoutServiceInstance) return CheckoutServiceInstance;
    this.data = null;
    this.installments = [];
    CheckoutServiceInstance = this;
  };

  load() {
    let server = new SmilesServer();
    return server.getCheckout()
      .then(data => this.processCheckoutData(data.getCheckoutData))
      .then(() => { return this; })
  }

  mapInstallmentOptions(o) {
    o.paycash = o.quantity == 1;
    return o;
  };
  processCheckoutData(d) {
    this.data = d;
    this.processInstallments();
  };
  processInstallments(){
    this.installments = [];
    let i = this.data.creditCardOptionList;
    i.forEach((cc) => {
      this.installments[cc.brand] = cc.installmentOptionList.map(this.mapInstallmentOptions);
    });
  };

  getInstallments() {
    return this.installments;
  };

};
