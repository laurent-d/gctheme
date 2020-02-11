/**
 * Copyright (c) 2020
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
 *  - Select Multiple value (SOL)
 *  - DateTime Overlapse in programme
 *  - Dropdown menu with submenus
 *  - Handle Speakers MultiSelect (SOL)
 *  - Add Speakers into SOL
 *  - Add to calendar ICS for MS Browser ie10+
 *
 * Created       : 2019-05-27 by @opheJansen
 * Last modified : 2020-01-09 by @laurent-d
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

  $("[data-hide-when-no-ticket]").each(function () {
    hideWhenNoTicket($(this).attr("data-hide-when-no-ticket"));
  });

  // Initialize counters and select on edit mode
  $('[data-ticket-id]').each(function () {
    var nbTickets = $(this).find("[id^=linked-person]").length;
    var $quantitySelect = $("[data-guest-category-id=" + $(this).attr("data-ticket-id") + "]").siblings('[data-quantity]');
    $quantitySelect.val(nbTickets);
    $quantitySelect.find('option').each(function () {
      if (parseInt($(this).val()) < nbTickets) {
        $(this).attr('disabled', 'disabled'); // disable options for nb of persisted tickets
      }
    });
    displayTicketsCount($(this), nbTickets);
    displayTicketsIndex($(this))
  });

  if ($(".tickets-container").length > 0) {
    $(document).on('click', ".remove-linked-guest", function (e) {
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
    $(".linked-guests-inline [id^=linked-person]").each(function (e) {
      setupInlineLinkedGuest($(this));
    });

    $(document).on('click', ".add-linked-guest", function (e) {
      setupInlineLinkedGuest($(this).prev());
    });

    $(document).on('click', '.remove-linked-guest', function (e) {
      e.preventDefault();
      var $addLinkedGuestLink = $(this).closest("[id^=linked-person]").nextAll(".add-linked-guest").first();
      var current = parseInt($addLinkedGuestLink.attr("data-current"));
      var limit = parseInt($addLinkedGuestLink.attr("data-limit"));
      $addLinkedGuestLink.attr("data-current", current - 1);
      var linkedGuestIndex = $(this).attr("data-remove-linked-guest");
      $("#linked-person-" + linkedGuestIndex).remove();
      if (limit != -1 && current - 1 < limit && $addLinkedGuestLink.is(':hidden')) {
        $addLinkedGuestLink.show();
      }
    });
  }
  /* END INLINE SUBFORM */

  /* CART SESSION LIST */
  function showSessionCartIfCartItems() {
    var $numberItems = $('.cart-panel .cart-items .row').length;
    if ($numberItems > 0) {
      $('.cart-session-container').removeClass("hide");
      $('.cart-indicator').text($numberItems);
    } else {
      $('.cart-session-container').addClass("hide");
    }
  }

  if ($('.cart-session-container').length > 0) {

    showSessionCartIfCartItems();

    /* Set correct top if fixed header */
    if ($('.header-fixed').length > 0) {
      $('.cart-session-container').css("top", $('.header-fixed').innerHeight());
    }

    $(document).on('click', '.cart-icon', function () {
      if ($('.cart-panel:visible').length > 0) {
        $('.cart-panel').addClass("hide");
      } else {
        $('.cart-panel').removeClass("hide");
      }
    });

    /* WATCH changes on cart */
    $(document).on('DOMSubtreeModified', ".cart-session-container .cart-items", function () {
      showSessionCartIfCartItems();
    });

  }

  /* END CART SESSION LIST */

  if ($('.cart-container').length > 0) {
    /* Initalize Caddie for price refresh */
    window.caddie = new mobicheckin.registration.Caddie();
    window.caddie.bind();

    if ($('.form-actions').length > 0) {
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
          $('.cart-container').removeClass("affix").removeClass("affix-top");
        }
      });
    }
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

  $('.btn-calendar').each(function() {
    var myCalendar = createCalendar({
      options: {
        class: 'add-calendar',
        label: $(this).attr('data-label-btn'),
        icon: $(this).attr('data-icon-btn')
      },
      data: {
        // Event title
        title: $(this).attr('data-event-title'),
        // Event start date
        start: parseDate($(this).attr('data-event-start-date')),
        // You can also choose to set an end time
        // If an end time is set, this will take precedence over duration
        end: parseDate($(this).attr('data-event-end-date')),
        // Event Address
        address: $(this).attr('data-event-address'),
        // Event Description
        description: $(this).attr('data-event-description')
      }
    }, this);
    $('.add-calendar').html(myCalendar);
  });

  // Photo gallery section
  if ($("[data-section-type=photo-gallery]").length > 0) {
    if ($("[data-section-type=photo-gallery] .grid").length > 0) {
      var $grid = $('.grid').packery({
        itemSelector: '.grid-item'
      });
      $grid.imagesLoaded().progress(function () {
        $grid.packery();
      });
    }
    if ($("[data-section-type=photo-gallery] [data-fancybox='gallery']").length > 0) {
      $('[data-fancybox="gallery"]').fancybox({
        buttons: ["close"]
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

  $('.session-description.collapse').on('show.bs.collapse', function () {
    $(this).prev('button').hide();
  });

  /* TIME RANGE SLIDER */

  if ($("#slider-range").length > 0) {
    var defaultStartTime = $("#slider-range").data('default-start-time');
    var defaultEndTime = $("#slider-range").data('default-end-time');
    var locale = $("#slider-range").data('locale');
    var startTime = $('[name=start_time]').val();
    var endTime = $('[name=end_time]').val();

    var displayTime = function (number, $selector, locale) {
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
      create: function (e, ui) {
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

  /* Dropdown menu with submenus */
  $('.dropdown-submenu > a').on("click", function(e){
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });

  /* Multiples Value List */
  var multipickListScriptUrl = "https://applidget.github.io/vx-assets/templates/website/js/searchable-option-list.js?v=3";
  var multipickListStylesheetUrl = "https://applidget.github.io/vx-assets/templates/website/css/searchable-option-list.css";

  lazyLoadScript(multipickListScriptUrl, ".tickets-container, select[multiple=multiple]", function () {
    lazyLoadStylesheet(multipickListStylesheetUrl);
    mutipickListCallback($(document));

    $(document).on('click', '[type=submit]', function () {
      $('select[multiple=multiple]').each(function () {
        requiredToDataRequired($(this))
      });
    });
  });

  $(document).on('click', '.add-linked-guest', function () {
    var $linked_guest = $(this).prev('[id*=linked-person]');
    if ($('script[src="' + multipickListScriptUrl + '"]').length == 0) {
      lazyLoadScript(multipickListScriptUrl, "select[multiple=multiple]", function () {
        lazyLoadStylesheet(multipickListStylesheetUrl);
        mutipickListCallback($linked_guest);

        $(document).on('click', '[type=submit]', function () {
          $('select[multiple=multiple]').each(function () {
            requiredToDataRequired($(this))
          });
        });
      });
    } else {
      mutipickListCallback($linked_guest);
    }
  });

  // filter search-bar product table
  $("[name='products_q']").focusin("submit", function() {
    $("[type='submit']").attr('disabled', true);
  }).focusout("submit", function() {
    $("[type='submit']").attr('disabled', false);
  });

  $(document).on("keyup", "[name='products_q']", function() {
    $searchBar = $(this);
    formItemID = $searchBar.closest('[data-form-item-id]').attr('data-form-item-id');
    var value = $(this).val().toLowerCase();
    $("[data-form-item-id='" + formItemID + "'] .products-table tr:not([data-form-item-id='" + formItemID + "'] .products-table tr:first)").filter(function() {
      if ($(this).attr('data-searchable-keyword').toLowerCase().indexOf(value) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  // RTE
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/summernote.1.0.0.js", ".summernote");

  // Dates selector
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/start-end-dates-selector.1.0.0.js", ".start-end-dates-selector");

  // Social Network Sharing
  lazyLoadScript("https://cdn.jsdelivr.net/npm/goodshare.js@6/goodshare.min.js", "[data-section-type='social-networks-sharing']");

  // Sessions search
  lazyLoadScript("https://laurent-d.github.io/gctheme/assets/js/sessions-search.1.0.0.syno.js?v=4", ".sessions-search-form");

  // Programme DatetimeOverlapse
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/datetime-overlapse.1.0.0.js?v=4", "[data-section-type='sessions-list'], [data-section-type='session-info']", function () {
    // initializer && Edit
    if ($(".accesspoint-unregister").length > 0) {
      $('[data-toggle="tooltip"]').tooltip("destroy");
      $(".accesspoint-unregister, .accesspoint-register").closest('[data-toggle]').removeAttr('data-toggle');
      datetimeOverlapse();
      $('[data-toggle="tooltip"]').tooltip({ placement: "top", trigger: 'click' });
    }

    // onChange (register or unregister)
    $(document).ajaxComplete(function (event, request, settings) {
      if (settings.url.indexOf('/update_jsonp?') != -1) {
        $('[data-toggle="tooltip"]').tooltip("destroy");
        $(".accesspoint-unregister, .accesspoint-register").closest('[data-toggle]').removeAttr('data-toggle');
        datetimeOverlapse();
        $('[data-toggle="tooltip"]').tooltip({ placement: "top", trigger: 'click' });
      }
    });
  });

  /* Add Speakers into SOL */
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/add-speaker-session.1.0.0.js", ".add-speaker-container", function() {
    $(document).on('submit', '.add-speaker-container .registration-form', function(e) {
      e.preventDefault();
      handleAddSpeaker($(this));
    });
  });
  
  /* ADD TO CALENDAR MS Browser */
  if (navigator.msSaveBlob) { // IE 10+
    $(document).on('click', '#addToMyCalendarModal .icon-ical, #addToMyCalendarModal .icon-outlook', function (e) {
      e.preventDefault();
      var dataCal = decodeURI($(this).attr('href')).replace("data:text/calendar;charset=utf8,", "");
      var blob = new Blob([dataCal], { type: 'text/calendar;charset=utf-8;' });
      navigator.msSaveBlob(blob, 'calendrier.ics');
    });
  }

});

// Images LazyLoad
new LazyLoad();

function mutipickListCallback($guest) {
  $guest.find('select[multiple=multiple]').each(function () {
    $select = $(this);

    $select.attr('data-name', $select.attr('name'));
    var params = setDefaultParams($select);
    params = handleEdition($select, params);
    params = setSelectAllOption($select, params);
    params = bindEvents($select, params);

    $select.searchableOptionList(params);

    if ($select.data('type') == "speakers") {
      $select.closest('form').on('submit', function() {
        formatSpeakersFormData($select);
      });
    }
  });
}

// Formatted SOL options for submittable form
function formatSpeakersFormData($select) {
  $select.attr('name', "");
  var $container = $select.prev('.sol-container'),
      $options = $container.find('.sol-selection-container .sol-selection .sol-option');

  $options.each(function (i, option) {
    var $option = $(option),
        $checkbox = $option.find('[type=checkbox]'),
        guestId = $checkbox.val(),
        garId = $select.find('option[value=' + guestId + ']').attr('data-gar-id');

    if ($option.find('input[type=hidden][name^=\\]\\[type\\]]').length == 0 || $option.find('input[type=hidden][name^=\\]\\[guest_id\\]]').length == 0) {
      if ($checkbox.attr('name').indexOf('[]') != -1) {
        $checkbox.attr('name', $checkbox.attr('name').replace('[]', '[' + i + '][guest_id]'));
      } else {
        $checkbox.attr('name', $checkbox.attr('name') + '[' + i + '][guest_id]');
      }
      createMissingSpeakerInputs(i, $checkbox, garId);
    }
  });
}

// Create hidden fields for submittable guest_accesspoint_roles_attributes
function createMissingSpeakerInputs(i, $checkbox, garId) {
  if (garId) {
    // create input '_id'
    $checkbox.after(
      $('<input />', {
        type: 'hidden',
        name: 'accesspoint[guest_accesspoint_roles_attributes][' + i + '][_id]',
        value: garId
      })
    );
  }
  // create input 'type'
  $checkbox.after(
    $('<input />', {
      type: 'hidden',
      name: 'accesspoint[guest_accesspoint_roles_attributes][' + i + '][type]',
      value: 'speaker'
    })
  );
  // create input '_destroy'
  $checkbox.after(
    $('<input />', {
      type: 'hidden',
      name: 'accesspoint[guest_accesspoint_roles_attributes][' + i + '][_destroy]',
      value: $checkbox.is(':checked') ? false : true
    })
  );

}

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
  $ticketsBlock.find("[data-ticket-type-index]").each(function (index, container) {
    $(container).html(parseInt(index) + 1);
  });
}

function displayTicketsCount($ticketsBlock, count) {
  $ticketsBlock.find("[data-ticket-type-count]").html(count);
}

function setupInlineLinkedGuest($linkedGuestBlock) {
  $linkedGuestBlock.find(".form-inline .form-group").each(function () {
    var label = $(this).find('label.control-label').text();
    $(this).find('[type=text], [type=email]').attr('placeholder', label);
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
      element.addEventListener('load', function (e) {
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
