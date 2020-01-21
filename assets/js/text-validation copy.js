function _validateEmail(email) {
  var reg = new RegExp('^(?:[a-z0-9]|\\.(?!\\.)|[_-])*[a-z0-9](?:\\+[a-z0-9][a-z0-9.-]*[a-z0-9])?@(?:(?:[a-z0-9]|-(?!-))+\\.)+[a-z]{2,}$', 'i');
  return reg.test(email);
}

function _validateDigits(value) {
  var reg = new RegExp('^[0-9\s+]+$', 'i');
  return reg.test(value);
}

function _validateFloat(value){
  var reg = new RegExp ('^[0-9]+(\.[0-9]+)?$');
  return reg.test(value);
}

function _validateMobile(value) {
  var reg = new RegExp('^(06|07)[0-9]{8}$', 'i');
  return reg.test(value);
}

function _validatePhone(value) {
  var reg = new RegExp('^(01|02|03|04|05|06|07|08|09)[0-9]{8}$', 'i');
  return reg.test(value);
}

function _displayError(bloc, type, messageOverwrite) {
  if (messageOverwrite === void 0) {
    messageOverwrite = null;
  }
  $bloc = bloc;
  var locale = (errorsTranslations[LANG] != undefined)  ? LANG : "en";
  var message = messageOverwrite || errorsTranslations[locale][type];
  $bloc.css({"borderColor":"#b94a48"});
  if ($bloc.parents('.control-group').length > 0) {
    if ($bloc.siblings('.help-inline').find('.text-error').length == 0) {
      $bloc.after("<span class='help-inline'><span class='text-error'>" + message + "</span></span>");
    } else {
      $bloc.siblings('.help-inline').find('.text-error').text(message);
    }
  } else {
    if ($bloc.siblings('.help-block').find('.text-danger').length == 0) {
      $bloc.after("<p class='help-block'><span class='text-danger'>" + message + "</span></p>");
    } else {
      $bloc.siblings('.help-block').find('.text-danger').text(message);
    }
  }
}

function _removeError(bloc) {
  $bloc = bloc;
  if ($bloc.parents('.control-group').length > 0) {
    $bloc.css({"borderColor":"#ccc"}).siblings(".help-inline").find('.text-error').closest('.help-inline').remove();
  } else {
    $bloc.css({"borderColor":"#ccc"}).siblings(".help-block").find('.text-danger').closest('.help-block').remove();
  }
}

errorsTranslations = {
  "fr": {
    "digits": "Numéro invalide",
    "float": "Numéro invalide. (Ex: 12.5 )",
    "email": "Email invalide",
    "phone-number": "Numéro invalide",
    "duplicate": "Veuillez renseigner 2 valeurs identiques"
  },
  "en": {
    "digits": "Invalid number",
    "float": "Invalid number. (Ex: 12.5)",
    "email": "Invalid e-mail",
    "phone-number": "Invalid number",
    "duplicate": "Please enter 2 identical values"
  },
  "it": {
    "digits": "Numero non valido",
    "float": "Numero non valido. (Ex: 12.5)",
    "email": "Email non valida",
    "phone-number": "Numero non valido",
    "duplicate": "Inserire 2 valori identici"
  },
  "es": {
    "digits": "Número no válido",
    "float": "Número no válido. (Ex: 12.5)",
    "email": "Correo electrónico no válido",
    "phone-number": "Número no válido",
    "duplicate": "Ingrese 2 valores idénticos"
  },
  "de": {
    "digits": "Ungültige Nummer",
    "float": "Ungültige Nummer. (Ex: 12.5)",
    "email": "Ungültige Email",
    "phone-number": "Ungültige Nummer",
    "duplicate": "Bitte geben Sie 2 identische Werte ein"
  },
  "pt": {
    "digits": "Number inválido",
    "float": "Number inválido. (Ex: 12.5)",
    "email": "Email inválido",
    "phone-number": "Number inválido",
    "duplicate": "Por favor, insira 2 valores idênticos"
  },
  "pl": {
    "digits": "Nieprawidłowy numer",
    "float": "Nieprawidłowy numer. (Ex: 12.5)",
    "email": "Nieprawidłowy email",
    "phone-number": "Nieprawidłowy numer",
    "duplicate": "Wprowadź 2 identyczne wartości"
  }
}

