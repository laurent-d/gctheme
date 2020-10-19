/**
  * Copyright (c) 2019
  *
  * Features:
  *  - URL params tracking
  *  - Guest tracking
  *  - Map
  *  - Ticketing form
  *  - Inline subform
  *  - Cart Affix
  *  - LinkedIn Share button
  *  - Sponsorship widget button
  *  - Website builder interaction with Post Message
  *  - Add to calendar button
  *  - Photo Gallery
  *  - Program sessions
  *  - Time range slider
  *  - Summernote RTE
  *  - Dates selector
  *  - Social network sharing
  *  - Sessions search
  *  - Collapsable elements
  *  - Select Multiple value
  *
  * Created       : 2019-05-27 by @opheJansen
  * Last modified : 2019-08-01 by @WilfriedDeluche
  */


$(function () {
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

  if ($(".tickets-container").length > 0) {
    $(document).on('click', ".remove-linked-guest", function(e) {
      var ticketCategoryId = $(this).closest("[id^=linked-person]").find("[id$=guest_category_id]").val();
      var $hiddenSpan = $("[data-guest-category-id=" + ticketCategoryId + "]");
      if ($hiddenSpan.length == 0)
        return;
      $quantitySelect = $hiddenSpan.siblings('[data-quantity]');
      var $ticketsBlock = $('[data-ticket-id=' + ticketCategoryId + ']');
      var count = $ticketsBlock.find("[id^=linked-person]").length;
      $quantitySelect.val(count);
      displayTicketsCount($ticketsBlock, count);
      displayTicketsIndex($ticketsBlock);
      hideWhenNoTicket(ticketCategoryId);
    });
  }

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

  /* INLINE SUBFORM */
  if ($(".linked-guests-inline").length > 0) {
    $(".linked-guests-inline [id^=linked-person]").each(function(e) {
      setupInlineLinkedGuest($(this));
    });

    $(document).on('click', ".add-linked-guest", function(e) {
      setupInlineLinkedGuest($(this).prev());
    });

    $(document).on('click', '.remove-linked-guest', function(e) {
      e.preventDefault();
      var $addLinkedGuestLink = $(this).closest("[id^=linked-person]").nextAll(".add-linked-guest").first();
      var current = parseInt($addLinkedGuestLink.attr("data-current"));
      var limit = parseInt($addLinkedGuestLink.attr("data-limit"));
      $addLinkedGuestLink.attr("data-current", current-1);
      var linkedGuestIndex = $(this).attr("data-remove-linked-guest");
      $("#linked-person-"+linkedGuestIndex).remove();
      if (limit != -1 && current-1 < limit && $addLinkedGuestLink.is(':hidden')) {
        $addLinkedGuestLink.show();
      }
    });
  }
  /* END INLINE SUBFORM */

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

  // Photo gallery section
  if ($("[data-section-type=photo-gallery]").length > 0) {
    if ($("[data-section-type=photo-gallery] .grid").length > 0) {
      var $grid = $('.grid').packery({
                    itemSelector: '.grid-item'
                  });
      $grid.imagesLoaded().progress( function() {
        $grid.packery();
      });
    }
    if ($("[data-section-type=photo-gallery] [data-fancybox='gallery']").length > 0) {
      $('[data-fancybox="gallery"]').fancybox({
      	buttons : [ "close" ]
      });
    }
  }

  /* SESSIONS */

  if ($(".no-results").length > 0) {
    if ($(".sessions-list .session-item:not(.hide)").length == 0) {
      $(".no-results").removeClass('hide');
    } else {
      $(".no-results").addClass('hide');
    }
  }

  $('.session-description.collapse').on('show.bs.collapse', function() {
    $(this).prev('button').hide();
  });

  /* TIME RANGE SLIDER */

  if ($("#slider-range").length > 0) {
    var defaultStartTime = $("#slider-range").data('default-start-time');
    var defaultEndTime = $("#slider-range").data('default-end-time');
    var locale = $("#slider-range").data('locale');
    var startTime = $('[name=start_time]').val();
    var endTime = $('[name=end_time]').val();

    var displayTime = function(number, $selector, locale) {
      var hours = Math.floor(number / 60);
      var minutes = number - (hours * 60);

      if (minutes < 10) minutes = '0' + minutes; // minutes between 1 and 9 must be displayed as 01 to 09

      if (locale == "en") {
        if (hours >= 12)
          minutes += " PM";
        else
          minutes += " AM";

        if (hours == 0)
          hours = 12; // midnight hour must be displayed as 12 AM
        else if (hours > 12)
          hours -= 12; // PM hours must be between 1 and 12
      }

      if (hours < 10) hours = '0' + hours; // hours between 1 and 9 must be displayed as 01 to 09

      $selector.html(hours + ':' + minutes);
    }

    $("#slider-range").slider({
      range: true,
      min: Math.floor(defaultStartTime),
      max: Math.floor(defaultEndTime),
      step: 5,
      values: [startTime, endTime],
      create: function(e, ui) {
        displayTime(startTime, $('.slider-time-start'), locale);
        displayTime(endTime, $('.slider-time-end'), locale);
      },
      slide: function (e, ui) {
        displayTime(ui.values[0], $('.slider-time-start'), locale);
        displayTime(ui.values[1], $('.slider-time-end'), locale);

        $('[name=start_time]').val(ui.values[0]).trigger("change");
        $('[name=end_time]').val(ui.values[1]).trigger("change");
      }
    });
  }

  /* Collapsable elements - Display of caret for triggered button */
  $('[id^=collapse-]').on('show.bs.collapse', function () {
    $("a[href=#" + $(this).attr("id") + "] .fa-caret-down").addClass("fa-rotate-180");
  }).on('hide.bs.collapse', function () {
    $("a[href=#" + $(this).attr("id") + "] .fa-caret-down").removeClass("fa-rotate-180");
  });

  /* Multiples Value List */
  lazyLoadStylesheet("https://applidget.github.io/vx-assets/templates/website/css/searchable-option-list.css", "select[multiple=multiple]");
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/searchable-option-list.js?v=1", "select[multiple=multiple]", function() {
    $(document).find('select[multiple=multiple]').each(function() {
      requiredToDataRequired($(this));
      var params = setDefaultParams($(this));
      params = handleEdition($(this), params);
      params = setSelectAllOption($(this), params);
      params = setLimitOption($(this), params);

      $(this).searchableOptionList(params);
    });

    $(document).on('click', '[type=submit]', function() {
      $('select[multiple=multiple]').each(function() {
        requiredToDataRequired($(this))
      });
    });
  });

  // RTE
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/summernote.1.0.0.js", ".summernote");

  // Dates selector
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/start-end-dates-selector.1.0.0.js", ".start-end-dates-selector");

  // Social Network Sharing
  lazyLoadScript("https://cdn.jsdelivr.net/npm/goodshare.js@6/goodshare.min.js", "[data-section-type='social-networks-sharing']");

  // Sessions search
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/sessions-search.1.0.0.js?v=3", ".sessions-search-form");
});

