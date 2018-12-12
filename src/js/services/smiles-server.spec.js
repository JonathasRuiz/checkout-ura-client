var expect = require('chai').expect;

var $ = require("jquery");
var SmilesServer = require('./smiles-server');

describe("Smiles Server", () => {

  let service;

  beforeEach(() => {
    service = new SmilesServer();
  });

  it("should exist", () => {
    expect(service.getTokenInfo).to.be.a("function");
  });

  it("should get Token", (done) => {
    $.ajax = (configs) => {
      expect(configs.type).to.be.equal("GET");
      let tokenResponse = require("../mocks.speck").token;
      configs.success(tokenResponse);
    };
    service.getTokenInfo()
      .then((data) => {
        expect(data.memberNumber).to.be.equal("7777");
        done();
      });
  });

  it("should get Checkout", (done) => {
    $.ajax = (configs) => {
      let checkoutResponse = require("../mocks.speck").checkout;
      configs.success(checkoutResponse);
    };
    service.getCheckout()
      .then((data) => {
        expect(data.memberNumber).to.be.equal("7777");
        expect(data.creditCardOptionList).to.be.an("array");
        expect(data.creditCardOptionList.length).to.be.equal(9);
        done();
      });
  });

});
