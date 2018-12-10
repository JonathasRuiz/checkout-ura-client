var $ = require("jquery");
var Handlebars = require("../libs/handlebars-v4.0.12");

class hbTemplate {
  constructor(tname, data) {
    this.name = tname;
    this.data = data;
    this.promise = null;
    this.html = null;
  }

  start(p) {
    this.promise = p;
  };
  getHtml(fn) { return this.promise.then(fn); };
  append(div) { 
    return this.getHtml( h => $(div).append(h) ); 
  };
  into (div) { 
    return this.getHtml( h => $(div).html(h) ); 
  };

};

var HandlebarsInstance = null;
module.exports = class HandlebarLoader {
  constructor() {
    if(HandlebarsInstance) return HandlebarsInstance;
    this.templateLocal = "../src/templates/";
    this.templateName;
    this.handlebars = Handlebars;
    HandlebarsInstance = this;
  }

/*
  loadHandlebar() {
    Handlebars.registerHelper('if_eq', (a, b, opts) => {
      if(a == b)
        return opts.fn(this);
      else
        return opts.inverse(this);
    });
  }
*/

  getTemplateFile(name) {
    return this.templateLocal + name + ".hbs";
  };

  createHbTemplate(t, data) {
    return new hbTemplate(t, data);
  }

  loadTemplate(t, data) {
    let templateObj = this.createHbTemplate(t, data);
    templateObj.start(
      new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        let templateFile = this.getTemplateFile(t);
        xhttp.onreadystatechange = () => {
          if(xhttp.readyState == 4) {
            if (xhttp.status == 200) {
              console.info("loaded template: " + templateFile, data);
              let templateScript = this.handlebars.compile(xhttp.responseText);
              let html = templateScript(data);
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
      })
    );
    return templateObj;
  };

};
