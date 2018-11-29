$(document).ready(function () {
    var templateNames = [
        "cart-itens", "checkout", "total"
    ];

    var loadedTemplates = 0;
    templateNames.forEach(function(templateName) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                // console.log(this.responseText)
                Handlebars.partials[templateName] = Handlebars.compile(this.responseText);
                loadedTemplates++;
                if (loadedTemplates == templateNames.length) GetNonLoggedCheckoutController.init();
               }            
        };

        xhttp.open("GET","../src/templates/" + templateName + ".hbs",true);
        xhttp.send();

    });
})