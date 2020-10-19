$(document).ready(function() {
  $navbar = $('ul.nav.navbar-nav');
  $navbar.find('li').each(function() {
    $highlight = $(this).attr('data-highlight');
    $current = $(this).attr('data-current');
    if ($current == $highlight || ($highlight == "network-redirect" && $current == "contacts/__id__") || ($highlight == "network-redirect" && $current == "mes-contacts/__id__") || ($highlight == "network-redirect" && $current == "mes-demandes/__id__") || ($highlight == "network-redirect" && $current == "mon-profil/__id__")) {
      $(this).addClass('menu-active')
    } else {
      $(this).removeClass('menu-active')
    }
    if ( $(this).attr('data-path') == "/guests/sign_in" ) {
      $(this).removeClass('menu-active')
    }
  });

  var vCard = (function () {
    var start = "BEGIN:VCARD\nVERSION:3.0";
    var end = "END:VCARD";
    var data = "";

    var init = function() {
      data = "";
    };

    var name = function (surname, lastname) {
      data += "N:" + lastname + ';' + surname;
      data += "\n";
    };

    var cell = function (cell) {
      data += "TEL;TYPE=CELL:" + cell;
      data += "\n";
    };

    var email = function (email) {
      data += "EMAIL;TYPE=PREF,INTERNET:" + email;
      data += "\n";
    };
    var company = function (company) {
      data += "COMPANY:" + company;
      data += "\n";
    };

    var get = function () {
      return start + '\n' + data + end;
    };

    return {
      init:init,
      name:name,
      cell:cell,
      email:email,
      company:company,
      get:get
    }
  });

  if ($('.download-vcard').length > 0) {
    $(document).on('click', '.download-vcard', function() {
      var first_name = $('[data-first-name]').attr('data-first-name');
      var last_name = $('[data-last-name]').attr('data-last-name');
      var email = $('[data-email]').attr('data-email');
      var phone_number = $('[data-phone-number]').attr('data-phone-number');
      var company = $('[data-company]').attr('data-company');
      var vcard = vCard();
      vcard.init();
      vcard.name(first_name, last_name);
      vcard.cell(phone_number);
      vcard.email(email);
      vcard.company(company);
      var txt = vcard.get();
      $(this).attr('href', 'data:text/x-vcard;charset=utf-8,' + encodeURIComponent(txt) );
    });
  }
});
