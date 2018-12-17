var $ = require("jquery");

var HandlebarLoader = require("../services/handlebar-loader");

var ConfirmInstance = null;
module.exports = class Confirm {
  constructor() {
    if(ConfirmInstance) return ConfirmInstance;
    this.hb = null;
    this.handlebarLoader = new HandlebarLoader();
    ConfirmInstance = this;
  };

  load(){
    if(this.hb == null) {
      this.hb = this.handlebarLoader
        .loadTemplate("sections/confirm", {});
    }
    this.hb.into("#checkout-step-3")
      .then(() => this.loadJQuery());
  };
  loadJQuery() {
  };

};
