$(function () {
  if ($('[data-section-type=map]').has('.map-section-container').length > 0) {
    $('[data-section-type=map]').has('.map-section-container').each(function (index, container) {
      var $container = $(container);
      var id = $container.attr('data-section-id');
      var type = $container.attr('data-section-type');
      var constructor = theme.Maps;

      var instance = Object.assign(new constructor(container), {
        id: id,
        type: type,
        container: container
      });
    });
  }

  /* TICKETING */

  $("[data-hide-when-no-ticket]").each(function() {
    hideWhenNoTicket($(this).attr("data-hide-when-no-ticket"));
  });

  // Initialize counters and select on edit mode
  $('[data-ticket-id]').each(function() {
    var nbTickets = $(this).find("[id^=linked-person]").length;
    var $quantitySelect = $("[data-guest-category-id=" + $(this).attr("data-ticket-id") + "]").siblings('[data-quantity]');
    $quantitySelect.val(nbTickets);
    $quantitySelect.find('option').each(function() {
      if (parseInt($(this).val()) < nbTickets) {
        $(this).attr('disabled', 'disabled'); // disable options for nb of persisted tickets
      }
    });
    displayTicketsCount($(this), nbTickets);
    displayTicketsIndex($(this))
  });

  $(document).on('click', ".remove-linked-guest", function(e) {
    var ticketCategoryId = $(this).closest("[id^=linked-person]").find("[id$=guest_category_id]").val();
    var $hiddenSpan = $("[data-guest-category-id=" + ticketCategoryId + "]");
    if ($hiddenSpan.length == 0)
      return;
    $quantitySelect = $hiddenSpan.siblings('[data-quantity]');
    var $ticketsBlock = $('[data-ticket-id=' + ticketCategoryId + ']');
    $quantitySelect.val($ticketsBlock.find("[id^=linked-person]").length);
    displayTicketsCount($ticketsBlock, $quantitySelect.val());
    displayTicketsIndex($ticketsBlock);
    hideWhenNoTicket(ticketCategoryId);
  });

  $(document).on('change', '[data-quantity]', function () {
    var $linkedGuestsBlock = $(this).siblings('[data-guest-category-id]');
    var guestCategoryId = $linkedGuestsBlock.attr('data-guest-category-id');
    var $quantitySelect = $(this);
    var quantity = parseInt($quantitySelect.val());
    var $ticketsBlock = $('[data-ticket-id=' + guestCategoryId + ']');

    if ($ticketsBlock.length == 0) {
      $linkedGuestsBlock.html("");

      for (var i = 0; i < quantity; i++) {
        $linkedGuestsBlock.append('<input type="hidden" name="linked_guests[' + i + '][guest_category_id]" value="' + guestCategoryId + '" data-linked-people="true" data-type="guest" data-index="' + i + '" />');
      }
    } else {
      if (window.caddie != undefined)
        window.caddie.pause();

      var currentNbOfTickets = $ticketsBlock.find("[id^=linked-person]").length;

      // Remove ALL tickets
      if (quantity == 0 && currentNbOfTickets != 0) {
        var confirmRemoveAllMessage = $(this).siblings("[data-ticketing-remove-all-tickets-message]").attr("data-ticketing-remove-all-tickets-message");

        if (window.confirm(confirmRemoveAllMessage)) {
          $ticketsBlock.find('.remove-linked-guest').click();
          displayTicketsCount($ticketsBlock, quantity);
        } else {
          $quantitySelect.val(currentNbOfTickets);
        }
      } else if (isInteger(quantity)) {
        // add tickets
        if (quantity > currentNbOfTickets) {
          var $addTicketButton = $ticketsBlock.find('.add-linked-guest');
          var diff = quantity - currentNbOfTickets;

          for (var i = 1; i <= diff; i++) {
            $addTicketButton.click();
          }

          displayTicketsCount($ticketsBlock, quantity);
        }
        // remove tickets
        if (quantity < currentNbOfTickets) {
          var diff = currentNbOfTickets - quantity,
              confirmRemoveMessage;

          if (diff > 1) {
            confirmRemoveMessage = $(this).siblings("[data-ticketing-remove-some-tickets-message]").attr("data-ticketing-remove-some-tickets-message").replace("#NB#", diff);
          } else {
            confirmRemoveMessage = $(this).siblings("[data-ticketing-remove-one-ticket-message]").attr("data-ticketing-remove-one-ticket-message");
          }

          if (window.confirm(confirmRemoveMessage)) {
            for (var i = 1; i <= diff; i++) {
              $ticketsBlock.find('.remove-linked-guest').last().click();
            }

            displayTicketsCount($ticketsBlock, quantity);
          } else {
            $quantitySelect.val(currentNbOfTickets);
          }
        }
        displayTicketsIndex($ticketsBlock);
      } else {
        $quantitySelect.val(currentNbOfTickets);
      }

      hideWhenNoTicket(guestCategoryId);

      if (window.caddie != undefined) {
        window.caddie.resume();
        window.caddie.trigger();
      }
    }
  });

  /* END TICKETING */

  if ($('.cart-container').length > 0) {
    /* Initalize Caddie for price refresh */
    window.caddie = new mobicheckin.registration.Caddie();
    window.caddie.bind();

    $(window).on('load resize', function () {
      /* Enable fixed cart */
      if ($(document).outerWidth() > 767) {
        var top_cart = 0;
        $('body div[data-section-type]').each(function () {
          if ($(this).attr('data-section-type') != "registration-form") {
            top_cart += $(this).outerHeight(true);
          } else {
            return false;
          }
        });
        $('.cart-container').affix({
          offset: {
            top: top_cart,
            bottom: $(document).outerHeight() - $('.form-actions').offset().top + 60
          }
        });
        $('.cart-container').css('width', $('.cart-container').parent().width());
      } else {
        $('.cart-container').removeClass("affix");
      }
    });
  };

  // CSS customization of linkedin share button which is not provided by JS API
  if ($('#share-linkedin').length > 0) {
    // wait 2s for button to be generated
    setTimeout(function () {
      $('.IN-widget').find('span > span > a > span').get(0).style.setProperty('height', '28px', 'important');
      $('.IN-widget').find('span > span > a > span').get(0).style.setProperty('background-position', '-54px -421px', 'important');
      $('.IN-widget').find('span > span > a > span').get(0).style.setProperty('border', 'none', 'important');
      $('.IN-widget').find('span > span > a > span').get(1).style.setProperty('height', '26px', 'important');
      $('.IN-widget').find('span > span > a > span').get(1).style.setProperty('margin-left', '0px', 'important');
      $('.IN-widget').find('span > span > a > span').eq(1).find('span').get(1).style.setProperty('font-size', '13px', 'important');
      $('.IN-widget').find('span > span > a > span').eq(1).find('span').get(1).style.setProperty('line-height', '28px', 'important');
      $('.IN-widget').find('span > span > a > span').eq(1).find('span').get(1).style.setProperty('text-shadow', 'none', 'important');
    }, 2000);
  }

  // Sponsorship widget - Change button state when submitting form
  $(document).on('click', '.sponsorship-widget [type=submit]', function () {
    $(this).button('loading');
  });

  // Post Message
  var msgHandler = function (e) {
    var e = e.originalEvent;
    switch (e.data.type) {
      case 'scroll':
        var element = document.querySelector("[data-section-id=" + e.data.sectionId + "]");
        if (element != null) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
        break;
      case 'removeSection':
        $("[data-section-id=" + e.data.sectionId + "]").fadeOut();
        break;
      case 'blockToggle':
        $(".highlight").removeClass("highlight");
        if (e.data.blockId != null) {
          $("[data-block-id=" + e.data.blockId + "]").addClass("highlight");
        }
        break;
    }
  }

  if (window.postMessage) {
    $(window).on("message", msgHandler);
    window.parent.postMessage({
      'type': 'iframeSrcChange',
      'url': window.location.href
    }, '*');
  }

  if ($('.btn-calendar').length > 0) {

    var myCalendar = createCalendar({
      options: {
        class: 'add-calendar',
        label: $('[data-label-btn]').attr('data-label-btn'),
        icone: $('[data-icone-btn]').attr('data-icone-btn')
      },
      data: {
        // Event title
        title: $('[data-event-title]').attr('data-event-title'),
        // Event start date
        start: parseDate($('[data-event-start-date]').attr('data-event-start-date')),
        // You can also choose to set an end time
        // If an end time is set, this will take precedence over duration
        end: parseDate($('[data-event-end-date]').attr('data-event-end-date')),
        // Event Address
        address: $('[data-event-address]').attr('data-event-address'),
        // Event Description
        description: $('[data-event-description]').attr('data-event-description')
      }
    });
    $('.add-calendar').append(myCalendar);
  }
});

