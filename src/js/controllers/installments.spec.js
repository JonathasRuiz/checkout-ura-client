var expect = require('chai').expect;

var Installments = require('./installments');

describe("Installments", () => {

  let service;

  beforeEach(() => {
    service = new Installments();
  });

  it("should exist", () => {
    expect(service).to.not.be.null;
  });

});
