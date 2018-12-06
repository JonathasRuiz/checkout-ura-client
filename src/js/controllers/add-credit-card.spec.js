var expect = require('chai').expect;

var AddCreditCard = require('./add-credit-card');

describe("AddCreditCard", () => {

  let service;

  beforeEach(() => {
    service = new AddCreditCard();
  });

  it("should exist", () => {
    expect(service).to.not.be.null;
  });

  it("should get brand by card number", () => {
    let brand;
    let cardN = "";
    brand = service.detectCardType(cardN);
    expect(brand).to.be.false;

    // American express
    cardN = "372261290181138";
    brand = service.detectCardType(cardN);
    expect(brand).to.be.equal("american-express");

    // Visa
    cardN = "4539955959982866";
    brand = service.detectCardType(cardN);
    expect(brand).to.be.equal("visa");

    // MasterCard
    cardN = "5488371258643621";
    brand = service.detectCardType(cardN);
    expect(brand).to.be.equal("mastercard");

    // Diners
    cardN = "30246976868581";
    brand = service.detectCardType(cardN);
    expect(brand).to.be.equal("diners-club");

    // Smiles
    cardN = "512427258643621";
    brand = service.detectCardType(cardN);
    expect(brand).to.be.equal("mastercard_smiles");
  });

});
