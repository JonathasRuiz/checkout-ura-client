var GetNonLoggedCheckoutController = {
    cardNumber 		            : $('#cardNumber'),
    cardCvc 		            : $('#cardCvc'),
    cardHolderName 	            : $('#cardHolderName'),
    cardDataYear	            : $('#cardDataYear'),
    cardDataMonth	            : $('#cardDataMonth'),
    currentYear		            : $('#currentYear'),
    installments 	            : $('#installmentSelect'),
    cardBrand                   : $('#brand'),
    cardBrandIcon               : $('#smls-card-icon'),
    cardCode                    : $('#cardCode'),
    saveCard                    : $('#saveCard'),
    useSavedCard                : $('#useSavedCard'),
    smilesPassword	            : $('#smilesPassword'),
    cardTermsAgreement	        : $('#cardTermsAgreement'),
    exceptionalPayment          : $('#exceptionalPayment'),
    typeCheckout                : $('#typeCheckout'),
    cardRulePaymentType         : $('#cardRulePaymentType'),
    installmentSelectDiv        : $('#installmentSelectDiv'),
    familyAccountTerms          : $('#familyAccountTermsAgreement'),
    cardRule		            : [],
    key				            : "",
    options			            : {},
    cseInstance 	            : null,
    msgPurchase	                : null,
    msgavista		            : null,
    msgTransfer  	            : null,
    msgRevalidate               : null,
    msgMonetary		            : null,
    msgItem 		            : null,
    msgNumParcels	            : null,
    getJSON			            : null,
    namespace		            : null,
    paymentURL 		            : null,
    accessionURL                : null,
    addCheckoutURL	            : null,
    changeItemCartURL           : null,
    acceptClubURL	            : null,
    orderURL		            : null,
    smilestwice		            : 2,
    smilestime		            : 15000,
    tooltip		                : 2,
    smilestwicePay	            : 4,
    taxesMiles                  : document.getElementById('taxes-miles'),
    taxesMoney                  : document.getElementById('taxes-money'),
    taxesItem                   : document.getElementById('taxes-id'),
    joingClub		            : null,
    taxesClub		            : null,
    regexApenasLetras           : /[^a-zA-Z ]/g,
    regexLetrasNumeros          : /[^a-zA-Z0-9 ]/g,
    isCvcMoreThenThreeChars		: false,
    memberLogged 				: null,
    paymentFailedRedirectPage	: null,
    flagBookingType             : "",
    recaptchaWidgetId			: null,
    accessionClubValidatedURL	: null,
    currentVoucher              : null,
    ChangePlanClubURL           : null,
    urlCallback					: null,
    count						: 0,
    checkoutToken:'',
    urlGetCheckout:'http://localhost.smiles.com.br:8888/api/checkout?type=PURCHASE2',
    urlTokenCheckout:'http://localhost.smiles.com.br:8888/api/oauth/tokeninfo',
    accessToken:'',
    tokenInfo:{},
    checkoutInfo:{},
    init:function(){
        // GetNonLoggedCheckoutController.getTokenInfo();
        // GetNonLoggedCheckoutController.getCheckout();
        this.assignScopeVariables();
        smiles.portal.InstallmentsTooltip.controller.init();    

        $('input[name^="radio"]').each(function(index){
            if($(this).prop("checked")) {
                GetNonLoggedCheckoutController.currentVoucher = $(this).val();
            }
        });

        if(GetNonLoggedCheckoutController.getJSON === null){
            this.showErrorModal('exception.generic.message');
        }

        GetNonLoggedCheckoutController.clearAll();

        $("#clear").on('click',function() {
            GetNonLoggedCheckoutController.smilesPassword.val('');
        });

        $('.paymentData input[name!=member-card]').not('.cardCvcSaved').on('keyup', function(){
            GetNonLoggedCheckoutController.loadInstallmentSelect();
        });

        // Atualizar as parcelas
        $('#cardNumber').on('keyup blur', function(){
            GetNonLoggedCheckoutController.loadInstallmentSelect();
        });

        GetNonLoggedCheckoutController.cardHolderName.on('keypress', function(event) {
            var key = event.which ? event.which : event.keyCode;
            if((key > 0 && key < 48) || (key >= 65 && key <= 90) || (key >= 97 && key <=122)) {
                return;
            } else {
                event.preventDefault();
            }
        });

        GetNonLoggedCheckoutController.cardHolderName.on("input", function(){
            if($(this).val().match(GetNonLoggedCheckoutController.regexLetrasNumeros)){
                $(this).val( $(this).val().replace(GetNonLoggedCheckoutController.regexLetrasNumeros,'') );
            }
        });
        this.installments.on('change', function() {
            GetNonLoggedCheckoutController.loadInstallmentDescription(GetNonLoggedCheckoutController.getJSON, GetNonLoggedCheckoutController.getBrandOneClickOrNewCard());
        });

        $('#btnCheckout').unbind("click").bind("click",function() {
            GetNonLoggedCheckoutController.checkoutAction();
        });

/*         if(GetNonLoggedCheckoutController.exceptionalPayment !== null &&
            GetNonLoggedCheckoutController.exceptionalPayment.val() !== 'true') {
            GetNonLoggedCheckoutController.tooltipHide();
        }

        if(!GetNonLoggedCheckoutController.exceptionalPayment.val()  &&
            GetNonLoggedCheckoutController.typeCheckout.val() !== 'milesLoan') {
            
            $("div#tablePayment").on('click', function(){
                GetNonLoggedCheckoutController.tooltipHide();
            });

            $("#tooltipBorderMobile").on('click', function(){
                GetNonLoggedCheckoutController.tooltipShowMobile();
            });
        } */

/*         $('#btnCheckoutNoFee').on('click', function(){
            GetNonLoggedCheckoutController.checkoutNoFeeAction();
        });

        GetNonLoggedCheckoutController.hideDivPayWithMiles(); */
        GetNonLoggedCheckoutController.cseInstance   = adyen.encrypt.createEncryption(GetNonLoggedCheckoutController.key, GetNonLoggedCheckoutController.options);
        GetNonLoggedCheckoutController.configCardTypeDetection();
/* 
        if(document.getElementById('btn-miles') && document.getElementById('type-boarding')){
            $('#btn-miles').on('hover', function(){
                GetNonLoggedCheckoutController.showDivPayWithMiles();
            },function(){
                GetNonLoggedCheckoutController.hideDivPayWithMiles();
            });

            if(document.getElementById('type-boarding').value === 'money'){
                $('#btn-miles').on('click', function(){
                    GetNonLoggedCheckoutController.changeButtonMiles();
                    GetNonLoggedCheckoutController.addItemFeeToCart(GetNonLoggedCheckoutController.taxesMiles.value,'0','BOARDING',GetNonLoggedCheckoutController.taxesItem.value, '', GetNonLoggedCheckoutController.flagBookingType);
                });
            }
        }

        $('#ic-viaje-facil-info').on('click',function(){
            GetNonLoggedCheckoutController.tooltipViajeFacilInfo();
        });

        if(document.getElementById('btn-money') && document.getElementById('type-boarding')){
            if(document.getElementById('type-boarding').value === 'miles'){
                $('#btn-money').on('click', function(){
                    GetNonLoggedCheckoutController.changeButtonMoney();
                    GetNonLoggedCheckoutController.addItemFeeToCart('0',GetNonLoggedCheckoutController.taxesMoney.value,'BOARDING',GetNonLoggedCheckoutController.taxesItem.value, '', GetNonLoggedCheckoutController.flagBookingType);
                });
            }
        }

        $('#smls-check-accept-club').on('click', function(){
            GetNonLoggedCheckoutController.acceptClub(GetNonLoggedCheckoutController.flagBookingType);
        });

        $('#div-ticket-issue').on('click', function(){
            GetNonLoggedCheckoutController.chooseTicketIssue();
            $('#reserve').css('display', 'none');
            $('#acceptEasyTravel').css('display', 'none');
        });

        $('#div-your-ticket').on('click', function(){
            GetNonLoggedCheckoutController.chooseYourTicket();
        });
        
        $('#div-easy-travel').on('click', function(){
            GetNonLoggedCheckoutController.chooseEasyTravel();
        }); */
        
        GetNonLoggedCheckoutController.cardTermsAgreement.on('click', function(){
            if(GetNonLoggedCheckoutController.cardTermsAgreement.attr('checked')) {
                smiles.portal.CommomValidators.controller.makeFieldValid(GetNonLoggedCheckoutController.cardTermsAgreement);
                GetNonLoggedCheckoutController.cardTermsAgreement.attr("checked", "checked");
            }else{
                GetNonLoggedCheckoutController.cardTermsAgreement.removeAttr("checked");
            }
        });

        $('input[name=member-card]').on('click', function(){
        	$('.div-secure-code-member-card').hide();
        	$('#member-card-list li').removeClass('selected-one-click-card');
        	$(this).closest('li').addClass('selected-one-click-card');
        	$('input[id^=secure-code-member-card]').val('');
        	if($(this).is(':checked')){
        		$('#div-secure-code-member-card' + $(this).data('index')).show();
        	}
        	$(this).closest('li').addClass('selected-one-click-card');
        	// GetNonLoggedCheckoutController.loadInstallmentSelect();
        });       
        
        var resetFormCreditCardAndSavedCreditCard = function(){
        	$('#cardNumber').val('');
        	$('#cardHolderName').val('');
        	$('.cardCvc').val('');
        	$('input[name=member-card]').removeAttr('checked');
        	$('input[id^=secure-code-member-card]').val('');
        	$('.div-secure-code-member-card').hide();
        	$('#member-card-list li').removeClass('selected-one-click-card');
        	// GetNonLoggedCheckoutController.loadInstallmentSelect();
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
        
        this.addListeners();
        GetNonLoggedCheckoutController.loadInstallmentSelect();

    },
    addListeners : function addListeners() {

        $('.easy-travel-help-tooltip__toggler').on('click', function(){
            $('.easy-travel-help-tooltip').toggle();
        });

        $('#exceptionalPaymentTermsAgreement').on('click', function() {
            GetNonLoggedCheckoutController.showTermsOfUse('.excepcional-payment__terms-of-use');
            return false;
        });

        $('.club-smiles__show-terms-of-use').on('click', function(){
            GetNonLoggedCheckoutController.showTermsOfUse('.club-smiles__terms-of-use');
            return false;
        });

        $('.family-account__show-terms-of-use').on('click', function(){
            GetNonLoggedCheckoutController.showTermsOfUse('.family-account__terms-of-use');
            return false;
        });

        $('#club-smiles__terms-of-use__checkbox:visible, #family-account__terms-of-use__checkbox:visible, #cardTermsAgreement:visible').on('change', function(event){
            GetNonLoggedCheckoutController.validateCheckbox(event);
        });
    },    
    assignScopeVariables:function(){
        GetNonLoggedCheckoutController.cardNumber 		            = $('#cardNumber');
        GetNonLoggedCheckoutController.cardCvc 		            = $('#cardCvc');
        GetNonLoggedCheckoutController.cardHolderName 	            = $('#cardHolderName');
        GetNonLoggedCheckoutController.cardDataYear	            = $('#cardDataYear');
        GetNonLoggedCheckoutController.cardDataMonth	            = $('#cardDataMonth');
        GetNonLoggedCheckoutController.currentYear		            = $('#currentYear');
        GetNonLoggedCheckoutController.installments 	            = $('#installmentSelect');
        GetNonLoggedCheckoutController.cardBrand                   = $('#brand');
        GetNonLoggedCheckoutController.cardBrandIcon               = $('#smls-card-icon');
        GetNonLoggedCheckoutController.cardCode                    = $('#cardCode');
        GetNonLoggedCheckoutController.saveCard                    = $('#saveCard');
        GetNonLoggedCheckoutController.useSavedCard                = $('#useSavedCard');
        GetNonLoggedCheckoutController.smilesPassword	            = $('#smilesPassword');
        GetNonLoggedCheckoutController.cardTermsAgreement	        = $('#cardTermsAgreement');
        GetNonLoggedCheckoutController.exceptionalPayment          = $('#exceptionalPayment');
        GetNonLoggedCheckoutController.typeCheckout                = $('#typeCheckout');
        GetNonLoggedCheckoutController.cardRulePaymentType         = $('#cardRulePaymentType');
        GetNonLoggedCheckoutController.installmentSelectDiv        = $('#installmentSelectDiv');
        GetNonLoggedCheckoutController.familyAccountTerms          = $('#familyAccountTermsAgreement');
    },
    configCardTypeDetection : function() {
            var element = $('#cardNumber')[0];
            var updateCardTypeDetection = adyen.CardTypeDetection.getHandler( function(brand, brandName) {
                console.log('brand');
                console.log(brand);
                console.log(brandName);
                if(brandName !== undefined && brandName !== '' && brandName !== null){
                    brandName = brandName.toUpperCase();
                    brandName = brandName.replace(" ", "_");
                    if(brandName === "HIPERCARD"){
                        GetNonLoggedCheckoutController.changeIconCard("hipercard") ;
                    }
                    if(brandName === "DINERS_CLUB"){
                        GetNonLoggedCheckoutController.changeIconCard("diners") ;
                    }
                    if(brandName === "ELO"){
                        GetNonLoggedCheckoutController.changeIconCard("elo") ;
                    }
                    if(brandName === "VISA"){
                        GetNonLoggedCheckoutController.changeIconCard("visa") ;
                    }
                    if(brandName === "DISCOVER"){
                        if(isElo(element.value)){
                            brandName = 'ELO';
                            GetNonLoggedCheckoutController.changeIconCard("elo") ;
                        }else{
                            GetNonLoggedCheckoutController.changeIconCard("discover") ;
                        }
                    }
                    if(brandName === "AMERICAN_EXPRESS"){
                        brandName = "AMEX";
                        GetNonLoggedCheckoutController.isCvcMoreThenThreeChars = true;
                        GetNonLoggedCheckoutController.changeIconCard("amex") ;
                    }
                    if (brandName === "MASTERCARD") {
                        var cardNumber = element.value;
                        if (cardNumber.indexOf('542661') === 0 || cardNumber.indexOf('545053') === 0 || 
                            cardNumber.indexOf('514895') === 0 || cardNumber.indexOf('510147') === 0 ||
                            cardNumber.indexOf('512427') === 0 || cardNumber.indexOf('514911') === 0) {
                            brandName = 'MASTERCARD_SMILES';
                            GetNonLoggedCheckoutController.changeIconCard("smiles-card") ;
                        }else{
                            GetNonLoggedCheckoutController.changeIconCard("mastercard") ;
                        }
                    }
                    GetNonLoggedCheckoutController.cardBrand.val(brandName);
                }else{
                    if(GetNonLoggedCheckoutController.cardBrand.length){
                        GetNonLoggedCheckoutController.cardBrand.val('');
                    }
    
                    if(GetNonLoggedCheckoutController.cardBrandIcon !== null){
                        GetNonLoggedCheckoutController.changeIconCard("default") ;
                    }
                }
            });
            console.log('element');
            console.log(element);

            if(element !== null && typeof element != 'undefined'){
                element.addEventListener('input', updateCardTypeDetection, false );
            }
    
            updateCardTypeDetection( {
                target : element
            } );
            
            // GetNonLoggedCheckoutController.loadInstallmentSelect();
        },
        changeIconCard:function(id){
            var iconClass = "cards " + id ;
            $(GetNonLoggedCheckoutController.cardBrandIcon).removeClass();
            $(GetNonLoggedCheckoutController.cardBrandIcon).addClass(iconClass);
        },
         //Carregamento das regras de formulário de pagamento
        loadPaymentFormRules : function(){
            if(GetNonLoggedCheckoutController.cardRulePaymentType.val() === '' || GetNonLoggedCheckoutController.cardRulePaymentType.val() !== 'miles'){
                GetNonLoggedCheckoutController.cardRule = [
                    {'name' : 'cardNumber','value': GetNonLoggedCheckoutController.cardNumber.val(),'lengthMin':10,'lengthMax':20,'type':'integer','bigger':0,'less':0},
                    {'name' :'cardCvc','value': GetNonLoggedCheckoutController.cardCvc.val(),'lengthMin':(GetNonLoggedCheckoutController.isCvcMoreThenThreeChars === false ? 3 : 4),'lengthMax':4,'type':'integer','bigger':0,'less':0},
                    {'name' :'cardHolderName','value': GetNonLoggedCheckoutController.cardHolderName.val(),'lengthMin':3,'lengthMax':50,'type':'letternumber'},
                    {'name' :'cardDataYear', 'value': GetNonLoggedCheckoutController.cardDataYear.val(),'lengthMin':4,'lengthMax':4,'type':'integer','bigger': GetNonLoggedCheckoutController.currentYear.val(),'less':0},
                    {'name' :'cardDataMonth', 'value': GetNonLoggedCheckoutController.cardDataMonth.val(),'lengthMin':2,'lengthMax':2,'type':'integer','bigger':1,'less':12},
                    {'name' :'installments','value': GetNonLoggedCheckoutController.installments.val(),'lengthMin':1,'lengthMax':2,'type':'integer','bigger':0,'less':0}
                ];
                if(GetNonLoggedCheckoutController.cardRulePaymentType.val() === 'money_miles' || GetNonLoggedCheckoutController.exceptionalPayment.val()){
                    GetNonLoggedCheckoutController.cardRule.push({'name' :'smilesPassword', 'value': GetNonLoggedCheckoutController.smilesPassword.val(),'lengthMin':4,'lengthMax':4,'type':'letternumber'});
                } if (GetNonLoggedCheckoutController.exceptionalPayment.val() || GetNonLoggedCheckoutController.familyAccountTerms.length > 0) {
                    GetNonLoggedCheckoutController.cardRule.push({'name': 'cardTermsAgreement' ,'value': GetNonLoggedCheckoutController.cardTermsAgreement.prop("checked") ,'type':'boolean'});
                }
            } else if(GetNonLoggedCheckoutController.cardRulePaymentType.val() === 'miles'){
                GetNonLoggedCheckoutController.cardRule = [{'name' : 'smilesPassword','value': GetNonLoggedCheckoutController.smilesPassword.val(),'lengthMin':4,'lengthMax':4,'type':'letternumber'}];
            }
    
            if(GetNonLoggedCheckoutController.familyAccountTerms.length > 0){
                GetNonLoggedCheckoutController.cardRule.push({'name' :'familyAccountTermsAgreement','value': GetNonLoggedCheckoutController.familyAccountTerms.prop("checked") ,'type':'boolean'});
            }
        },
        //Valida regra do formulário de pagamento
        applyPaymentFormRule : function(rule){
        var data = rule.value;
        if(rule.type === 'integer'){
            if(data === undefined) {
                data = "";
            }	
            data = data.toString().replace(/[^0-9]/g, '');        		
            if((data < rule.bigger) || (rule.less > 0 && data > rule.less)) {
                return false;
            }
        }
        if(rule.type === 'letternumber') {
            data = data.toString().replace(/[^0-9 a-z A-Z]/g, '');
        }
        if(rule.type === 'boolean') {
            return data;
        }
        return data.toString().length >= rule.lengthMin && data.toString().length <= rule.lengthMax;
        },
        //Valida o formulário de pagamento
        validatePaymentFormRules : function(){
            var valid = true;
            $.each(GetNonLoggedCheckoutController.cardRule, function(index, rule){
                if(!(GetNonLoggedCheckoutController.applyPaymentFormRule(rule))){
                    valid = false;
                    if(GetNonLoggedCheckoutController.cardBrand.val() === ''){
                        smiles.portal.CommomValidators.controller
                            .makeFieldInvalid(GetNonLoggedCheckoutController.installments, GetNonLoggedCheckoutController.cardNumber);
                    }
                    if(rule.name === "cardDataYear"){
                        smiles.portal.CommomValidators.controller.makeFieldInvalid(GetNonLoggedCheckoutController.cardDataYear);
                    }
                    if(rule.name === "cardDataMonth"){
                        smiles.portal.CommomValidators.controller.makeFieldInvalid(GetNonLoggedCheckoutController.cardDataMonth);
                    }
                    if(rule.name === "cardTermsAgreement") {
                        smiles.portal.CommomValidators.controller.makeFieldInvalid(GetNonLoggedCheckoutController.cardTermsAgreement);
                    }
    
                    if(rule.name === "familyAccountTermsAgreement"){
                        smiles.portal.CommomValidators.controller.makeFieldInvalid(GetNonLoggedCheckoutController.familyAccountTerms);
                    }
    
                    if(GetNonLoggedCheckoutController.smilesPassword.length && GetNonLoggedCheckoutController.smilesPassword.val() === ''){
                        smiles.portal.CommomValidators.controller.makeFieldInvalid(GetNonLoggedCheckoutController.smilesPassword);
                    }
                    smiles.portal.CommomValidators.controller.makeFieldInvalid($('#' + rule.name));
                } else{
                    if(rule.name === 'cardNumber' && GetNonLoggedCheckoutController.cardBrand.val() !== ''){
                        smiles.portal.CommomValidators.controller.makeFieldValid(GetNonLoggedCheckoutController.cardNumber);
                    } else if(rule.name === 'cardTermsAgreement') {
                        smiles.portal.CommomValidators.controller.makeFieldValid(GetNonLoggedCheckoutController.cardTermsAgreement);
                    } else if(rule.name === 'familyAccountTermsAgreement') {
                        smiles.portal.CommomValidators.controller.makeFieldValid(GetNonLoggedCheckoutController.familyAccountTerms);
                    } else if(rule.name === 'smilesPassword'){
                        smiles.portal.CommomValidators.controller.makeFieldValid(GetNonLoggedCheckoutController.smilesPassword);
                    } else {
                        smiles.portal.CommomValidators.controller.makeFieldValid($('#' + rule.name));
                    }
                }
            });
            return valid;
        },
    
        //Valida se os dados
        validateCardData : function(){
            var validData = false;
            GetNonLoggedCheckoutController.loadPaymentFormRules();
            if(GetNonLoggedCheckoutController.validatePaymentFormRules()) {
                validData = true;
    
                var cardData = {
                    number 		   : GetNonLoggedCheckoutController.cardNumber.val(),
                    cvc 		   : GetNonLoggedCheckoutController.cardCvc.val(),
                    holderName 	   : GetNonLoggedCheckoutController.cardHolderName.val(),
                    expiryMonth    : GetNonLoggedCheckoutController.cardDataMonth.val(),
                    expiryYear 	   : GetNonLoggedCheckoutController.cardDataYear.val()
                };
    
                if(GetNonLoggedCheckoutController.cardRulePaymentType.val() !== 'miles') {
                    var encryptedData = GetNonLoggedCheckoutController.cseInstance.validate(cardData);
                    validData = encryptedData.valid;
                }
            }
    
            return  validData;
        },
    
        // Executa o encrypt dos dados usando a chave Adyen
        encryptFormData : function(){
            var cardHolderNameValue = '';
            if(GetNonLoggedCheckoutController.cardHolderName.val() !== '') {
                cardHolderNameValue = GetNonLoggedCheckoutController.cardHolderName.val().toUpperCase();
            }
            
            var cardData = {
                number 		   : GetNonLoggedCheckoutController.cardNumber.val(),
                cvc 		   : GetNonLoggedCheckoutController.cardCvc.val(),
                holderName 	   : cardHolderNameValue,
                expiryMonth    : GetNonLoggedCheckoutController.cardDataMonth.val(),
                expiryYear 	   : GetNonLoggedCheckoutController.cardDataYear.val(),
                generationtime : GetNonLoggedCheckoutController.toEncryptDateTime
            };
            return 'adyen-encrypted-data":"'+GetNonLoggedCheckoutController.cseInstance.encrypt(cardData);
        },
    //TRATA O NOME DO PRODUTO
    changeNameProduct : function(name){
        if(name === 'PURCHASE') return GetNonLoggedCheckoutController.msgPurchase;
        if(name === 'TRANSFER')return GetNonLoggedCheckoutController.msgTransfer;
        if(name === 'REVALIDATION')return GetNonLoggedCheckoutController.msgRevalidate;
  
    },

    ////////////////////////////
    //   FUNCOES DO TOOLTIP   //
    ////////////////////////////

    //TOOLTIP START
    tooltipStart : function(){
        $("#tooltipBorder").hide();
        $("#tooltipBorderMobile").hide();

    },

    //TOOLTIP EXIBICAO
    tooltipShow : function(){
        GetNonLoggedCheckoutController.tooltip = 3;
        $("#tooltipBorder").show();
        $("#tooltipBorderMobile").show();
    },

    //TOOLTIP ESCONDER
    tooltipHide : function(){
        if(GetNonLoggedCheckoutController.tooltip === 2){
            $("#tooltipBorderMobile").hide();
            $("#tooltipBorder").hide();
        }
        GetNonLoggedCheckoutController.tooltip = 2;
    },

    //TOOLTIP EXIBICAO MOBILE
    tooltipShowMobile : function(){
        GetNonLoggedCheckoutController.tooltip = 3;
        $("#tooltipBorderMobile").show();
    },

    //TOOLTIP VIAJE FACIL
    tooltipViajeFacilInfo : function(){
        var easyTravelElem = $('.tooltip-east-travel-info');
        if(easyTravelElem.css('visibility') === 'hidden'){
            easyTravelElem.css({'visibility':'visible'});
        }else{
            easyTravelElem.css({'visibility':'hidden'});
        }
    },

    getBrandOneClickOrNewCard: function(){
    	var brandSavedCardFilled = $('input[name=member-card]:checked') !== null && $('input[name=member-card]:checked').data('brand');
    	var cardBrand = brandSavedCardFilled ? $('input[name=member-card]:checked').data('brand') : GetNonLoggedCheckoutController.cardBrand.val();
    	return cardBrand;
    },

    //PARCELAMENTO DE ACORDO COM A BANDEIRA
    loadBrandInstallments : function(getCheckoutString, brandCard){

        var getCheckout = null;
        if (typeof getCheckoutString === 'string') {
        	getCheckout = jQuery.parseJSON(getCheckoutString);
        } else {
        	getCheckout = getCheckoutString;
        }

        this.installments.children().remove();

        for(var i = 0; i < (getCheckout.creditCardOptionList.length); i++) {
        	if (brandCard == getCheckout.creditCardOptionList[i].brand) {
        		installmentOptionList = getCheckout.creditCardOptionList[i].installmentOptionList;
        		for (var j = 0; j < installmentOptionList.length; j++) {
                    $('#installmentSelect').append('<option value="'+ (j + 1) +'">'+ (j + 1) +' Parcelas</option>');
                    if (j == 0) {
                        $('#installmentSelect option[value="1"]').html(accounting.formatMoney(installmentOptionList[j].total, GetNonLoggedCheckoutController.msgMonetary, 2, '.', ',')  + " " + GetNonLoggedCheckoutController.msgavista);
                    }
        		}
        		break;
        	}
        }
    },
    
    loadBrandInstallmentsForClub : function(getCheckoutString, brandCard){
    	var installmentList = null;
        var getCheckout = null;
        if (typeof getCheckoutString === 'string') {
        	getCheckout = jQuery.parseJSON(getCheckoutString);
        } else {
        	getCheckout = getCheckoutString;
        }
        
        this.installments.children().remove();

        for(var i = 0; i < getCheckout.creditCardOptionList.length; i++) {
            if(brandCard === getCheckout.creditCardOptionList[i].brand) {
                installmentList = getCheckout.creditCardOptionList[i];

            	if(GetNonLoggedCheckoutController.extractClubFromCheckout() && 
            			GetNonLoggedCheckoutController.extractClubFromCheckout().subType == 'ANNUAL_PARCELLED') {
            		$('#installmentSelect').append('<option value="1">' + Liferay.Language.get('smiles.checkout.label.select.installs') + '</option>');
            	}

                for(var x = 0; x < installmentList.installmentOptionList.length; x++) {
                	var optionText = null;
                	if (installmentList.installmentOptionList.length===1) {
                		optionText = Liferay.Language.get('label.checkout.in.cash') + ' ' + ' - '; 
                	} else {
                		optionText = Liferay.Language.get('label.checkout.parcelled') + ' ' + installmentList.installmentOptionList[x].quantity + 'X - '; 
                	}              	
                	var optionIndex = installmentList.installmentOptionList[x].quantity;
                	$('#installmentSelect').append('<option value="' + optionIndex + '">' + optionText + accounting.formatMoney(installmentList.installmentOptionList[x].installmentList[0], GetNonLoggedCheckoutController.msgMonetary, 2, '.', ',') + '</option>');
                }
            }
        }
    },

    //CRIA PARCELAS A PARTIR DA BANDEIRA E VERIFICA REGRAS
    loadInstallmentSelect : function(){
        var optionsQuantity = 0;

        var newBrandCardFilled = GetNonLoggedCheckoutController.cardBrand.val() !== null && GetNonLoggedCheckoutController.cardBrand.val();

        var brandSavedCardFilled = $('input[name=member-card]:checked') !== null && $('input[name=member-card]:checked').data('brand');

        if(newBrandCardFilled || brandSavedCardFilled){
        	var cardBrand;
        	var cardBrandValid = false;

        	if (newBrandCardFilled) {
        		var cardNumberCheck = GetNonLoggedCheckoutController.cardNumber.val();
        		cardNumberCheck = cardNumberCheck.toString().replace(/[^0-9]/g, '');

                cardBrandValid = 
                    (GetNonLoggedCheckoutController.cardBrand.val() === 'AMEX' && cardNumberCheck.length === 15) || 
                    (GetNonLoggedCheckoutController.cardBrand.val() === 'DINERS_CLUB' && cardNumberCheck.length === 14) || 
                    (cardNumberCheck.length === 16);

        		cardBrand = GetNonLoggedCheckoutController.cardBrand.val();
        	} else if (brandSavedCardFilled) {
        		cardBrandValid = true;
        		cardBrand = $('input[name=member-card]:checked').data('brand');
        	}

            if(cardBrandValid) {
            	if(GetNonLoggedCheckoutController.typeCheckout.val() != 'AndClub' && GetNonLoggedCheckoutController.typeCheckout.val() != 'club.upgrade'){ 
                    GetNonLoggedCheckoutController.loadBrandInstallments(GetNonLoggedCheckoutController.getJSON, cardBrand);
                } else {
                	GetNonLoggedCheckoutController.loadBrandInstallmentsForClub(GetNonLoggedCheckoutController.getJSON, cardBrand);
                }

                if (typeof GetNonLoggedCheckoutController.getJSON === 'string') {
                    GetNonLoggedCheckoutController.getJSON = jQuery.parseJSON(GetNonLoggedCheckoutController.getJSON);
                }

                GetNonLoggedCheckoutController.loadInstallmentDescription(GetNonLoggedCheckoutController.getJSON, cardBrand);
                for(var i = 0; i < GetNonLoggedCheckoutController.getJSON.creditCardOptionList.length; i++) {
                    if(cardBrand === GetNonLoggedCheckoutController.getJSON.creditCardOptionList[i].brand){
                        installmentList = GetNonLoggedCheckoutController.getJSON.creditCardOptionList[i];
                        optionsQuantity = installmentList.installmentOptionList.length;
                    }
                }
                if(optionsQuantity <= 2) {
                    GetNonLoggedCheckoutController.installments.children().hide();
                    GetNonLoggedCheckoutController.installments.val(1);
                }
            } else {
                GetNonLoggedCheckoutController.clearAll();
            }
        } else {
            GetNonLoggedCheckoutController.clearAll();
        }
    },

    //LIMPA CAMPOS E PARCELAS
    clearAll : function(){
        GetNonLoggedCheckoutController.cardBrand.val('');
        $('#installmentSelect').html('');
        $('#installmentDescripition').html('');
        $('#installments-table').hide();
        $('#installmentSelect').append('<option value="1">' + GetNonLoggedCheckoutController.msgNumParcels + '</option>');
        GetNonLoggedCheckoutController.installments.val(1);
    },

    changeButtonMiles : function(){
        $('#btn-miles').addClass('active');
        $('#btn-money').removeClass('active');
    },

    changeButtonMoney : function(){
        $('#btn-money').addClass('active');
        $('#btn-miles').removeClass('active');
    },

    chooseTicketIssue : function(){
        $('#div-ticket-issue').addClass('active');
        $('#div-your-ticket').removeClass('active');
        $('#div-easy-travel').removeClass('active');
    },

    chooseYourTicket : function(){
        $('#div-ticket-issue').removeClass('active');
        $('#div-your-ticket').addClass('active');
        $('#div-easy-travel').removeClass('active');
        $('#acceptEasyTravel').css('display', 'none');
    },

    chooseEasyTravel : function(){
        $('#div-ticket-issue').removeClass('active');
        $('#div-your-ticket').removeClass('active');
        $('#div-easy-travel').addClass('active');
        $('#reserve').css('display', 'none');
    },

    showDivPayWithMiles : function(){
        $('#div-pay-with-miles').show();
    },

    hideDivPayWithMiles : function(){
        $('#div-pay-with-miles').hide();
    },

    loadInstallmentDescription: function(getCheckoutString, brandCard) {
        var installmentList = null;
        var cardCode = null;
        var htmlInstallment = '';
        var installment =  GetNonLoggedCheckoutController.installments.val();
        var getCheckout = null;
        if (typeof getCheckoutString === 'string') {
        	getCheckout = jQuery.parseJSON(getCheckoutString);
        } else {
        	getCheckout = getCheckoutString;
        }

        if(installment !== null) {
            installment = parseInt(installment);
        }

        for(var i = 0; i < getCheckout.creditCardOptionList.length; i++) {
            if(brandCard === getCheckout.creditCardOptionList[i].brand) {
                installmentList = getCheckout.creditCardOptionList[i];

                if(GetNonLoggedCheckoutController.exceptionalPayment.val() && GetNonLoggedCheckoutController.typeCheckout.val() !== 'milesLoan') {
                	cardCode = getCheckout.creditCardOptionList[i].cardCode;
                    $('#cardCode').val(cardCode);
                }

                for(var x = 0; x < installmentList.installmentOptionList.length; x++) {

                    if(installmentList.installmentOptionList[x].quantity === installment) {
                        for(var z = 0; z < installmentList.installmentOptionList[x].installmentList.length; z++){
                            if(installment === 1){
                                htmlInstallment += '<li class=""><p>'+GetNonLoggedCheckoutController.msgavista+' '+accounting.formatMoney(installmentList.installmentOptionList[x].installmentList[z], GetNonLoggedCheckoutController.msgMonetary, 2, '.', ',')+'</p></li>';
                            }else{
                                htmlInstallment += '<li class=""><p>'+(z + 1)+'&ordf; '+accounting.formatMoney(installmentList.installmentOptionList[x].installmentList[z], GetNonLoggedCheckoutController.msgMonetary, 2, '.', ',')+'</p></li>';
                            }
                        }
                    }

                    //Altera o texto das parcelas com o texto correto
                    if(GetNonLoggedCheckoutController.exceptionalPayment.val() && GetNonLoggedCheckoutController.typeCheckout.val() !== 'milesLoan') {
                        var optionValue = installmentList.installmentOptionList[x].quantity;
                    	var optionText  = '';
                        if(installmentList.installmentOptionList[x].interestRate > 0) {                            
                            optionText = x === 0 ? GetNonLoggedCheckoutController.msgavista : optionValue + 'x ' + Liferay.Language.get('PAYMENT.OPTIONS.WITH.INTEREST') + '(' + installmentList.installmentOptionList[x].interestRate + '%)';
                        } else {                            
                            optionText = x === 0 ? GetNonLoggedCheckoutController.msgavista : optionValue + 'x ' + Liferay.Language.get('PAYMENT.OPTIONS.WITHOUT.INTEREST');
                        }
                        $('#installmentSelect option[value="' + optionValue + '"]').html(optionText);
                    }
                 }
            }
        }        

        if(GetNonLoggedCheckoutController.typeCheckout.val() != 'AndClub' && GetNonLoggedCheckoutController.typeCheckout.val() != 'club.upgrade'){
        	$('#installmentDescripition').html(htmlInstallment);
        }
        if (GetNonLoggedCheckoutController.typeCheckout.val() !== 'milesLoan') {
            GetNonLoggedCheckoutController.loadInstallmentDetail(GetNonLoggedCheckoutController.getJSON, brandCard, installment);
            $('#actualInstallment').val(1);
        }
    	if(GetNonLoggedCheckoutController.typeCheckout.val() == 'AndClub' || GetNonLoggedCheckoutController.typeCheckout.val() == 'club.upgrade'){
    		// remove descrições da opção 'Selecione as parcelas'
        	if(GetNonLoggedCheckoutController.extractClubFromCheckout() && 
        			GetNonLoggedCheckoutController.extractClubFromCheckout().subType == 'ANNUAL_PARCELLED') {    		
        		if(GetNonLoggedCheckoutController.installments.val() == 1) {
        			$('#installments-table tbody').html('');
    		    }
        	}
        }
    },

    loadInstallmentDetailNameItem : function(objeto){
        if(objeto.booking && objeto.booking !== null){
            if(objeto.booking.flight){
                // return Liferay.Language.get('product.name.tickets');
                return "Bilhetes";
            }else if(objeto.booking.seats){
                // return Liferay.Language.get('label.seats');
                return "Assentos";
            }else if(objeto.booking.cancelation){
                // return Liferay.Language.get('label.cancelation');
                return "Cancelamento";
            }else if(objeto.booking.baggage) {
                // return Liferay.Language.get('product.name.baggage');
                return "Bagagem";
            }
        } else {
        	if(objeto.fee && objeto.fee !== null){
        		if(objeto.fee.type === 'RESERVATION'){
        			return Liferay.Language.get('label.order.summary.taxes.reservation');
                }else if(objeto.fee.type === 'BOARDING'){
                	return Liferay.Language.get('label.order.summary.taxes');
                }else if(objeto.fee.type === 'NO_MILES_BOOKING'){
                	return Liferay.Language.get('label.flight.easyTravel.title');
                }else if(objeto.fee.type === 'CONVENIENCE'){
                	return Liferay.Language.get('label.service.title.CONVENIENCE');
                }else if(objeto.fee.type === 'SPECIAL_SERVICE'){
                	return Liferay.Language.get('smiles.gift.resume.services.special');
                }else if(objeto.fee.type === 'CANCELLATION'){
                	return Liferay.Language.get('label.cancelation');
                }
        	} else if (objeto.clubVO && objeto.clubVO !== null) {
        		return Liferay.Language.get('label.smiles.club');
        	} else if (objeto.productVO !== null && objeto.productVO.type !== null && objeto.productVO.type === 'UBER_CREDIT') {
        		return Liferay.Language.get('label.uber.accrual.checkout.credits');
        	}
        }
    },

    loadInstallmentDetail: function(getCheckout, brandCard, installment){
        if (!GetNonLoggedCheckoutController.exceptionalPayment.val()){
            var installmentList = '';
            var htmlInstallment = '<tr><th>'+ GetNonLoggedCheckoutController.msgItem +'</th>';
            var htmlTotalInstallments = '<tr><td><p>Total</p></td>';

            for(th = 1; th <= installment; th++){
                if(installment === 1){
                    htmlInstallment += '<th>'+ GetNonLoggedCheckoutController.msgavista +'</th>';
                }else{
                    htmlInstallment += '<th class="installment-'+ th +'">'+th+'&ordf;</th>';
                }
            }
            var itensinstallments = '';
            for(var itens = 0; itens < getCheckout.itemList.length; itens++){
                var title = true;
                for(var credit = 0; credit < getCheckout.itemList[itens].creditCardOptionList.length; credit++){
                    if(getCheckout.itemList[itens].creditCardOptionList[credit].brand === brandCard){
                        var maxinstallments = 1;
                        var td = 0;
                        for(var inst = 0; inst < getCheckout.itemList[itens].creditCardOptionList[credit].installmentOptionList.length; inst++){
                            if(getCheckout.itemList[itens].creditCardOptionList[credit].installmentOptionList[inst].quantity <= installment){
                                maxinstallments = getCheckout.itemList[itens].creditCardOptionList[credit].installmentOptionList[inst].quantity;
                            }
                        }

                        if(title === true){
                            title = false;
                            if(getCheckout.itemList[itens].miles !== null && getCheckout.itemList[itens].miles !== undefined){
                                itensinstallments += '<tr><td>'+GetNonLoggedCheckoutController.changeNameProduct(getCheckout.itemList[itens].miles.operation)+'&nbsp;<span class="color999">(at&eacute;&nbsp;'+maxinstallments+'x)</span></td>';
                            }else if(getCheckout.itemList[itens] !== null ){
                                itensinstallments += '<tr><td>'+GetNonLoggedCheckoutController.loadInstallmentDetailNameItem(getCheckout.itemList[itens])+'&nbsp;<span class="color999">(at&eacute;&nbsp;'+maxinstallments+'x)</span></td>';
                            }
                        }

                        for(var insta = 0; insta < getCheckout.itemList[itens].creditCardOptionList[credit].installmentOptionList.length; insta++){
                            if(getCheckout.itemList[itens].creditCardOptionList[credit].installmentOptionList[insta].quantity === maxinstallments){
                                for(var x = 0; x < getCheckout.itemList[itens].creditCardOptionList[credit].installmentOptionList[insta].installmentList.length; x++){
                                    itensinstallments += '<td class="installment-'+ (x + 1) +'">'+accounting.formatMoney(getCheckout.itemList[itens].creditCardOptionList[credit].installmentOptionList[insta].installmentList[x], GetNonLoggedCheckoutController.msgMonetary, 2, '.', ',')+'</td>';
                                }
                            }
                            td = installment - maxinstallments;
                        }

                        for(insta = 0; insta < td; insta++){
                            itensinstallments += '<td>&nbsp;</td>';
                        }
                    }
                }
            }

            
            for(var ii = 0; ii < getCheckout.creditCardOptionList.length; ii++){
                if(brandCard === getCheckout.creditCardOptionList[ii].brand){
                    for(var xx = 0; xx < getCheckout.creditCardOptionList[ii].installmentOptionList.length; xx++){
                        if(parseInt(getCheckout.creditCardOptionList[ii].installmentOptionList[xx].quantity) === installment){
                            for(var zz = 0; zz < getCheckout.creditCardOptionList[ii].installmentOptionList[xx].installmentList.length; zz++){
                                htmlTotalInstallments += '<td class="installment-'+ (zz + 1) +'">'+accounting.formatMoney(getCheckout.creditCardOptionList[ii].installmentOptionList[xx].installmentList[zz], GetNonLoggedCheckoutController.msgMonetary, 2, '.', ',')+'</td>';
                            }
                        }
                    }
                }
            }
            
            htmlInstallment       += '</tr>';
            itensinstallments     += '</tr>';
            htmlTotalInstallments += '</tr>';
            
            $('#installments-table tbody').html('');
            $('#installments-table tbody').append(htmlInstallment);
            $('#installments-table tbody').append(itensinstallments);
            $('#installments-table tbody').append(htmlTotalInstallments);

            smiles.portal.InstallmentsTooltip.controller.updateInstallmentsNumber();
        }
    },

    isUseSavedCard: function(){
    	return GetNonLoggedCheckoutController.useSavedCard.val() === 'true';
    },
    
    showErrorMessageAndScroolTo: function(errorMsg, targetScrool){
    	
        $('#alertaModaloadingairplane').modal('hide');
        
		var scroolAcceptEasyTravel =  function(){
			var target = jQuery(targetScrool);
			if (target.length) {
				jQuery('html,body').animate({
                    scrollTop: target.offset().top
				}, 1000);
			}	
        };

        $('#errorModal .modal-footer .btn').off();
        
        try {
            var modal = new smiles.portal.commons.Modal($('#errorModal'));
            modal.setMessageModalError(errorMsg);
            modal.setBehaviorModalError(
                function() {
                    scroolAcceptEasyTravel();
                }
            );
            modal.show();
        } catch (e) { console.error(e); }
    }
         
        

}
//MASCARA CARTAO
var maskCardNumber = function(object){
	$("#cardNumber").attr('maxlength','19');
    var cardNumber = object.value;
    cardNumber = cardNumber.toString().replace(/[^0-9]/g, '');
    if(cardNumber.length === 15){
        cardNumber = cardNumber.toString().replace(/\D/g,"");
        cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/,"$1 $2");
        cardNumber = cardNumber.toString().replace(/(\d{6})(\d)/,"$1 $2");
        cardNumber = cardNumber.toString().replace(/(\d{6})(\d)/,"$1 $2");
        object.value = cardNumber;
        document.getElementById('cardCvc').setAttribute('maxlength','4');

    } else {
        cardNumber = cardNumber.toString().replace(/\D/g,"");
        cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/,"$1 $2");
        cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/,"$1 $2");
        cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/,"$1 $2");
        cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/,"$1 $2");
        object.value = cardNumber;
        GetNonLoggedCheckoutController.cardCvc.attr('maxlength', '3');
        if(document.getElementById('cardCvc') !== '' || document.getElementById('cardCvc').value.length === 4){
            var cvcNumber = document.getElementById('cardCvc').value;
            cvcNumber = cvcNumber.substr(0, 3);
            document.getElementById('cardCvc').value = cvcNumber;
        }
    }
};

