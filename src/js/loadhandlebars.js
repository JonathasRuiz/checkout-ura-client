$(document).ready(function () {
    var templateNames = [
        "cartitens", "checkout", "total","miles_operations","baggagefare"
    ];

    var loadedTemplates = 0;
    templateNames.forEach(function(templateName) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                // console.log(this.responseText)
                Handlebars.partials[templateName] = Handlebars.compile(this.responseText);
                loadedTemplates++;
                if (loadedTemplates == templateNames.length) loadCheckout();
               }            
        };

        xhttp.open("GET","../src/templates/" + templateName + ".hbs",true);
        xhttp.send();

    });

    function loadCheckout(){
        $('#checkout-token-portlet').html(Handlebars.partials["checkout"]); 
            GetNonLoggedCheckoutController.msgavista	     			 = 'a vista';
            GetNonLoggedCheckoutController.msgMonetary	     			 = 'R$';
            GetNonLoggedCheckoutController.msgItem 		 			 = 'Item';
            GetNonLoggedCheckoutController.msgPurchase    			 = 'Comprar Milhas';
			GetNonLoggedCheckoutController.msgTransfer    			 = 'Transferir Milhas';
			GetNonLoggedCheckoutController.msgRevalidate  			 = 'Revalidar Milhas';            
        console.log("something")
        $.ajax({
            url: GetNonLoggedCheckoutController.urlGetCheckout,
            type: 'GET',
            dataType: 'json',
            timeout: 300000,
            headers:{
                "Authorization":"Bearer " + GetNonLoggedCheckoutController.checkoutToken,
                "Channel":"APP",
                "Content-Type":"application/json"
            },
            success: function (data) {
                // Recupera o valor da propriedade status
                console.log("checkToken");
                console.log(data);
                GetNonLoggedCheckoutController.checkoutInfo = data;
                GetNonLoggedCheckoutController.getJSON = data;
                GetNonLoggedCheckoutController.checkoutInfo["typeCheckout"]="miles";
                GetNonLoggedCheckoutController.checkoutInfo["isClubMember"]=true;
                $(".services-table").html(Handlebars.partials["cartitens"](GetNonLoggedCheckoutController.checkoutInfo));
                if(GetNonLoggedCheckoutController.checkoutInfo["typeCheckout"]=="miles"){
                    $(".tbody_services-table").html(Handlebars.partials["miles_operations"](GetNonLoggedCheckoutController.checkoutInfo.itemList));
                    console.log(GetNonLoggedCheckoutController.checkoutInfo.itemList)
                }else{
                    $(".tbody_services-table").html(Handlebars.partials["baggagefare"](GetNonLoggedCheckoutController.checkoutInfo));
                }

                GetNonLoggedCheckoutController.init();
            }
        });  
        

    }
})