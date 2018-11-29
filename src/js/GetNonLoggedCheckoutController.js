var GetNonLoggedCheckoutController = {
    checkoutToken:'',
    urlGetCheckout:'http://localhost.smiles.com.br:8888/api/checkout',
    urlTokenCheckout:'http://localhost.smiles.com.br:8888/api/oauth/tokeninfo',
    accessToken:'',
    tokenInfo:{},
    checkoutInfo:{},
    init:function(){
        GetNonLoggedCheckoutController.getTokenInfo();
        GetNonLoggedCheckoutController.getCheckout();
        $('#checkout-token-portlet').html(Handlebars.partials["checkout"]);
    },
    getTokenInfo:function(){
        $.ajax({
            url: this.urlTokenCheckout,
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
            }
        });        

    },
    getCheckout:function(){
        $.ajax({
            url: this.urlGetCheckout,
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
            }
        });          

    }
    // checkTokenInfo:function(url,token){
    //     $.ajax({
    //         url: url,
    //         type: 'GET',
    //         dataType: 'json',
    //         timeout: 300000,
    //         headers:{
    //             "Authorization":"Bearer " + token,
    //             "Channel":"APP",
    //             "Content-Type":"application/json"
    //         },
    //         success: function (data) {
    //             // Recupera o valor da propriedade status
    //             console.log("checkToken");
    //             console.log(data);
    //         }
    //     });
    // },
    // getCheckoutToken:function(url, token){
    //     document.cookie = "TRANSACTION_ID=NDE1OCpBUEkqOTAyMjMzMDQz; path=/; domain=.smiles.com.br; HttpOnly; Expires=Wed, 28 Nov 2018 17:45:15 GMT;";
    //     $.ajax({
    //         url: url,
    //         type: 'GET',
    //         dataType: 'json',
    //         timeout: 300000,
    //         headers:{
    //             "Authorization":"Bearer " + token,
    //             "Channel":"APP",
    //             "Content-Type":"application/json",
    //             "API_VERSION":"2"
    //         },
    //         success: function (data) {
    //             // Recupera o valor da propriedade status
    //             console.log("getCheckout");
    //             console.log(data);
    //         }
    //     });
        

    // },addToCheckout:function(url, accessToken){
    //     var bodyData = new Object();
    //     var jsonRequest = new Object();

    //     bodyData["quantity"]="1000";
    //     bodyData["optionId"]="1-MLD3PU5";
    //     bodyData["operation"]="PURCHASE";
    //     jsonRequest["miles"]=bodyData;

    //     console.log(jsonRequest);

    //     $.ajax({
    //         url: url,
    //         data:JSON.stringify(jsonRequest),
    //         type: 'POST',
    //         dataType: 'json',
    //         timeout: 300000,
    //         headers:{
    //             "Authorization":"Bearer " + accessToken,
    //             "Channel":"APP",
    //             "Content-Type":"application/json"
    //         },
    //         success: function (data) {
    //             // Recupera o valor da propriedade status
    //             console.log("addToCheckout");
    //             console.log(data);
    //         }
    //     });


    // },
    // getCheckoutOffer:function(url, accessToken){
    //     var jsonRequest = new Object();
    //     jsonRequest["memberNumber"]="902233043";
    //     jsonRequest["note"]="teste";
    //     jsonRequest["sendType"]="SMS";

    //     console.log(jsonRequest);

    //     $.ajax({
    //         url: url,
    //         data:JSON.stringify(jsonRequest),
    //         type: 'POST',
    //         dataType: 'json',
    //         timeout: 300000,
    //         headers:{
    //             "Authorization":"Bearer " + accessToken,
    //             "Channel":"APP",
    //             "Content-Type":"application/json"
    //         },
    //         success: function (data) {
    //             // Recupera o valor da propriedade status
    //             console.log("getCheoutOffer");
    //             console.log(data);
    //             var fullUrl = data.generatedLink;
    //             var paramIndex = fullUrl.indexOf("=");
    //             GetNonLoggedCheckoutController.checkoutToken = fullUrl.slice(paramIndex+1);
    //             window.location = '/checkout-token?user_token='+GetNonLoggedCheckoutController.checkoutToken;
    //         }
    //     });
    // }



}