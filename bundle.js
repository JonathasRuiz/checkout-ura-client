(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var testOrder;
var types = {};
var customCards = {};
var VISA = 'visa';
var MASTERCARD = 'mastercard';
var AMERICAN_EXPRESS = 'american-express';
var DINERS_CLUB = 'diners-club';
var DISCOVER = 'discover';
var ELO = 'elo';
var JCB = 'jcb';
var UNIONPAY = 'unionpay';
var MAESTRO = 'maestro';
var MIR = 'mir';
var CVV = 'CVV';
var CID = 'CID';
var CVC = 'CVC';
var CVN = 'CVN';
var CVP2 = 'CVP2';
var CVE = 'CVE';
var ORIGINAL_TEST_ORDER = [
  VISA,
  MASTERCARD,
  AMERICAN_EXPRESS,
  DINERS_CLUB,
  DISCOVER,
  JCB,
  UNIONPAY,
  MAESTRO,
  ELO,
  MIR
];

function clone(originalObject) {
  var dupe;

  if (!originalObject) { return null; }

  dupe = JSON.parse(JSON.stringify(originalObject));

  return dupe;
}

testOrder = clone(ORIGINAL_TEST_ORDER);

types[VISA] = {
  niceType: 'Visa',
  type: VISA,
  patterns: [
    4
  ],
  gaps: [4, 8, 12],
  lengths: [16, 18, 19],
  code: {
    name: CVV,
    size: 3
  }
};

types[MASTERCARD] = {
  niceType: 'Mastercard',
  type: MASTERCARD,
  patterns: [
    [51, 55],
    [2221, 2229],
    [223, 229],
    [23, 26],
    [270, 271],
    2720
  ],
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: CVC,
    size: 3
  }
};

types[AMERICAN_EXPRESS] = {
  niceType: 'American Express',
  type: AMERICAN_EXPRESS,
  patterns: [
    34,
    37
  ],
  gaps: [4, 10],
  lengths: [15],
  code: {
    name: CID,
    size: 4
  }
};

types[DINERS_CLUB] = {
  niceType: 'Diners Club',
  type: DINERS_CLUB,
  patterns: [
    [300, 305],
    36,
    38,
    39
  ],
  gaps: [4, 10],
  lengths: [14, 16, 19],
  code: {
    name: CVV,
    size: 3
  }
};

types[DISCOVER] = {
  niceType: 'Discover',
  type: DISCOVER,
  patterns: [
    6011,
    [644, 649],
    65
  ],
  gaps: [4, 8, 12],
  lengths: [16, 19],
  code: {
    name: CID,
    size: 3
  }
};

types[JCB] = {
  niceType: 'JCB',
  type: JCB,
  patterns: [
    2131,
    1800,
    [3528, 3589]
  ],
  gaps: [4, 8, 12],
  lengths: [16, 17, 18, 19],
  code: {
    name: CVV,
    size: 3
  }
};

types[UNIONPAY] = {
  niceType: 'UnionPay',
  type: UNIONPAY,
  patterns: [
    620,
    [624, 626],
    [62100, 62182],
    [62184, 62187],
    [62185, 62197],
    [62200, 62205],
    [622010, 622999],
    622018,
    [622019, 622999],
    [62207, 62209],
    [622126, 622925],
    [623, 626],
    6270,
    6272,
    6276,
    [627700, 627779],
    [627781, 627799],
    [6282, 6289],
    6291,
    6292
  ],
  gaps: [4, 8, 12],
  lengths: [16, 17, 18, 19],
  code: {
    name: CVN,
    size: 3
  }
};

types[MAESTRO] = {
  niceType: 'Maestro',
  type: MAESTRO,
  patterns: [
    493698,
    [500000, 506698],
    [506779, 508999],
    [56, 59],
    63,
    67,
    6
  ],
  gaps: [4, 8, 12],
  lengths: [12, 13, 14, 15, 16, 17, 18, 19],
  code: {
    name: CVC,
    size: 3
  }
};

