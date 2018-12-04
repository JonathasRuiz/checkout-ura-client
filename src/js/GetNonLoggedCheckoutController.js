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

        $('input[name=member-card]').on('click', function(){
        	$('.div-secure-code-member-card').hide();
        	$('#member-card-list li').removeClass('selected-one-click-card');
        	$(this).closest('li').addClass('selected-one-click-card');
        	$('input[id^=secure-code-member-card]').val('');
        	if($(this).is(':checked')){
        		$('#div-secure-code-member-card' + $(this).data('index')).show();
        	}
        	$(this).closest('li').addClass('selected-one-click-card');
        	// GetCheckoutController.loadInstallmentSelect();
        });       
        
        var resetFormCreditCardAndSavedCreditCard = function(){
        	$('#cardNumber').val('');
        	$('#cardHolderName').val('');
        	$('.cardCvc').val('');
        	$('input[name=member-card]').removeAttr('checked');
        	$('input[id^=secure-code-member-card]').val('');
        	$('.div-secure-code-member-card').hide();
        	$('#member-card-list li').removeClass('selected-one-click-card');
        	// GetCheckoutController.loadInstallmentSelect();
        };

        $('#other-credit-card').on('click', function(){
        	resetFormCreditCardAndSavedCreditCard();
        	$('#member-card-list').hide();
        	$('#form-credit-card').show();
        	$('#useSavedCard').val('false');
        });        

        $('#back-to-member-card-list').on('click', function(){
        	resetFormCreditCardAndSavedCreditCard();
        	$('#form-credit-card').hide();
        	$('#member-card-list').show();
        	$('#useSavedCard').val('true');
        });        
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
                GetNonLoggedCheckoutController.tokenInfo = data;
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
                GetNonLoggedCheckoutController.checkoutInfo = data;
                $(".services-table").html(Handlebars.partials["cartitens"]())
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