$(document).ready(function(){

  $(document).on('blur', "[data-text-validation*=digits]", function(e) {
    if($(this).val() != "" && !_validateDigits($(this).val())){
      _displayError($(this), "digits");
      $("[type=submit]").attr("disabled", true);
    } else {
      _removeError($(this));
      $("[type=submit]").attr("disabled", false);
    }
  });

  $(document).on('blur', "[data-text-validation*=float]", function(e) {
    if($(this).val() != "" && !_validateFloat($(this).val())){
      _displayError($(this), "float");
      $("[type=submit]").attr("disabled", true);
    } else {
      _removeError($(this));
      $("[type=submit]").attr("disabled", false);
    }
  });

  $(document).on('blur', "[data-text-validation*=lowercase]", function() {
    $(this).val(function (_, val) {
      return val.toLowerCase();
    });
  });

  $(document).on('blur', "[data-text-validation*=uppercase]", function() {
    $(this).val(function (_, val) {
      return val.toUpperCase();
    });
  });

  $(document).on('blur', "[data-text-validation*=capitalize]", function(e) {
    $(this).val($(this).val().toLowerCase().replace(/(?:[ -]|^)(.)/gi, function(letter) {
      return letter.toUpperCase();
    }));
  });

  $(document).on('blur', "[data-text-validation*=email]", function() {
    if ($(this).val() != "" && !_validateEmail($(this).val())) {
      _displayError($(this), "email");
      $("[type=submit]").attr("disabled", true);
    } else {
      _removeError($(this));
      $("[type=submit]").attr("disabled", false);
    }
  });

  $(document).on('blur', "[data-text-validation*=mobile]", function(e) {
    if($(this).val() != "" && !_validateMobile($(this).val())){
      _displayError($(this), "phone-number");
      $("[type=submit]").attr("disabled", true);
    } else {
      _removeError($(this));
      $("[type=submit]").attr("disabled", false);
    }
  });

  $(document).on('blur', "[data-text-validation*=phone]", function(e) {
    if($(this).val() != "" && !_validatePhone($(this).val())){
      _displayError($(this), "phone-number");
      $("[type=submit]").attr("disabled", true);
    } else {
      _removeError($(this));
      $("[type=submit]").attr("disabled", false);
    }
  });

  $(document).on('blur', "[data-duplicate]", function(){
    searchField = $(this).attr("data-duplicate");
    if ($(this).closest("[id*=linked-person]").length > 0) {
      linked_guest_index = $(this).closest("[id*=linked-person]").attr('id').split('linked-person-')[1];

      if ($('[name*=' + linked_guest_index + '\\]\\[guest_metadata\\[' + searchField + '\\]\\]]').length > 0) {
        var target = '[name*=' + linked_guest_index + '\\]\\[guest_metadata\\[' + searchField + '\\]\\]]';
      } else {
        var target = '[name*=' + linked_guest_index + '\\]\\[' + searchField + '\\]]';
      }
    } else {
      if ($('[name=guest\\[guest_metadata\\['+ searchField +'\\]\\]]').length > 0) {
        var target = '[name=guest\\[guest_metadata\\['+ searchField +'\\]\\]]';
      } else {
        var target = '[name=guest\\[' + searchField + '\\]]';
      }
    }
    searchValue = $(target).val();

    if ($(this).val() != "" && $(this).val() != searchValue) {
      if ($(this).attr("data-duplicate-error-" + LANG).length > 0) {
        _displayError($(this), "duplicate", $(this).attr("data-duplicate-error-" + LANG));
      } else { 
        _displayError($(this), "duplicate");
      }
      $("[type=submit]").attr("disabled", true);
    } else {
      _removeError($(this));
      $("[type=submit]").attr("disabled", false);
    }
  });
});