types[ELO] = {
  niceType: 'Elo',
  type: ELO,
  patterns: [
    401178,
    401179,
    438935,
    457631,
    457632,
    431274,
    451416,
    457393,
    504175,
    [506699, 506778],
    [509000, 509999],
    627780,
    636297,
    636368,
    [650031, 650033],
    [650035, 650051],
    [650405, 650439],
    [650485, 650538],
    [650541, 650598],
    [650700, 650718],
    [650720, 650727],
    [650901, 650978],
    [651652, 651679],
    [655000, 655019],
    [655021, 655058]
  ],
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: CVE,
    size: 3
  }
};

types[MIR] = {
  niceType: 'Mir',
  type: MIR,
  patterns: [
    [2200, 2204]
  ],
  gaps: [4, 8, 12],
  lengths: [16, 17, 18, 19],
  code: {
    name: CVP2,
    size: 3
  }
};

function findType(type) {
  return customCards[type] || types[type];
}

function isValidInputType(cardNumber) {
  return typeof cardNumber === 'string' || cardNumber instanceof String;
}

function hasEnoughResultsToDetermineBestMatch(results) {
  var numberOfResultsWithMaxStrengthProperty = results.filter(function (result) {
    return result.matchStrength;
  }).length;

  // if all possible results have a maxStrength property
  // that means the card number is sufficiently long
  // enough to determine conclusively what the type is
  return numberOfResultsWithMaxStrengthProperty > 0 &&
    numberOfResultsWithMaxStrengthProperty === results.length;
}

function findBestMatch(results) {
  if (!hasEnoughResultsToDetermineBestMatch(results)) {
    return;
  }

  return results.reduce(function (bestMatch, result) { // eslint-disable-line consistent-return
    if (!bestMatch) {
      return result;
    }

    // if the current best match pattern is less specific
    // than this result, set the result as the new best match
    if (bestMatch.matchStrength < result.matchStrength) {
      return result;
    }

    return bestMatch;
  });
}

function getAllCardTypes() {
  return testOrder.map(function (type) {
    return clone(findType(type));
  });
}

function creditCardType(cardNumber) {
  var bestMatch;
  var results = [];

  if (!isValidInputType(cardNumber)) {
    return [];
  }

  if (cardNumber.length === 0) {
    return getAllCardTypes();
  }

  testOrder.forEach(function (type) {
    var cardConfiguration = findType(type);

    loopOverCardPatterns(cardNumber, cardConfiguration, results);
  });

  bestMatch = findBestMatch(results);

  if (bestMatch) {
    return [bestMatch];
  }

  return results;
}

function loopOverCardPatterns(cardNumber, cardConfiguration, results) {
  var i, pattern, patternLength, clonedCardConfiguration;

  for (i = 0; i < cardConfiguration.patterns.length; i++) {
    pattern = cardConfiguration.patterns[i];

    if (!matches(cardNumber, pattern)) {
      continue;
    }

    clonedCardConfiguration = clone(cardConfiguration);

    if (Array.isArray(pattern)) {
      patternLength = String(pattern[0]).length;
    } else {
      patternLength = String(pattern).length;
    }

    if (cardNumber.length >= patternLength) {
      clonedCardConfiguration.matchStrength = patternLength;
    }

    results.push(clonedCardConfiguration);
    break;
  }
}

function matches(cardNumber, pattern) {
  if (Array.isArray(pattern)) {
    return matchesRange(cardNumber, pattern[0], pattern[1]);
  }

  return matchesPattern(cardNumber, pattern);
}

function matchesPattern(cardNumber, pattern) {
  pattern = String(pattern);

  return pattern.substring(0, cardNumber.length) === cardNumber.substring(0, pattern.length);
}

// Adapted from https://github.com/polvo-labs/card-type/blob/aaab11f80fa1939bccc8f24905a06ae3cd864356/src/cardType.js#L37-L42
function matchesRange(cardNumber, min, max) {
  var maxLengthToCheck = String(min).length;
  var substr = cardNumber.substr(0, maxLengthToCheck);
  var integerRepresentationOfCardNumber = parseInt(substr, 10);

  min = parseInt(String(min).substr(0, substr.length), 10);
  max = parseInt(String(max).substr(0, substr.length), 10);

  return integerRepresentationOfCardNumber >= min && integerRepresentationOfCardNumber <= max;
}