//REMOVE MASCARA CARTAO
var removeMaskCardNumber = function(object){
	$("#cardNumber").attr('maxlength','16');
    var cardNumber = object.value;
    cardNumber = cardNumber.toString().replace(/[^0-9]/g, '');
    object.value = cardNumber;
};

//SOMENTE NUMERO MOBILE
var numberOnlyMobile = function(object){
    var num = object.value;
    num = num.toString().replace(/\D/g,"");
    object.value = num;
};

//SOMENTE NUMERO
var numberOnly = function(e){
    var key   = e.keyCode || e.which;
    var value = String.fromCharCode(key);
    var regex = /\D/g;
    if(value.match(regex)){
        return (key === 8) || (key === 9) || (key === 46) || (key === 37) || (key === 38) || (key === 39) || (key === 40) || (key === 116) || (key === 123);
    }
};

	function isElo(cardNumber){
		if(cardNumber.length < 6) return false;
		var rangeElo = "651653,650901,650902,650903,650904,650905,650906,650907,650908,650909,650910,650911,650912,650913,650914,650915,650916,650917,650918,650919,650920,650031,650032,650033,650035,650036,650037,650038,650039,650040,650041,650042,650043,650044,650045,650046,650047,650048,650049,650050,650051,650485,650486,650487,650488,650489,650490,650491,650492,650493,650494,650495,650496,650497,650498,650499,650500,650501,650502,650503,650504,650505,650506,650507,650508,650509,650510,650511,650512,650513,650514,650515,650516,650517,650518,650519,650520,650521,650522,650523,650524,650525,650526,650527,650528,650529,650530,650531,650532,650533,650534,650535,650536,650537,650538,650541,650542,650543,650544,650545,650546,650547,650548,650549,650550,650551,650552,650553,650554,650555,650556,650557,650558,650559,650560,650561,650562,650563,650564,650565,650566,650567,650568,650569,650570,650571,650572,650573,650574,650575,650576,650577,650578,650579,650580,650581,650582,650583,650584,650585,650586,650587,650588,650589,650590,650591,650592,650593,650594,650595,650596,650597,650598,650700,650701,650702,650703,650704,650705,650706,650707,650708,650709,650710,650711,650712,650713,650714,650715,650716,650717,650718,650720,650721,650722,650723,650724,650725,650726,650727,651652,651653,651654,651655,651656,651657,651658,651659,651660,651661,651662,651663,651664,651665,651666,651667,651668,651669,651670,651671,651672,651673,651674,651675,651676,651677,651678,651679,655000,655001,655002,655003,655004,655005,655006,655007,655008,655009,655010,655011,655012,655013,655014,655015,655016,655017,655018,655019655021,655022,655023,655024,655025,655026,655027,655028,655029,655030,655031,655032,655033,655034,655035,655036,655037,655038,655039,655040,655041,655042,655043,655044,655045,655046,655047,655048,655049,655050,655051,655052,655053,655054,655055,655056,655057,655058,650405,650406,650407,650408,650409,650410,650411,650412,650413,650414,650415,650416,650417,650418,650419,650420,650421,650422,650423,650424,650425,650426,650427,650428,650429,650430,650431,650432,650433,650434,650435,650436,650437,650438,650439";
		return rangeElo.includes(cardNumber.substring(0, 5));
	
	}