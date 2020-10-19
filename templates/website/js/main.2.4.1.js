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
 *  - Onsite badge printing
 *  - Show If (Condition multiple)
 *  - Accommodation
 *  - Session-live
 *  - Sessions archives
 *  - Guest invitations
 *  - Removable entity from table
 *  - Direct messages
 *  - Registered Guests on managed-meetings
 *  - Managed sessions search
 *  - Meetings in guest-info
 *  - Lead Requests
 *  - Managed meetings search
 *  - Live button
 *
 * Created       : 2019-05-27 by @opheJansen
 * Last modified : 2020-10-14 by @opheJansen
 */


$(function () {
  $('[data-toggle="tooltip"]').tooltip();

  //  Check if ie11
  var isIE11 = (/trident/i).test(navigator.userAgent) && (/rv:/i).test(navigator.userAgent);

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

  // Basics script to lazyload
  lazyLoadScript("https://applidget.github.io/vx-assets/shared/js/get-url-vars.js");

  // TICKETING
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

  // INLINE SUBFORM
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

  // CART SESSION LIST
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

    // Set correct top if fixed header
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

    // WATCH changes on cart
    $(document).on('DOMSubtreeModified', ".cart-session-container .cart-items", function () {
      showSessionCartIfCartItems();
    });

  }

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
          $( '.cart-container' ).on( 'affix.bs.affix', function(){
            if( !$( window ).scrollTop() ) return false;
          } );
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

  // Add to my Calendar
  lazyLoadScript("https://applidget.github.io/vx-assets/shared/js/add-to-calendar.js", ".btn-calendar, .modal#meetings-selection-modal", function() {
    if ($('.btn-calendar').length > 0) {
      $('.btn-calendar').each(function() {
        const $btnCalendar = $(this);

        addToMyCalendar(this, '.add-calendar', {
            title: $btnCalendar.data('event-title'),
            start: $btnCalendar.data('event-start-date'),
            end: $btnCalendar.data('event-end-date'),
            address: $btnCalendar.data('event-address'),
            description: $btnCalendar.data('event-description')
          },
          {
            class: 'add-calendar',
            label: $btnCalendar.data('label-btn'),
            icon: $btnCalendar.data('icon-btn')
          }
        );
      });
    }
  });

  // ADD TO CALENDAR MS Browser
  if (navigator.msSaveBlob) { // IE 10+
    $(document).on('click', '#addToMyCalendarModal .icon-ical, #addToMyCalendarModal .icon-outlook', function (e) {
      e.preventDefault();
      var dataCal = decodeURI($(this).attr('href')).replace("data:text/calendar;charset=utf8,", "");
      var blob = new Blob([dataCal], { type: 'text/calendar;charset=utf-8;' });
      navigator.msSaveBlob(blob, 'calendrier.ics');
    });
  }

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

  // SESSIONS
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

  // TIME RANGE SLIDER
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

  // Collapsable elements - Display of caret for triggered button
  $('[id^=collapse-]').on('show.bs.collapse', function () {
    $("a[href=#" + $(this).attr("id") + "] .fa-caret-down").addClass("fa-rotate-180");
  }).on('hide.bs.collapse', function () {
    $("a[href=#" + $(this).attr("id") + "] .fa-caret-down").removeClass("fa-rotate-180");
  });

  // Dropdown menu with submenus
  $('.dropdown-submenu > a').on("click", function(e){
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });

  // Show If (Condition multiple)
  if (isIE11) {
    var showIfScriptUrl = "https://applidget.github.io/vx-assets/shared/js/show-if/2.0.0/legacy/show-if.js";
  } else {
    var showIfScriptUrl = "https://applidget.github.io/vx-assets/shared/js/show-if/2.0.0/show-if.js";
  }

  lazyLoadScript(showIfScriptUrl, "[data-show-if]", function() {
    $(document).find("[data-show-if]").each(function () {
      new ShowIf($(this));
    });
    $(document).on('click', '.add-linked-guest', function () {
      $linkedGuest = $(this).prev('[id*=linked-person]');

      $linkedGuest.find('[data-show-if]').each(function () {
        new ShowIf($(this));
      });
    });
  });

  // Multiples Value List
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
  if (isIE11) {
    lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/legacy/sessions-search.1.0.0.js?v=5", ".sessions-search-form");
  } else {
    lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/sessions-search.1.0.0.js?v=5", ".sessions-search-form");
  }

  // Programme DatetimeOverlapse
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/datetime-overlapse.1.0.0.js?v=4", "[data-section-type='sessions-list'], [data-section-type='session-info'], [data-section-type='sessions-list-synoptique']", function () {
    // initializer && Edit
    if ($(".accesspoint-unregister").length > 0 || $(".accesspoint-registered").length > 0) {
      $('[data-toggle="tooltip"]').tooltip("destroy");
      $(".accesspoint-unregister, .accesspoint-register, .accesspoint-registered").closest('[data-toggle]').removeAttr('data-toggle');
      datetimeOverlapse();
      $('[data-toggle="tooltip"]').tooltip({ placement: "top", trigger: 'hover' });
    }

    // onChange (register or unregister)
    $(document).ajaxComplete(function (event, request, settings) {
      if (settings.url.indexOf('/update_jsonp?') != -1 || settings.url.indexOf('/update_requiring_checkout?') != -1) {
        $('[data-toggle="tooltip"]').tooltip("destroy");
        $(".accesspoint-unregister, .accesspoint-register, .accesspoint-registered").closest('[data-toggle]').removeAttr('data-toggle');
        datetimeOverlapse();
        $('[data-toggle="tooltip"]').tooltip({ placement: "top", trigger: 'hover' });
      }
    });
  });

  // Add Speakers into SOL
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/add-speaker-session.1.0.0.js?v=2", ".add-speaker-container", function() {
    $(document).on('submit', '.add-speaker-container .registration-form', function(e) {
      e.preventDefault();
      handleAddSpeaker($(this));
    });
  });

  // Onsite-badge-printing
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/onsite-badge-printing.js", '[data-section-type="onsite-badge-printing"]', function() {
    $('[data-section-type="onsite-badge-printing"]').each( function() {
      new badgePrinting($(this));
    });
  });

  // Accommodation
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/accommodation.js", ".accommodation-bloc", function() {
    $(".accommodation-bloc").each(function() {
      new Accommodation($(this));
    });

    $(document).on('click', ".add-linked-guest", function () {
      $(this).prev().find(".accommodation-bloc").each(function() {
        new Accommodation($(this));
      });
    });
  });

  // SSO MULTIPLE REGISTRATION MODALE
  if ($("#sso-guest-picker").length) {
    $("#sso-guest-picker").modal({ show: true });

    $(document).on("change", ".guest-picker-choice", function () {
      const guestId = $(this).attr("data-guest-id");
      const guestSecret = $(this).attr("data-guest-secret");

      const location = "&guest_id=" + guestId + "&secret=" + guestSecret + "&register=true&silent_cookies_params=true";
      $("#sso-guest-picker-submit").attr("data-location", location).attr("disabled", false);
    });

    $(document).on("click", "#sso-guest-picker-submit", function () {
      window.location.search += $(this).attr("data-location");
    });
  }

  // SESSION LIVE
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/session-live.1.0.0.js", "[data-section-type='session-live']", function() {
    $("[data-section-type='session-live']").each(function() {
      const $sectionSessionLive = $(this);
      const isLive = $sectionSessionLive.attr('data-session-is-live');

      if (isLive === "true") {
        // load opentok SDK
        lazyLoadScript("https://static.opentok.com/v2/js/opentok.min.js", "[data-section-type='session-live']", function() {
          lazyLoadScript("https://cdn.jsdelivr.net/npm/opentok-layout-js@3.4.0/opentok-layout.min.js", "[data-section-type='session-live']", function() {
            loadVideoJsPlayerIfNeeded($sectionSessionLive, function() {
              new SessionLive($sectionSessionLive);
            });
          });
        });
      }
    });
  });

  function loadVideoJsPlayerIfNeeded($sectionSessionLive, callback) {
    const liveSessionType = $sectionSessionLive.attr("data-live-session-type");
    const guestType = $sectionSessionLive.attr("data-guest-type");
    if (["hls_broadcast", "streaming"].includes(liveSessionType) && guestType === "viewer") {
      lazyLoadScript("https://unpkg.com/video.js@7.9.3/dist/video.min.js", "[data-section-type='session-live']", function() {
        const link = document.createElement("link");
		    link.setAttribute("rel", "stylesheet");
		    link.setAttribute("type", "text/css");
        link.setAttribute("href", "https://unpkg.com/video.js@7.9.3/dist/video-js.min.css");
        document.querySelector("head").appendChild(link);
        callback();
      });
    } else {
      callback();
    }
  }

  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/direct-messages.1.0.0.js", "[data-section-type='direct-messages']", function() {
    // load opentok SDK
    lazyLoadScript("https://static.opentok.com/v2/js/opentok.min.js", "[data-section-type='direct-messages']", function() {
      new DirectMessages($("[data-section-type='direct-messages']"));
    });
  });

  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/session-slideshare.1.0.0.js", "[data-section-type='session-live']");

  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/jquery.countdown.js", "[data-section-type='session-live']", function() {
    $("[data-section-type='session-live'] [data-countdown='session']").each(function() {
      $sessionLive = $(this);
      $before = $(this).find("[data-countdown-for='before']");
      $ongoing = $(this).find("[data-countdown-for='ongoing']");
      $after = $(this).find("[data-countdown-for='after']");
      $before.removeClass("hide");

      initLiveSessionCountdown($sessionLive, $before.attr("data-startdate"), $before.find('.countdown'), function() {
        $before.addClass("hide");
        $ongoing.removeClass("hide");
      });

      initLiveSessionCountdown($sessionLive, $ongoing.attr("data-enddate"), $ongoing.find('.countdown'), function() {
        $ongoing.addClass("hide");
        $after.removeClass("hide");
      });
    })
  });

  // SESSIONS ARCHIVES
  if ($(".session-live-section #video-archives source").length > 1) {
    videoArchivesChained();
  }

  // GUEST INVITATIONS
  if (isIE11) {
    lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/legacy/guest-invitations-import.1.0.0.js", ".guest-invitations-import");
  } else {
    lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/guest-invitations-import.1.0.0.js", ".guest-invitations-import");
  }

  // REMOVABLE ENTITY FROM TABLE
  $(document).on("click", "[data-removable-entity], .remove-guest", function(e) {
    e.preventDefault();
    const entityId = $(this).closest("tr").attr("id");
    const errorMessage = $(this).attr("data-error-message");
    const counterTarget = $(this).attr("data-counter-target");

    $.ajax({
      type: "DELETE",
      url: $(this).attr("data-remove-url"),
      contentType: "application/json",
      dataType: "json"
    }).fail(function() {
      if (errorMessage)
        alert(errorMessage);
    }).success(function(data) {
      $("#" + entityId).remove();
      $(counterTarget).text(parseInt($(counterTarget).text()) - 1);
    });
  });

  // DIRECT MESSAGES
  $(document).on('click', ".direct-messages .back-button", function (e) {
    e.preventDefault();
    $('.direct-messages .main-panel').toggleClass('focus');
  });

  // FORM AJAX SUBMIT WITH FORM-DATA
  $(document).on("submit", "form.form-ajax-submit", function(e) {
    e.preventDefault();
    const $form = $(e.target);
    const form = $form[0]; // Need to use standard javascript object here
    const formData = new FormData(form);
    const $errors = $form.find("div.errors");
    $errors.html("").hide();
    $.ajax({
      url: $form.attr("action"), // action should specify the response format with .json at the end of url
      data: formData,
      type: $form.attr("method") || 'GET',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
      success: function(data) {
        window.location.reload();
      },
      error: function(data) {
        const errors = $errors[0]
        const JSONData = data.responseJSON
        Object.keys(JSONData).forEach(function(key) {
          let div = document.createElement("div");
          div.innerHTML = key + " : " + JSONData[key].join(", ");
          errors.appendChild(div);
        });
        $errors.show();
      },
    });
  });

  // Registered Guests on managed-meetings
  lazyLoadScript("https://laurent-d.github.io/gctheme/templates/website/js/meeting-registered-guests.1.0.0.js", "[data-section-type='managed-meetings-list']");

  // Managed sessions search
  $(document).on("change", ".managed-sessions-search-form .session-type-filter", function() {
    const filterValue = $(this).val(),
          $sessionItems = $(".guest-sessions").find(".guest-session");

    if (filterValue !== "") {
      $sessionItems.each(function() {
        const sessionType = $(this).attr("data-session-type");

        if (sessionType !== filterValue) {
          $(this).addClass("hide");
        } else {
          $(this).removeClass("hide");
        }
      });
    } else {
      $sessionItems.removeClass("hide");
    }
  });

  // Managed meetings search
  $(document).on("change", ".managed-meetings-search-form .speaker-filter", function () {
    const filterValue = $(this).val(),
          $meetingItems = $(".guest-meetings-list").find(".guest-meeting"),
          $meetingDays = $(".guest-meetings-list").find(".meetings-day-wrapper"),
          $noResult = $(".guest-meetings-list").find(".no-results-meeting-filters");

    if (filterValue !== "") {
      $meetingItems.each(function () {
        const $meetingItem = $(this),
              meetingSpeakerIds = $meetingItem.attr("data-speaker-ids").split(","),
              $meetingDayWrapper = $meetingItem.closest(".meetings-day-wrapper");

        if (meetingSpeakerIds.indexOf(filterValue) !== -1) {
          $meetingItem.removeClass("hide");
          $meetingDayWrapper.removeClass("hide");
          $meetingDayWrapper.find(".panel-collapse.collapse").collapse('show');
        } else {
          $meetingItem.addClass("hide");
          if ($meetingDayWrapper.find(".guest-meeting:visible").length === 0)
            $meetingDayWrapper.addClass("hide");
        }
      });

      if ($meetingDays.is(':visible'))
        $noResult.addClass("hide");
      else
        $noResult.removeClass("hide");
    } else {
      $meetingItems.removeClass("hide");
      $meetingDays.removeClass("hide");
      $meetingDays.find(".panel-collapse.collapse").collapse('show');
      $noResult.addClass("hide");
    }
  });

  // Meetings in guest-info
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/js/meetings.js", "[data-section-type='guest-info'] .meeting-modal-button", function () {
    lazyLoadStylesheet("https://applidget.github.io/vx-assets/templates/website/css/datepicker-skin-em.css");
  });

  // LEAD REQUESTS
  $(document).on("click", "[data-lead-request-status]", function(e) {
    e.preventDefault();
    const errorMessage = $(this).attr("data-error-message");
    const leadRequestId = $(this).closest("tr").attr("id");

    $.ajax({
      type: "GET",
      url: $(this).attr("data-url"),
      contentType: "application/json",
      dataType: "json"
    }).fail(function() {
      if (errorMessage)
        alert(errorMessage);
    }).success(function(data) {
      $("#" + leadRequestId).remove();
      $("#lead-requests-count").text(parseInt($("#lead-requests-count").text()) - 1);
    });
  });

  // Live button
  $(document).on("mouseover", "[data-live-open-at]", function() {
    const openDate = $(this).attr("data-live-open-at");

    if (secondsUntilDate(openDate) < 0) { // has already begun
      $(this).tooltip("destroy");
    }
  });

  $(document).on("click", "[data-live-open-at]", function(e) {
    const openDate = $(this).attr("data-live-open-at");

    if (secondsUntilDate(openDate) >= 0) { // has not already begun
      e.preventDefault();
    }
  });
});

