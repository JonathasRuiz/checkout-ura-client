var $ = require("jquery");

module.exports = class SmilesServer {
  constructor() {
    this.host = "http://localhost.smiles.com.br:8888";
    this.timeoutTime = 30000;
    this.checkoutToken = "";
  }

  getHeaders () {
    return {
      "Authorization": "Bearer " + this.checkoutToken,
      "Channel": "APP",
      "Content-Type": "application/json"
    };
  }

  get(url) {
//    console.info("server-get: " + url);
    var defer = new Promise( (resolve, reject) => {
      $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        headers: this.getHeaders(),
        timeout: this.timeoutTime,
        success: (data) => resolve(data),
        error: (data) => reject(data)
      });
    });
    return defer;
  };
  post (url, data) {
//    console.info("server-post: " + url, data);
    var defer = new Promise( (resolve, reject) => {
      $.ajax({
        url: url,
        type: "POST",
        data: data,
        dataType: "json",
        headers: this.getHeaders(),
        timeout: this.timeoutTime,
        success: (data) => resolve(data),
        error: (data) => reject(data)
      });
    });
    return defer;
  };

  getTokenInfo() {
    let url = this.host + "/api/oauth/tokeninfo";
    let defer = new Promise((resolve, reject) => {
      this.get(url)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => reject(err));
    });
    return defer;
  };
  getCheckout() {
    let url = this.host + "/api/checkout";
    return this.get(url);
  };
  getUserInfo() {
    let url = this.host + "/api/user";
//    return this.get(url);
    return this.fakeCreditCards();
  };

  fakeCreditCards() {
    return new Promise((resolve, reject) => {
      let ccs = {
        memberNumber: 7777,
        savedCreditCards: [
          {
            id: 1,
            brand: "VISA",
            number: "3015336500590223",
            main: true
          }, {
            id: 42,
            brand: "MASTERCARD",
            number: "8315179137951987",
            main: false
          }   
        ]
      };
      resolve(ccs);
    });
  }

};
