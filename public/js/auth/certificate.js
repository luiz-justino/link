$(function() {

$('#btn-certificate').on('click', function(){
	$('#modalCertificate').modal();
});


$('#btn-login-certificate').on('click', function(){
	loginWithCertificate();
});

function loginWithCertificate() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var form = new FormData($('#form-login')[0]);
    var result = requestAjaxFiles('POST', '/login', form);
    if (result.status) {
        window.location.href = "/home";
    } else{
          var response = JSON.parse(result.data);
        addErrorValidate("form-login", result.data);   
      }
}

function storeSaleExternByEmail() {
    addLoading();

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    }); 

      var retorno = confirm("Deseja finalizar a assinatura de contrato?");

      if (retorno == true) {
        if (signaturePad.isEmpty() == false && $('#signature_URL').val() != null) {
          finish();
        }
      } else {
        removeLoading(2000);
      }

    clearErrorValidate("contract-create-form");
    setTimeout(function() {  
    var form = new FormData($('#contract-create-form')[0]);
    var result = requestAjaxFiles('POST', '/sale/storeSaleExternByEmail', form);
    if (result.status) {
        removeLoading(2000);
        // Fix message in screen
           toastr.options = {
                "closeButton": true,
                "timeOut": "0",
                "extendedTimeOut": "0",
            };
        // End     
        toastr.success(result.data.message);
    } else{
        removeLoading(2000);
     if(result.code == 422){
        toastr.error("Houve um erro no preenchimento dos dados, tente novamente!");
        var message = JSON.parse(result.data);
        addErrorValidate("contract-create-form", message);   
    } else if (result.code == 404) {
          var message = JSON.parse(result.data);
          toastr.error(message.statusErr);        
      } else if (result.code == 'timeout' || result.code == 408) {
            toastr.error("Erro na conexão de internet, tente novamente!");
      } else {
          var response = JSON.parse(result.data);
          toastr.error(response.message);  
        addErrorValidate("contract-create-form", result.data);        
      }

    }
    }, 500);
}

function sendEmailAdministrator(id, _token) {
    addLoading();
    setTimeout(function () {
        var result = requestAjax("POST", "/sale/sendEmailAdministrator/" + id, {
                _token
            });
        if (result.status) {
            removeLoading(2000);
            toastr.success(result.data.status);
        }
    }, 500);
}

function sendEmailAdministratorWithoutAuth(id, _token) {
    addLoading();
    setTimeout(function () {
        var result = requestAjax("POST", "/sale/sendEmailAdministratorWithoutAuth/" + id, {
                _token
            });
        if (result.status) {
            removeLoading(2000);
            toastr.success(result.data.status);
        }
    }, 500);
}


});