function initLiveSessionCountdown($sessionLive, date, $elt, finishCallback) {
  var timeDays = $sessionLive.data('days');
  $elt.countdown(date, function(event) {
    if (event.elapsed) {
      finishCallback.call(this);
    } else {
      countdownStr = "";
      if (event.offset.totalDays > 0)
        countdownStr += "<span>%D " + timeDays + "</span> ";
      if (event.offset.totalHours > 0)
        countdownStr += "<span>%H:</span>";

      countdownStr += "<span>%M:</span>";
      countdownStr += "<span>%S</span>";

      $elt.html(event.strftime(countdownStr));
    }
  }).on('finish.countdown', function() {
    finishCallback.call(this);
  });
}

function videoArchivesChained() {
  const chainedVideos = document.getElementById("video-archives");
  const firstVideoSrc = document.querySelector("#video-archives source:first-child");
  const lastVideoSrc = document.querySelector("#video-archives source:last-child");
  firstVideoSrc.classList.add("active-source");
  lastVideoSrc.classList.add("last-source");
  chainedVideos.addEventListener('ended', function() {
    const activeVideoSrc = document.querySelector("#video-archives source.active-source");
    const nextVideoSrc = document.querySelector("#video-archives source.active-source + source") || firstVideoSrc;
    activeVideoSrc.classList.remove("active-source");
    nextVideoSrc.classList.add("active-source");
    chainedVideos.src = nextVideoSrc.src;
    chainedVideos.play();
    if (activeVideoSrc.classList.contains("last-source")) {
      chainedVideos.pause();
      chainedVideos.currentTime = 0;
    }
  });
}

