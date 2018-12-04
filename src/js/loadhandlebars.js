var $ = require("jquery");
var Handlebars = require("./libs/handlebars-v4.0.12");
var nonLoggedCheckout = require("./controllers/non-logged-checkout");

$(document).ready(() => {
  var templateNames = ["cartitens", "checkout", "total"];
  var loadedTemplates = 0;

  templateNames.forEach((templateName) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        Handlebars.partials[templateName] = Handlebars.compile(xhttp.responseText);
        loadedTemplates++;
        if (loadedTemplates == templateNames.length) {
          $('#checkout-token-portlet').html(Handlebars.partials["checkout"]);
          nonLoggedCheckout.init();
        }
      }
    };
    xhttp.open("GET","../src/templates/" + templateName + ".hbs",true);
    xhttp.send();

  });
});
