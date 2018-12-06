var $ = require("jquery");

module.exports = class FormService {
  constructor() { }

  setNumberOnly(inputId) {
    $(inputId).on('keydown', (evt) => {
      var key = (evt.which) ? evt.which : event.keyCode
      if( key >= 48 && key <= 57 || // numbers
          key >= 96 && key <= 105 || // Numeric keypad
          key == 8 || key == 9 || key == 13 || // Backspace and Tab and Enter
          key == 35 || key == 36 || // Home and End
          key == 37 || key == 39 || // left and right arrows
          key == 46 || key == 45 // Del and Ins
        ) return true;
      else return false;
    });
  }

  setCardNumber(inputId) {
    this.setNumberOnly(inputId);
    $(inputId).on('blur', () => {
      $(inputId).attr('maxlength','19');
      var cardNumber = $(inputId).val();
      cardNumber = cardNumber.toString().replace(/[^0-9]/g, '');
      if(cardNumber.length === 15){
        cardNumber = cardNumber.toString().replace(/\D/g,"");
        cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/,"$1 $2");
        cardNumber = cardNumber.toString().replace(/(\d{6})(\d)/,"$1 $2");
        cardNumber = cardNumber.toString().replace(/(\d{6})(\d)/,"$1 $2");
        $(".cardCVC").attr('maxlength','4');
      } else {
        cardNumber = cardNumber.toString().replace(/\D/g,"");
        cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/,"$1 $2");
        cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/,"$1 $2");
        cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/,"$1 $2");
        cardNumber = cardNumber.toString().replace(/(\d{4})(\d)/,"$1 $2");
        $(".cardCVC").attr('maxlength','3');
      }
      $(inputId).val(cardNumber);
    });
    $(inputId).on('focus', () => {
      $(inputId).attr('maxlength','16');
      var cardNumber = $(inputId).val();
      cardNumber = cardNumber.toString().replace(/[^0-9]/g, '');
      $(inputId).val(cardNumber);
    });
  }

};
