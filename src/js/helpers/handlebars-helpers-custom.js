Handlebars.registerHelper ("convertToNumber", function(arg) {
    return parseInt(arg);
  });

Handlebars.registerHelper ("formatPercentage", function(arg) {
    return parseFloat(arg).toFixed(1)*100+"%";
  });

Handlebars.registerHelper ("lt", function(arg1,arg2) {
    return (arg1 < arg2 ?true:false);
  });

Handlebars.registerHelper ("gt", function(arg1,arg2) {
  return (arg1 > arg2 ?true:false);
  });
  
Handlebars.registerHelper ("geqt", function(arg1,arg2) {
  return (arg1 >= arg2 ?true:false);
  });

Handlebars.registerHelper ("leqt", function(arg1,arg2) {
  return (arg1 <= arg2 ?true:false);
  });


  
  Handlebars.registerHelper ("simplifyName", function(receiver) {
    var arrayReceiver = receiver.split(' ');
    var newName = '';
    console.log(arrayReceiver.length);
    for(i=0;i<arrayReceiver.length;i++){
        console.log(i)
        if(i==0){
            newName+=arrayReceiver[0]+" ";
        }else if(i>=arrayReceiver.length-1){
            newName+=arrayReceiver[arrayReceiver.length-1];
        }else{
            newName+=arrayReceiver[i].substr(0,1)+". "
        }
    }
    return newName;
  })

  Handlebars.registerHelper ("formatDate", function(arg) {
    var date = new Date(arg);
    var day = date.getDate()+1;
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    
    let StrDate =  [
      (day>9 ? '' : '0') + day,
      (month>9 ? '' : '0') + month,
      year
     ].join('/');

     return StrDate;
    
  });



  

Handlebars.registerHelper ("setVariables", function(args,index, type) {

  console.log(type);

  var varBonus =(args.miles.hasOwnProperty("milesBonus")?args.miles.milesBonus:0)
  var varQuantity = parseInt(args.miles.quantity);
  varBonus = parseInt(varBonus);

  if(GetNonLoggedCheckoutController.checkoutInfo["isClubMember"] && args.miles.hasOwnProperty("smilesClubMilesBonus")){ 
    if(args.miles.smilesClubMilesBonus>0){
      varBonus = parseInt(args.miles.smilesClubMilesBonus);
    }
  }
  GetNonLoggedCheckoutController.checkoutInfo.itemList[index]["varBonus"]=varBonus;

  switch(type){
    case "PURCHASE":
      GetNonLoggedCheckoutController.checkoutInfo.itemList[index]["varTotalMilhas"]=(varQuantity + varBonus);
      GetNonLoggedCheckoutController.checkoutInfo.itemList[index]["varPercentBonus"]=(varBonus / varQuantity);
    break;
    case "REVALIDATION":
      GetNonLoggedCheckoutController.checkoutInfo.itemList[index]["varTotalMilhas"]=(varQuantity +(varQuantity * (varBonus/100)));
      GetNonLoggedCheckoutController.checkoutInfo.itemList[index]["varPercentBonus"]=(varBonus / 100);
    break;
    case "TRANSFER":
      GetNonLoggedCheckoutController.checkoutInfo.itemList[index]["varTotalMilhas"]=(varQuantity *  (varBonus/100));
      GetNonLoggedCheckoutController.checkoutInfo.itemList[index]["varPercentBonus"]=(varBonus / 100);    
    break;

  }
    
  });