// URL params tracking
(function () {
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = function () {
    window.eventmakerTracking.injectURLParamsInIframes();
  };
  script.src = 'https://applidget.github.io/vx-assets/shared/js/url-params-tracking/1.0.0/url-params-tracking.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}());

// Guest tracking
(function () {
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = function () {
    var paramSecret = $.getUrlVar(window.location.href, "secret");
    var paramGuestId = $.getUrlVar(window.location.href, "guest_id");
    var paramRegister = $.getUrlVar(window.location.href, "register");
    var paramStep = $.getUrlVar(window.location.href, "step");
    if (paramSecret && paramGuestId) {
      if (paramRegister) {
        document.cookie = 'guest_id=' + paramGuestId + ';path=/';
        document.cookie = 'secret=' + paramSecret + ';path=/';
        document.cookie = 'register=' + paramRegister + ';path=/';
        $('.announcement-private').show();
      }
    }
    if (document.cookie.indexOf("guest_id=") != -1 && document.cookie.indexOf("secret=") != -1 && document.cookie.indexOf("register=") != -1) {
      var new_registration = $.getUrlVar(window.location.href, "force_new_registration");
      if (new_registration == "true") {
        $('.announcement-private').hide();
      } else {
        $('.announcement-private').show();
      }
    }
  };
  script.src = 'https://applidget.github.io/vx-assets/shared/js/get-url-vars.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}());

function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], parts[6]);
}

function isInteger(val) {
  return new RegExp("^[0-9]+$").test(val);
}

function hideWhenNoTicket(ticketCategoryId) {
  var $ticketsBlock = $('[data-ticket-id=' + ticketCategoryId + ']');

  if ($ticketsBlock.length == 0)
    return;

  if ($ticketsBlock.find("[id^=linked-person]").length > 0) {
    $("[data-hide-when-no-ticket=" + ticketCategoryId + "]").show();
  } else {
    $("[data-hide-when-no-ticket=" + ticketCategoryId + "]").hide();
  }
}

function displayTicketsIndex($ticketsBlock) {
  $ticketsBlock.find("[data-ticket-type-index]").each(function(index, container) {
    $(container).html(parseInt(index) + 1);
  });
}

function displayTicketsCount($ticketsBlock, count) {
  $ticketsBlock.find("[data-ticket-type-count]").html(count);
}
