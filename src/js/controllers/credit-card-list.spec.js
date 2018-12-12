var expect = require('chai').expect;

var CreditCardList = require('./credit-card-list');

describe("CreditCardList", () => {

  let service;

  beforeEach(() => {
    service = new CreditCardList();
  });

  it("should exist", () => {
    expect(service).to.not.be.null;
  });

});
