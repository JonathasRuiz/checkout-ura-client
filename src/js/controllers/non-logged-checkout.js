var $ = require("jquery");

module.exports = (() => {
	var init = () => {
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
	};

	return {
		init: init
	};

})();