creditCardType.getTypeInfo = function (type) {
  return clone(findType(type));
};

function getCardPosition(name, ignoreErrorForNotExisting) {
  var position = testOrder.indexOf(name);

  if (!ignoreErrorForNotExisting && position === -1) {
    throw new Error('"' + name + '" is not a supported card type.');
  }

  return position;
}

creditCardType.removeCard = function (name) {
  var position = getCardPosition(name);

  testOrder.splice(position, 1);
};

creditCardType.addCard = function (config) {
  var existingCardPosition = getCardPosition(config.type, true);

  customCards[config.type] = config;

  if (existingCardPosition === -1) {
    testOrder.push(config.type);
  }
};

creditCardType.updateCard = function (cardType, updates) {
  var clonedCard;
  var originalObject = customCards[cardType] || types[cardType];

  if (!originalObject) {
    throw new Error('"' + cardType + '" is not a recognized type. Use `addCard` instead.');
  }

  if (updates.type && originalObject.type !== updates.type) {
    throw new Error('Cannot overwrite type parameter.');
  }

  clonedCard = clone(originalObject, true);

  Object.keys(clonedCard).forEach(function (key) {
    if (updates[key]) {
      clonedCard[key] = updates[key];
    }
  });

  customCards[clonedCard.type] = clonedCard;
};

creditCardType.changeOrder = function (name, position) {
  var currentPosition = getCardPosition(name);

  testOrder.splice(currentPosition, 1);
  testOrder.splice(position, 0, name);
};

creditCardType.resetModifications = function () {
  testOrder = clone(ORIGINAL_TEST_ORDER);
  customCards = {};
};

creditCardType.types = {
  VISA: VISA,
  MASTERCARD: MASTERCARD,
  AMERICAN_EXPRESS: AMERICAN_EXPRESS,
  DINERS_CLUB: DINERS_CLUB,
  DISCOVER: DISCOVER,
  JCB: JCB,
  UNIONPAY: UNIONPAY,
  MAESTRO: MAESTRO,
  ELO: ELO,
  MIR: MIR
};

module.exports = creditCardType;

},{}],2:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

var CreditCardType = require('credit-card-type');

var FormService = require("../services/form-service.js");
var HandlebarLoader = require("../services/handlebar-loader");
var SmilesServer = require("../services/smiles-server");

