(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

var SmilesServer = require("../services/smiles-server");
var HandlebarLoader = require("../services/handlebar-loader");

//var Installments = require("./installments.js");

var CreditCardListInstance = null;
module.exports = function () {
  function CreditCardList() {
    _classCallCheck(this, CreditCardList);

    if (CreditCardListInstance) return CreditCardListInstance;
    this.creditCardList = [];
    this.hb = null;
    CreditCardListInstance = this;
  }

  _createClass(CreditCardList, [{
    key: "load",
    value: function load() {
      if (this.creditCardList.lenght > 0) this.loadTemplate();else this.reload();
    }
  }, {
    key: "processCreditCard",
    value: function processCreditCard(cc) {
      return {
        id: cc.id,
        brand: cc.brand.toLowerCase(),
        last4: String(cc.number).substr(-4),
        active: cc.main == true
      };
    }
  }, {
    key: "refreshCreditCards",
    value: function refreshCreditCards() {
      var _this = this;

      var server = new SmilesServer();
      return server.getUserInfo().then(function (data) {
        _this.creditCardList = data.savedCreditCards.map(_this.processCreditCard);
      });
    }
  }, {
    key: "reload",
    value: function reload() {
      var _this2 = this;

      this.refreshCreditCards().then(function () {
        return _this2.loadTemplate();
      });
    }
  }, {
    key: "loadTemplate",
    value: function loadTemplate() {
      var _this3 = this;

      if (this.hb == null) {
        this.hb = new HandlebarLoader().loadTemplate("sections/credit-card-list", { cards: this.creditCardList });
      }
      this.hb.into("#checkout-step-1").then(function () {
        return _this3.loadJQuery();
      });
    }
  }, {
    key: "selectCard",
    value: function selectCard(brand) {
      console.info("selected: ", brand);
      //    new Installments().selectBrand(brand);
    }
  }, {
    key: "loadJQuery",
    value: function loadJQuery() {
      var _this4 = this;

      $('input[name=member-card]').on('click', function (evt) {
        var elem = "#" + evt.target.id;
        var index = $(elem).data('index');
        var brand = $(elem).data('brand');
        $('.div-secure-code-member-card').hide();
        $('#member-card-list li').removeClass('selected-one-click-card');
        $(elem).closest('li').addClass('selected-one-click-card');
        $('input[id^=secure-code-member-card]').val('');
        if ($(elem).is(':checked')) {
          $('#div-secure-code-member-card-' + index).show();
        }
        $(elem).closest('li').addClass('selected-one-click-card');
        _this4.selectCard(brand);
      });

      $("#other-credit-card").on('click', function () {
        //      var AddCreditCard = require("./add-credit-card");
        //      new AddCreditCard().load()
      });
    }
  }]);

  return CreditCardList;
}();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../services/handlebar-loader":4,"../services/smiles-server":5}],2:[function(require,module,exports){
"use strict";

var HandlebarLoader = require("./services/handlebar-loader");

var CreditCardList = require("./controllers/credit-card-list");
/*
var AddCreditCard = require("./controllers/add-credit-card");
var Installment = require("./controllers/installments");
*/

$(document).ready(function () {
  var loader = new HandlebarLoader();
  loader.loadTemplate("checkout").into("#checkout-token-portlet").then(function () {
    // step 1:
    new CreditCardList().load();
    // step 2:
    //      new Installment().load();
  });
});

},{"./controllers/credit-card-list":1,"./services/handlebar-loader":4}],3:[function(require,module,exports){
"use strict";

require("./load.js");

},{"./load.js":2}],4:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var Handlebars = (typeof window !== "undefined" ? window['window'] : typeof global !== "undefined" ? global['window'] : null).Handlebars;

var hbTemplate = function () {
  function hbTemplate(tname, data) {
    _classCallCheck(this, hbTemplate);

    this.name = tname;
    this.data = data;
    this.promise = null;
    this.html = null;
  }

  _createClass(hbTemplate, [{
    key: "start",
    value: function start(p) {
      this.promise = p;
    }
  }, {
    key: "getHtml",
    value: function getHtml(fn) {
      return this.promise.then(fn);
    }
  }, {
    key: "append",
    value: function append(div) {
      return this.getHtml(function (h) {
        return $(div).append(h);
      });
    }
  }, {
    key: "into",
    value: function into(div) {
      return this.getHtml(function (h) {
        return $(div).html(h);
      });
    }
  }]);

  return hbTemplate;
}();