// Images LazyLoad
new LazyLoad();

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

    if (paramSecret && paramGuestId && (paramRegister || window.location.pathname.indexOf("confirmation") !== -1)) {
      document.cookie = 'guest_id=' + paramGuestId + ';path=/';
      document.cookie = 'secret=' + paramSecret + ';path=/';
      document.cookie = 'register=' + paramRegister + ';path=/';
      $('.announcement-private').show();
    }

    if (document.cookie.indexOf("guest_id=") != -1 && document.cookie.indexOf("secret=") != -1 && document.cookie.indexOf("register=") != -1) {
      var newRegistration = $.getUrlVar(window.location.href, "force_new_registration");
      var noCookie = $.getUrlVar(window.location.href, "no_cookie");
      if (newRegistration == "true" || noCookie == "true") {
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

function setupInlineLinkedGuest($linkedGuestBlock) {
  $linkedGuestBlock.find(".form-inline .form-group").each(function() {
    var label = $(this).find('label.control-label').text();
    $(this).find('[type=text]').attr('placeholder', label);
    $(this).addClass("has-tooltip").attr("data-placement", "top").attr("title", label);
  });
  $removeButton = $linkedGuestBlock.find('.remove-linked-guest').eq(0).detach();
  $linkedGuestBlock.find('.form-action').append($removeButton);
  $linkedGuestBlock.find('.remove-linked-guest').removeAttr('onclick')
  $linkedGuestBlock.find(".has-tooltip").tooltip();
}

// appends script into body if DOM element matches selector
function lazyLoadScript(scriptUrl, selector, callback) {
  if (!selector || $(selector).length > 0) {
    var element = document.createElement('script'),
        body = document.getElementsByTagName('body')[0];
    element.src = scriptUrl;

    if (callback) {
      element.addEventListener('load', function(e) {
        callback(null, e);
      }, false);
    }

    body.appendChild(element);
  }
}

// appends stylesheet into head if DOM element matches selector
function lazyLoadStylesheet(stylesheetUrl, selector) {
  if (!selector || $(selector).length > 0) {
    var element = document.createElement('link'),
        head = document.getElementsByTagName('head')[0];
    element.href = stylesheetUrl;
    element.rel = "stylesheet";

    head.appendChild(element);
  }
}