var CreditCardFormInstance = null;
module.exports = function () {
  function CreditCardForm() {
    _classCallCheck(this, CreditCardForm);

    if (CreditCardFormInstance) return CreditCardFormInstance;
    this.hb = null;
    CreditCardFormInstance = this;
  }

  _createClass(CreditCardForm, [{
    key: "load",
    value: function load() {
      var _this = this;

      if (this.hb == null) {
        this.hb = new HandlebarLoader().loadTemplate("sections/credit-card-form", {});
      }
      this.hb.into("#checkout-step-1").then(function () {
        return _this.loadJQuery();
      });
    }
  }, {
    key: "resetForm",
    value: function resetForm() {
      $('#cardNumber').val('');
      $('#cardHolderName').val('');
      $('.cardCvc').val('');
      $('input[name=member-card]').removeAttr('checked');
      $('input[id^=secure-code-member-card]').val('');
      $('.div-secure-code-member-card').hide();
      $('#member-card-list li').removeClass('selected-one-click-card');
    }
  }, {
    key: "checkIsCardSmiles",
    value: function checkIsCardSmiles(cardNumber) {
      return cardNumber.indexOf('542661') === 0 || cardNumber.indexOf('545053') === 0 || cardNumber.indexOf('514895') === 0 || cardNumber.indexOf('510147') === 0 || cardNumber.indexOf('512427') === 0 || cardNumber.indexOf('514911') === 0;
    }

    // input: credit card number (full or partial)
    // output: credit card brand (or false for unknown)

  }, {
    key: "detectCardType",
    value: function detectCardType(number) {
      var result = CreditCardType(number);
      if (result.length != 1) return false;
      var cc = result[0];
      var brand = cc.type;
      if (brand == "mastercard") {
        brand = this.checkIsCardSmiles(number) ? "mastercard_smiles" : brand;
      }
      return brand;
    }
  }, {
    key: "loadJQuery",
    value: function loadJQuery() {
      var _this2 = this;

      var formService = new FormService();
      formService.setCardNumber('#cardNumber');
      $('#back-to-member-card-list').on('click', function () {
        _this2.resetForm();
        var CreditCardList = require("./credit-card-list");
        new CreditCardList().load();
      });
      $('#cardNumber').on('keyup', function (evt) {
        var elem = "#" + evt.target.id;
        var val = $(elem).val();
        var brand = _this2.detectCardType(val);
        $('#smls-card-icon').attr('class', 'cards');
        if (brand !== false) {
          $('#smls-card-icon').addClass(brand);
        }
      });
    }
  }]);

  return CreditCardForm;
}();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../services/form-service.js":6,"../services/handlebar-loader":7,"../services/smiles-server":8,"./credit-card-list":3,"credit-card-type":1}],3:[function(require,module,exports){
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
        var AddCreditCard = require("./credit-card-form");
        new AddCreditCard().load();
      });
    }
  }]);

  return CreditCardList;
}();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../services/handlebar-loader":7,"../services/smiles-server":8,"./credit-card-form":2}],4:[function(require,module,exports){
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

},{"./controllers/credit-card-list":3,"./services/handlebar-loader":7}],5:[function(require,module,exports){
"use strict";

require("./load.js");

},{"./load.js":4}],6:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

module.exports = function () {
  function FormService() {
    _classCallCheck(this, FormService);
  }

  _createClass(FormService, [{
    key: 'setNumberOnly',
    value: function setNumberOnly(inputId) {
      $(inputId).on('keydown', function (evt) {
        var key = evt.which ? evt.which : event.keyCode;
        if (key >= 48 && key <= 57 || // numbers
        key >= 96 && key <= 105 || // Numeric keypad
        key == 8 || key == 9 || key == 13 || // Backspace and Tab and Enter
        key == 35 || key == 36 || // Home and End
        key == 37 || key == 39 || // left and right arrows
        key == 46 || key == 45 // Del and Ins
        ) return true;else return false;
      });
    }
  }, {
    key: 'setCardNumber',
    value: function setCardNumber(inputId) {
      this.setNumberOnly(inputId);
      $(inputId).on('blur', function () {
        $(inputId).attr('maxlength', '19');
        var cardNumber = $(inputId).val();
        cardNumber = cardNumber.toString().replace(/[^0-9]/g, '');
        if (cardNumber.length === 15) {
          cardNumber = cardNumber.toString().replace(/\D/g, "");
          cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/, "$1 $2");
          cardNumber = cardNumber.toString().replace(/(\d{6})(\d)/, "$1 $2");
          cardNumber = cardNumber.toString().replace(/(\d{6})(\d)/, "$1 $2");
          $(".cardCVC").attr('maxlength', '4');
        } else {
          cardNumber = cardNumber.toString().replace(/\D/g, "");
          cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/, "$1 $2");
          cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/, "$1 $2");
          cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/, "$1 $2");
          cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/, "$1 $2");
          $(".cardCVC").attr('maxlength', '3');
        }
        $(inputId).val(cardNumber);
      });
      $(inputId).on('focus', function () {
        $(inputId).attr('maxlength', '16');
        var cardNumber = $(inputId).val();
        cardNumber = cardNumber.toString().replace(/[^0-9]/g, '');
        $(inputId).val(cardNumber);
      });
    }
  }]);

  return FormService;
}();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}]},{},[5])

//# sourceMappingURL=bundle.js.map