;

var HandlebarsInstance = null;
module.exports = function () {
  function HandlebarLoader() {
    _classCallCheck(this, HandlebarLoader);

    if (HandlebarsInstance) return HandlebarsInstance;
    this.templateLocal = "../src/templates/";
    this.templateName;
    this.handlebars = Handlebars;
    HandlebarsInstance = this;
  }

  _createClass(HandlebarLoader, [{
    key: "getTemplateFile",
    value: function getTemplateFile(name) {
      return this.templateLocal + name + ".hbs";
    }
  }, {
    key: "createHbTemplate",
    value: function createHbTemplate(t, data) {
      return new hbTemplate(t, data);
    }
  }, {
    key: "loadTemplate",
    value: function loadTemplate(t, data) {
      var _this = this;

      var templateObj = this.createHbTemplate(t, data);
      templateObj.start(new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        var templateFile = _this.getTemplateFile(t);
        xhttp.onreadystatechange = function () {
          if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
              console.info("loaded template: " + templateFile, data);
              var templateScript = _this.handlebars.compile(xhttp.responseText);
              var html = templateScript(data);
              resolve(html);
            } else {
              console.info(xhttp);
              reject({
                code: xhttp.status,
                message: xhttp.statusText
              });
            }
          }
        };
        xhttp.open("GET", templateFile, true);
        xhttp.send();
      }));
      return templateObj;
    }
  }]);

  return HandlebarLoader;
}();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

module.exports = function () {
  function SmilesServer() {
    _classCallCheck(this, SmilesServer);

    this.host = "http://localhost.smiles.com.br:8888";
    this.timeoutTime = 30000;
    this.checkoutToken = "";
  }

  _createClass(SmilesServer, [{
    key: "getHeaders",
    value: function getHeaders() {
      return {
        "Authorization": "Bearer " + this.checkoutToken,
        "Channel": "APP",
        "Content-Type": "application/json"
      };
    }
  }, {
    key: "get",
    value: function get(url) {
      var _this = this;

      //    console.info("server-get: " + url);
      var defer = new Promise(function (resolve, reject) {
        $.ajax({
          url: url,
          type: "GET",
          dataType: "json",
          headers: _this.getHeaders(),
          timeout: _this.timeoutTime,
          success: function success(data) {
            return resolve(data);
          },
          error: function error(data) {
            return reject(data);
          }
        });
      });
      return defer;
    }
  }, {
    key: "post",
    value: function post(url, data) {
      var _this2 = this;

      //    console.info("server-post: " + url, data);
      var defer = new Promise(function (resolve, reject) {
        $.ajax({
          url: url,
          type: "POST",
          data: data,
          dataType: "json",
          headers: _this2.getHeaders(),
          timeout: _this2.timeoutTime,
          success: function success(data) {
            return resolve(data);
          },
          error: function error(data) {
            return reject(data);
          }
        });
      });
      return defer;
    }
  }, {
    key: "getTokenInfo",
    value: function getTokenInfo() {
      var _this3 = this;

      var url = this.host + "/api/oauth/tokeninfo";
      var defer = new Promise(function (resolve, reject) {
        _this3.get(url).then(function (data) {
          resolve(data);
        }).catch(function (err) {
          return reject(err);
        });
      });
      return defer;
    }
  }, {
    key: "getCheckout",
    value: function getCheckout() {
      var url = this.host + "/api/checkout";
      return this.get(url);
    }
  }, {
    key: "getUserInfo",
    value: function getUserInfo() {
      var url = this.host + "/api/user";
      //    return this.get(url);
      return this.fakeCreditCards();
    }
  }, {
    key: "fakeCreditCards",
    value: function fakeCreditCards() {
      return new Promise(function (resolve, reject) {
        var ccs = {
          memberNumber: 7777,
          savedCreditCards: [{
            id: 1,
            brand: "VISA",
            number: "3015336500590223",
            main: true
          }, {
            id: 42,
            brand: "MASTERCARD",
            number: "8315179137951987",
            main: false
          }]
        };
        resolve(ccs);
      });
    }
  }]);

  return SmilesServer;
}();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[3])

//# sourceMappingURL=bundle.js.map