// Images LazyLoad
new LazyLoad();

function mutipickListCallback($guest) {
  const multipleSelectCount = $guest.find('select[multiple=multiple]').length
  let nbInitialized = 0;

  function afterInitialized() {
    nbInitialized += 1;

    // when all SOL components are initialized
    if (multipleSelectCount == nbInitialized && $guest.find('[data-copy-from]').length > 0 && typeof CopyFromField === 'function') {
      // needs to be asynchronous because of SOL name attribute being removed asynchronously and preventing copy binding to work
      setTimeout(function () {
        CopyFromField.init();
      }, 50);
    }
  }

  $guest.find('select[multiple=multiple]').each(function () {
    $select = $(this);

    $select.attr('data-name', $select.attr('name'));
    var params = setDefaultParams($select);
    params = handleEdition($select, params);
    params = setSelectAllOption($select, params);
    params = bindEvents($select, params, afterInitialized);

    $select.searchableOptionList(params);

    if ($select.data('type') == "speakers") {
      $select.closest('form').on('submit', function() {
        $(document).find('select[multiple=multiple][data-type=speakers]').each(function() {
          formatSpeakersFormData($(this));
        });
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
  script.src = 'https://applidget.github.io/vx-assets/shared/js/url-params-tracking/1.0.1/url-params-tracking.js';
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

function secondsUntilDate(date) {
  return (Date.parse(date) - Date.now()) / 1000;
}

// appends script into body if DOM element matches selector
function lazyLoadScript(scriptUrl, selector, callback, bindLinkedGuestEvent) {
  if (bindLinkedGuestEvent === void 0) {
    bindLinkedGuestEvent = true;
  }
  if ($('script[src="' + scriptUrl + '"]').length == 0) {
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
    } else if (bindLinkedGuestEvent) {
      $(document).on('click', '.add-linked-guest', function (event) {
        $('.add-linked-guest').unbind(event);
        lazyLoadScript(scriptUrl, selector, callback, false);
      });
    }
  } else if (callback && (!selector || $(selector).length > 0)) {
    callback(null, null);
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
