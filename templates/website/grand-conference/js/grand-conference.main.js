/* GRAND CONFERENCE ADD-ON F(X) */

window.addEventListener("DOMContentLoaded", function (event) {

  /* Waiting for f(x) utility */
  var waitForGlobal = function(key, callback) {
    if (window[key]) {
      callback();
    } else {
      setTimeout(function() {
        waitForGlobal(key, callback);
      }, 100);
    }
  };

  /* Charts-columns */
  var getCounter = function () {
    "use strict";

    function getCounter(startCount, endCount, timer, html) {
      this.startCount = startCount;
      this.endCount = endCount;
      this.timer = timer * 1000 / endCount;
      this.html = html;
    }

    var _proto = getCounter.prototype;

    _proto.startCounter = function startCounter(inc, unit) {
      var startTm = this.startCount, endTm = this.endCount;
      var increment = startTm < endTm ? inc : -1;
      var self = this;
      this.interval = setInterval(function () {
        startTm += increment;
        self.html.textContent = startTm + unit;
        if (startTm == endTm) {
          clearInterval(self.interval);
        }
      }, this.timer);
    };
    return getCounter;
  }();

  var chartsreveal = function chartsreveal(chartSection) {
    var NUMBER_TYPE = chartSection.dataset.chartsType;
    var charts = chartSection.querySelectorAll('.score');
    for (var i = 0; i < charts.length; i++) {
      var val = charts[i].querySelector('data-chart').textContent;
      var textDisplay = charts[i].querySelector('.js-text');
      if (NUMBER_TYPE == "graph") {
        var chart = charts[i].querySelector('.js-circle');
        var radius = chart.getAttribute('r');
        var diameter = Math.round(Math.PI * radius * 2);
        var getOffset = function getOffset(val) {
          if (val === void 0) {
            val = 0;
          }
          return Math.round((100 - val) / 100 * diameter);
        };
        chart.style.strokeDashoffset = getOffset(val);
        var unit = "%";
        var inc = 1;
      } else {
        var inc = val.length > 3 ? 10 : 1;
        var unit = "";
      }
      var counter = new getCounter(0, val, 1, textDisplay);
      counter.startCounter(inc, unit);
    }
  };


  lazyLoadScript("https://cdn.jsdelivr.net/npm/in-view@0.6.1/dist/in-view.min.js", "[data-section-type='charts-column']", function () {
    inView.offset(200);
    inView('.toReveal').on('enter', function (chartSection) {
        chartsreveal(chartSection);
    });
  });

  /* Charts-columns */

  /* Slideshow */
  function checkWrap($carousel, imageSelector) {
    // if sum(carousel-cell width) > carousel width then wrap else not
    var cells = $carousel.querySelectorAll(imageSelector);
    if ($carousel && cells) {
      var cellsTotalWidth = 0;
      cells.forEach(function (cell) {
        var style = window.getComputedStyle(cell);
        cellsTotalWidth +=
          parseFloat(style.width) +
          parseFloat(style.marginRight) +
          parseFloat(style.marginLeft);
      });
      var carouselWidth = parseFloat(window.getComputedStyle($carousel).width);
      return cellsTotalWidth > carouselWidth;
    } else {
      return false;
    }
  }

  function initFlkty(selector, imageSelector) {
    var $carouselContainers = document.querySelectorAll(selector);
    for (var i = 0; i < $carouselContainers.length; i++) {
      var $containerElem = $carouselContainers[i];
      var autoPlaySpeed = parseInt($containerElem.getAttribute("data-autoplay-delay"), 10);
      var needWrap = checkWrap($containerElem, imageSelector);
      if (needWrap) {
        var alignCell = "left";
        var autoPlayDelay = autoPlaySpeed;
      } else {
        var alignCell = "center";
        var autoPlayDelay = false;
      }
      var flktyOptions = {
        // options
        contain: true,
        imagesLoaded: true,
        wrapAround: needWrap,
        autoPlay: autoPlayDelay,
        cellAlign: alignCell,
        prevNextButtons: false,
        pageDots: false,
        on: { ready: function() {
          $containerElem.classList.add('slideshow_ready');
        }}
      };
      var flkty = new Flickity($containerElem, flktyOptions);
    }
  }

  lazyLoadStylesheet("https://unpkg.com/flickity@2/dist/flickity.min.css", ".slideshow_enabled");
  lazyLoadScript("https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js", ".slideshow_enabled", function () {
      initFlkty(".slideshow_enabled", ".images-list-item");
      window.addEventListener("resize", function () {
        initFlkty(".slideshow_enabled", ".images-list-item");
      });
  });

  /* Source : https://codepen.io/anon/pen/OaYVZr FOR AUTOPLAY AND WRAPPARROUND */
  // external js: flickity.pkgd.js

  /* Slideshow */

  /* Synoptique */
  lazyLoadScript("https://cdn.jsdelivr.net/npm/body-scroll-lock@2.6.1/lib/bodyScrollLock.min.js", "[data-section-type='sessions-list-synoptique']");
  lazyLoadScript("https://asvd.github.io/syncscroll/syncscroll.js", "[data-section-type='sessions-list-synoptique']", function () {
    if ($('[data-section-type="sessions-list-synoptique"] .filter-container').length > 0) {
      $(window).on('load resize', function () {
        /* Enable fixed filter */
        if ($(document).outerWidth() > 767) {
          $('[data-section-type="sessions-list-synoptique"] .filter-container').affix({
            offset: {
              top: $('[data-section-type="sessions-list-synoptique"]').offset().top - 20,
              bottom: ($('footer').outerHeight(true) + 85)
            }
          });
        } else {
          $('[data-section-type="sessions-list-synoptique"] .filter-container').removeClass("affix");
        }
      });
    }

    /* Enhance scroll with disable hover on scroll */
    var timer;
    $(document).on('scroll', function () {
      clearTimeout(timer);
      if (!$('body').hasClass('disable-hover')) {
        $('body').addClass('disable-hover')
      }
      timer = setTimeout(function() {
        $('body').removeClass('disable-hover')
      }, 500);
    });

    /* init to first date  and change the behavior of the checkbox dates */
    var $checkedDates = $('[data-section-type="sessions-list-synoptique"] .search-filter input[type=radio][name^=dates]')
    if (!$checkedDates.is(':checked')) {
      $checkedDates.first().trigger('click').prop('checked', true);
      $checkedDates.first().parent().addClass("active");
    } else {
      $checkedDates.filter(':checked').parent().addClass("active");
    }

    $(document).on('click', '.day-selector .button', function() {
      $('.day-selector .button').removeClass("active");
      $(this).addClass("active");
    });

    $(document).on('click', '.filter-button', function() {
      $('.filter-container .panel').toggleClass('open');
    });
  });
  /* Synoptique */

  /* FAQ */
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/accordion.min.js", "[data-section-type='faq']");
  /* FAQ */

  /* MAP */
  function extendMap() {
    if ( $(".map_shortcode_wrapper").height() > $(".map_shortcode_wrapper").siblings('.standard_wrapper').height()  ) {
    } else {
      var extended = $(".map_shortcode_wrapper").siblings('.standard_wrapper').height() + 60;
      $(".map_shortcode_wrapper").height(extended);
    };
  }

  if ($("[data-section-type='map']").length > 0) {
    $("[data-section-type='map']").each(function () {

      var apiKey = $(this).attr("data-api-key");
      if (apiKey != null) {
        lazyLoadScript("https://maps.googleapis.com/maps/api/js?&key=" + apiKey);
      }

      waitForGlobal("google", function() {
        lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/jquery.simplegmaps.min.js", "[data-section-type='map']", function () {
          $( window ).resize(function() {
            extendMap();
          });

          $(document).ready(function () {
            extendMap();
            $("[data-section-type='map'] .map_shortcode_wrapper").simplegmaps({
              MapOptions: {
                zoom: 14,
                scrollwheel: false,
                styles: [
                  {
                    "featureType": "administrative.country",
                    "elementType": "labels.text",
                    "stylers": [{ "lightness": "29" }]
                  },
                  {
                    "featureType": "administrative.province",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      { "lightness": "-12" },
                      { "color": "#796340" }
                    ]
                  },
                  {
                    "featureType": "administrative.locality",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      { "lightness": "15" },
                      { "saturation": "15" }
                    ]
                  },
                  {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry",
                    "stylers": [
                      { "visibility": "on" },
                      { "color": "#fbf5ed" }
                    ]
                  },
                  {
                    "featureType": "landscape.natural",
                    "elementType": "geometry",
                    "stylers": [
                      { "visibility": "on" },
                      { "color": "#fbf5ed" }
                    ]
                  },
                  {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "off" }]
                  },
                  {
                    "featureType": "poi.attraction",
                    "elementType": "all",
                    "stylers": [
                      { "visibility": "on" },
                      { "lightness": "30" },
                      { "saturation": "-41" },
                      { "gamma": "0.84" }
                    ]
                  },
                  {
                    "featureType": "poi.attraction",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "on" }]
                  },
                  {
                    "featureType": "poi.business",
                    "elementType": "all",
                    "stylers": [{ "visibility": "off" }]
                  },
                  {
                    "featureType": "poi.business",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "off" }]
                  },
                  {
                    "featureType": "poi.medical",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#fbd3da" }]
                  },
                  {
                    "featureType": "poi.medical",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "on" }]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [
                      { "color": "#b0e9ac" },
                      { "visibility": "on" }
                    ]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "on" }]
                  },
                  {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [
                      { "hue": "#68ff00" },
                      { "lightness": "-24" },
                      { "gamma": "1.59" }
                    ]
                  },
                  {
                    "featureType": "poi.sports_complex",
                    "elementType": "all",
                    "stylers": [{ "visibility": "on" }]
                  },
                  {
                    "featureType": "poi.sports_complex",
                    "elementType": "geometry",
                    "stylers": [
                      { "saturation": "10" },
                      { "color": "#c3eb9a" }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "geometry.stroke",
                    "stylers": [
                      { "visibility": "on" },
                      { "lightness": "30" },
                      { "color": "#e7ded6" }
                    ]
                  },
                  {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [
                      { "visibility": "on" },
                      { "saturation": "-39" },
                      { "lightness": "28" },
                      { "gamma": "0.86" }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                      { "color": "#ffe523" },
                      { "visibility": "on" }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                      { "visibility": "on" },
                      { "saturation": "0" },
                      { "gamma": "1.44" },
                      { "color": "#fbc28b" }
                    ]
                  },
                  {
                    "featureType": "road.highway",
                    "elementType": "labels",
                    "stylers": [
                      { "visibility": "on" },
                      { "saturation": "-40" }
                    ]
                  },
                  {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [{ "color": "#fed7a5" }]
                  },
                  {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                      { "visibility": "on" },
                      { "gamma": "1.54" },
                      { "color": "#fbe38b" }
                    ]
                  },
                  {
                    "featureType": "road.local",
                    "elementType": "geometry.fill",
                    "stylers": [
                      { "color": "#ffffff" },
                      { "visibility": "on" },
                      { "gamma": "2.62" },
                      { "lightness": "10" }
                    ]
                  },
                  {
                    "featureType": "road.local",
                    "elementType": "geometry.stroke",
                    "stylers": [
                      { "visibility": "on" },
                      { "weight": "0.50" },
                      { "gamma": "1.04" }
                    ]
                  },
                  {
                    "featureType": "transit.station.airport",
                    "elementType": "geometry.fill",
                    "stylers": [{ "color": "#dee3fb" }]
                  },
                  {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                      { "saturation": "46" },
                      { "color": "#a4e1ff" }
                    ]
                  }
                ],
              }
            });
          });
        });
      });
    });
  }
  /* MAP */

  /* COUNTDOWN */
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/jquery.countdown.js", "[data-section-type='image-with-overlay'] .countdown, [data-section-type='countdown'] .countdown", function () {
    $('.countdown').each(function() {
      var dataDate = $(this).attr('data-date');
      $(this).countdown(dataDate, function(event) {
        var weeks = event.offset.weeks;
        var days = event.offset.totalDays;
        var format = $(this).attr('data-format-date');
        if (event.offset.weeks > 0 && format != "dd-hh-mn-ss" ) {
          var clock = $(this).html(event.strftime(''
          + '<div class="clock_bg"><div class="clock_counter">%w</div><div class="clock_label">' + time_weeks + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%d</div><div class="clock_label">' + time_days + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%H</div><div class="clock_label">' + time_hours + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%M</div><div class="clock_label">' + time_minutes + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%S</div><div class="clock_label">' + time_seconds + '</div></div>'));
        } else if (event.offset.totalDays > 0 && format == "dd-hh-mn-ss") {
          var clock = $(this).html(event.strftime(''
          + '<div class="clock_bg"><div class="clock_counter">%D</div><div class="clock_label">' + time_days + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%H</div><div class="clock_label">' + time_hours + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%M</div><div class="clock_label">' + time_minutes + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%S</div><div class="clock_label">' + time_seconds + '</div></div>'));
        } else if (event.offset.totalDays > 0) {
          var clock = $(this).html(event.strftime(''
          + '<div class="clock_bg"><div class="clock_counter">%d</div><div class="clock_label">' + time_days + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%H</div><div class="clock_label">' + time_hours + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%M</div><div class="clock_label">' + time_minutes + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%S</div><div class="clock_label">' + time_seconds + '</div></div>'));
        } else {
          var clock = $(this).html(event.strftime(''
          + '<div class="clock_bg"><div class="clock_counter">%H</div><div class="clock_label">' + time_hours + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%M</div><div class="clock_label">' + time_minutes + '</div></div>'
          + '<div class="clock_bg"><div class="clock_counter">%S</div><div class="clock_label">' + time_seconds + '</div></div>'));
        }
      });
    });
  });
  /* COUNTDOWN */

  /* popin-offer */
  lazyLoadScript("https://cdn.jsdelivr.net/npm/body-scroll-lock@2.6.1/lib/bodyScrollLock.min.js", "[data-section-type='popin-offer']", function () {
    $("[data-section-type='popin-offer']").each(function() {
      var $sectionPopinOffer = $(this);
      var timing = $sectionPopinOffer.attr('data-timing-event');

      // Fix for scroll iframe on iOs 12 from https://stackoverflow.com/questions/52826005/workaround-for-ios-10-12-webkit-safari-chrome-iframe-focus-bug */
      document.addEventListener('touchstart', {});

      var modoffer = $sectionPopinOffer[0];
      var uiclose = $sectionPopinOffer.find('.ui_close')[0];
      var modal_content = $sectionPopinOffer.find('.modal_content')[0];

      uiclose.onclick = function () {
        modoffer.classList.remove('open');
        bodyScrollLock.enableBodyScroll(modal_content);
      }
      var displaymodal = function () {
        modoffer.classList.add('open');
        bodyScrollLock.disableBodyScroll(modal_content);
      };
      setTimeout(displaymodal, timing);
    });
  });
  /* popin-offer */

  /* REVSLIDER VIDEO */
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/revslider/extensions/revolution.extension.video.min.js", "[data-overlay-mode^='video']");
  /* REVSLIDER VIDEO */

  /* Image with overlay - REVSLIDER */
  if ($('[data-section-type="image-with-overlay"]').length > 0) {
    $('[data-section-type="image-with-overlay"]').each(function() {
      $section = $(this);
      if ($section.find(".rev_slider").revolution == undefined) {
        revslider_showDoubleJqueryError(".rev_slider");
      } else if ($section.attr("data-js-setting")) {
        $section.find(".rev_slider").show().revolution({
          sliderType: "hero",
          jsFileLocation: "https://applidget.github.io/vx-assets/templates/website/grand-conference/js/revslider/",
          sliderLayout: $section.attr("data-js-setting"),
          dottedOverlay: "none",
          delay: 9000,
          navigation: {
            onHoverStop: "off",
          },
          visibilityLevels: [1240, 1024, 778, 480],
          gridwidth: 1240,
          gridheight: 800,
          lazyType: "none",
          shadow: 0,
          spinner: "spinner3",
          stopLoop: "off",
          stopAfterLoops: -1,
          stopAtSlide: -1,
          shuffle: "off",
          disableProgressBar: "on",
          hideThumbsOnMobile: "off",
          hideSliderAtLimit: 0,
          hideCaptionAtLimit: 0,
          hideAllCaptionAtLilmit: 0,
          debugMode: false,
          fallbacks: {
            simplifyAll: "off",
            nextSlideOnWindowFocus: "off",
            disableFocusListener: false,
          }
        });
      }
    });
  }
  /* Image with overlay - REVSLIDER */


  /* Session LIST Grand Conf*/
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/jquery.masory.js","[data-section-type='sessions-list']", function () {

    /* set grid */
    var grid = $('.session-wrapper').masonry({
      itemSelector: '.scheduleday_wrapper',
      columnWidth: '.sizer',
      gutter: 20
    });

    /* Check empty session on class changed */
    $(".session-item").bind('classChanged', debounce(sessionlistEmptyCheck, 100, false));

    /* Expand div for description */
    $('li .session_content_wrapper.expandable').on('click', function (e) {
      var targetID = $(this).attr('data-expandid');
      $('#' + targetID).toggleClass('hide');
      $(this).toggleClass('active');
      grid.masonry();
    });

    /* Add active class if checked for filters*/
    $(".filter-container .checkbox").each(function () {
      if ($(this).find('input:checked').length > 0) {
        $(this).addClass("active");
      } else {
        $(this).show();
      }
    });

    /* Avoid propagation on register unregister */
    $("li .session_content_wrapper.expandable a").on('click', function (e) {
      e.stopPropagation();
      grid.masonry();
    });

    /* init */
    sessionlistEmptyCheck();
    $('.session-container').toggleClass("ready");

    /* Extend addClass and removeClass (jQuery) to have a ClassChanged trigger */
    var originalAddClassMethod = $.fn.addClass;
    var originalRemoveClassMethod = $.fn.removeClass;
    $.fn.addClass = function () {
      var result = originalAddClassMethod.apply(this, arguments);
      $(this).trigger('classChanged');
      return result;
    }
    $.fn.removeClass = function () {
      var result = originalRemoveClassMethod.apply(this, arguments);
      $(this).trigger('classChanged');
      return result;
    }

    /* Debounce function to avoid multiple call need to be scoped */
    function debounce(callback, delay) {
      var timer;
      return function () {
        var args = arguments;
        var context = this;
        clearTimeout(timer);
        timer = setTimeout(function () {
          callback.apply(context, args);
        }, delay)
      }
    }

    function sessionlistEmptyCheck() {
      $(".scheduleday_wrapper").each(function () {
        if ($(this).find('.session-item').length == $(this).find('.session-item.hide').length) {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
      grid.masonry();
    }

  });
  /* Session LIST Grand Conf*/

});
