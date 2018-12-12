var $ = require("jquery");

var SmilesServer = require("../services/smiles-server");
var HandlebarLoader = require("../services/handlebar-loader");

//var Installments = require("./installments.js");

var CreditCardListInstance = null;
module.exports = class CreditCardList {
  constructor() {
    if(CreditCardListInstance) return CreditCardListInstance;
    this.creditCardList = [];
    this.hb = null;
    CreditCardListInstance = this;
  };

  load() {
    if(this.creditCardList.lenght > 0) this.loadTemplate();
    else this.reload();
  };

  processCreditCard(cc) {
    return {
      id: cc.id,
      brand: cc.brand.toLowerCase(),
      last4: String(cc.number).substr(-4),
      active: (cc.main == true)
    };
  };
  refreshCreditCards() {
    let server = new SmilesServer();
    return server.getUserInfo()
      .then((data) => {
        this.creditCardList = data.savedCreditCards.map(this.processCreditCard);
      });
  };
  reload() {
    this.refreshCreditCards().then(() => this.loadTemplate());
  };

  loadTemplate() {
    if(this.hb == null) {
      this.hb = new HandlebarLoader()
        .loadTemplate("sections/credit-card-list", { cards: this.creditCardList });
    }
    this.hb.into("#checkout-step-1")
      .then(() => this.loadJQuery());
  };

  selectCard(brand) {
    console.info("selected: ", brand);
//    new Installments().selectBrand(brand);
  };

  loadJQuery() {
    $('input[name=member-card]').on('click', (evt) => {
      let elem = "#" + evt.target.id;
      let index = $(elem).data('index');
      let brand = $(elem).data('brand');
      $('.div-secure-code-member-card').hide();
      $('#member-card-list li').removeClass('selected-one-click-card');
      $(elem).closest('li').addClass('selected-one-click-card');
      $('input[id^=secure-code-member-card]').val('');
      if($(elem).is(':checked')){
        $('#div-secure-code-member-card-' + index).show();
      }
      $(elem).closest('li').addClass('selected-one-click-card');
      this.selectCard(brand);
    });

    $("#other-credit-card").on('click', () => {
      var AddCreditCard = require("./credit-card-form");
      new AddCreditCard().load()
    });
  };

};
