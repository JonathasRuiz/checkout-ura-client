;
var smiles    = smiles || {} ;
smiles.portal = smiles.portal || {};
smiles.portal.InstallmentsTooltip = {};

(function($, ns) {

    "use strict";

    ns.version = "1.0";

    ns.controller = {

        currentInstallment   : 1,
        lastInstallment      : 1,
        installmentsNumber   : 1,
        $installments        : undefined,
        $installmentsToggler : undefined,

        init : function init(installmentsNumber) {

            this.updateInstallmentsNumber();
            this.addListeners();
            this.managePager();

            this.$installments = $('.understand-installments');
            this.$installmentsToggler = $('.see-installments-table');
        },

        updateInstallmentsNumber : function updateInstallmentsNumber() {

            this.installmentsNumber = $('#installments-table th:last-child').attr('class');

			if (this.installmentsNumber !== undefined) {
				this.lastInstallment =
					$('#installments-table th:last-child').attr('class').split(' ')[0].match(/\d/g).join('');
            }
            $('#installments-table').show();

            this.managePager();
        },

        addListeners : function addListeners() {

            $('#next-installment').off().on('click', function() {
				smiles.portal.InstallmentsTooltip.controller.changeInstallmentPage('next'); });

			$('#previous-installment').off().on('click', function() {
				smiles.portal.InstallmentsTooltip.controller.changeInstallmentPage('prev'); });

            $(document).off().on('click', function(e){
                smiles.portal.InstallmentsTooltip.controller.closeInstallmentsWhenClickOutsideThem(e); });
        },

        changeInstallmentPage : function changeInstallmentPage(action) {

			$('[class^="installment-"]').hide();

			if (action === 'next' && this.currentInstallment < this.lastInstallment) {
				this.currentInstallment += 1;
			} else if (action === 'prev' && this.currentInstallment > 1) {
				this.currentInstallment -= 1;
			}

			$('.installment-' + this.currentInstallment).show();
        },

        closeInstallmentsWhenClickOutsideThem : function closeInstallmentsWhenClickOutsideThem(e) {

            if (this.clickOnInstallmentsOrHisChildrens(e) ||
                this.clickOnInstallmentsTogglerOrHisChildrensAndHeIsNotVisible(e)) {

                this.$installments.fadeIn();
            } else {
                this.$installments.fadeOut();
            }
        },

        clickOnInstallmentsOrHisChildrens : function clickOnInstallmentsOrHisChildrens(e) {

            return (e.target.className === this.$installments.attr('class') ||
                    $(e.target).is(this.$installments.find('*')));
        },

        clickOnInstallmentsTogglerOrHisChildrensAndHeIsNotVisible : function clickOnInstallmentsTogglerOrHisChildrensAndHeIsNotVisible(e) {

            return ((e.target.className === this.$installmentsToggler.attr('class') ||
                    $(e.target).is(this.$installmentsToggler.find('*'))) && !this.$installments.is(':visible'));
        },

        managePager : function managePager() {

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                if (this.installmentsNumber === undefined || this.installmentsNumber === 1) {
                    $('.understand-installments__pager').attr("style", "display: none !important");
                } else {
                    $('.understand-installments__pager').attr("style", "display: table-row !important");
                }
            }
        }
    };
})(jQuery, smiles.portal.InstallmentsTooltip);