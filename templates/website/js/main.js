$(function(){
  $('[data-section-type=map]').each(function(index, container) {
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

  $('[data-quantity]').on('change', function() {
    var $linkedGuestsBlock = $(this).siblings('[data-guest-category-id]');
    var guestCategoryId = $linkedGuestsBlock.attr('data-guest-category-id');
    $linkedGuestsBlock.html("");

    for (var i = 0; i < $(this).val(); i++) {
      $linkedGuestsBlock.append('<input type="hidden" name="linked_guests[' + i + '][guest_category_id]" value="' + guestCategoryId + '" data-linked-people="true" data-type="guest" data-index="' + i + '" />');
    }
  });

  if ($('.cart-container').length > 0) {
    /* Initalize Caddie for price refresh */
    window.caddie = new mobicheckin.registration.Caddie();
    window.caddie.bind();

    /* Enable fixed cart */
    if ($(document).outerWidth() > 767) {
      var top_cart = 0;
      $('body div[data-section-type]').each(function() {
        if($(this).attr('data-section-type') != "registration-form") {
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
  }

  // Sponsorship widget - Change button state when submitting form
  $(document).on('click', '.sponsorship-widget [type=submit]', function () {
    $(this).button('loading');
  });

  // Post Message
  var msgHandler = function(e) {
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
    window.parent.postMessage({'type': 'iframeSrcChange', 'url': window.location.href}, '*');
  }

  if ($('[data-section-type=add-to-calendar]').length > 0) {

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
(function() {
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = function() {
    window.eventmakerTracking.injectURLParamsInIframes();
  };
  script.src = 'https://applidget.github.io/vx-assets/shared/js/url-params-tracking/1.0.0/url-params-tracking.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}());

// Guest tracking
(function() {
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = function() {
    var paramSecret = $.getUrlVar(window.location.href, "secret");
    var paramGuestId = $.getUrlVar(window.location.href, "guest_id");
    var paramRegister = $.getUrlVar(window.location.href, "register");
    var paramStep = $.getUrlVar(window.location.href, "step");
    if (paramSecret && paramGuestId) {
      if (paramRegister) {
        document.cookie = 'guest_id=' + paramGuestId;
        document.cookie = 'secret=' + paramSecret;
        document.cookie = 'register=' + paramRegister;
      } else if (paramStep == "confirmation") {
        document.cookie = 'guest_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'secret=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'register=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    }
  };
  script.src = 'https://applidget.github.io/vx-assets/shared/js/get-url-vars.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}());

function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  return new Date(parts[0], parts[1]-1, parts[2], parts[3], parts[4], parts[5], parts[6]);
}
