$(function () {
  // Charts-columns
  lazyLoadScript("https://cdn.jsdelivr.net/npm/in-view@0.6.1/dist/in-view.min.js", "[data-section-type='charts-column']", function () {
    inView.offset(200);
    inView('.toReveal').on('enter', function (chartSection) {
      chartsreveal(chartSection);
    });
  });

  // Slideshow
  lazyLoadStylesheet("https://unpkg.com/flickity@2/dist/flickity.min.css", ".slideshow_enabled");
  lazyLoadScript("https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js", ".slideshow_enabled", function () {
    initFlkty(".slideshow_enabled", ".images-list-item");
    window.addEventListener("resize", function () {
      initFlkty(".slideshow_enabled", ".images-list-item");
    });
    /*
     *  Source : https://codepen.io/anon/pen/OaYVZr FOR AUTOPLAY AND WRAPPARROUND
     *  external js: flickity.pkgd.js
    */
  });

  // Synoptique
  lazyLoadScript("https://cdn.jsdelivr.net/npm/body-scroll-lock@2.6.1/lib/bodyScrollLock.min.js", "[data-section-type='sessions-list-synoptique']");
  lazyLoadScript("https://asvd.github.io/syncscroll/syncscroll.js", "[data-section-type='sessions-list-synoptique']", function () {
    var $sectionSynoptique = $('[data-section-type="sessions-list-synoptique"]'),
      $filterContainer = $sectionSynoptique.find('.filter-container');

    if ($filterContainer.length > 0) {
      $(window).on('load resize', function () {
        // Enable fixed filter
        if ($(document).outerWidth() > 767) {
          $filterContainer.affix({
            offset: {
              top: $sectionSynoptique.offset().top - ($(window).height() / 2),
              bottom: ($('footer').outerHeight(true) + 85)
            }
          });
        } else {
          $filterContainer.removeClass("affix");
        }
      });
    }

    // Enhance scroll with disable hover on scroll
    var timer;
    $(document).on('scroll', function () {
      clearTimeout(timer);
      if (!$('body').hasClass('disable-hover')) {
        $('body').addClass('disable-hover')
      }
      timer = setTimeout(function () {
        $('body').removeClass('disable-hover')
      }, 500);
    });

    // init to first date  and change the behavior of the checkbox dates
    var $checkedDates = $sectionSynoptique.find('.search-filter input[type=radio][name^=dates]');
    if (!$checkedDates.is(':checked')) {
      $checkedDates.first().trigger('click').prop('checked', true);
      $checkedDates.first().parent().addClass("active");
    } else {
      $checkedDates.filter(':checked').parent().addClass("active");
    }

    $(document).on('click', '.day-selector .button', function () {
      $('.day-selector .button').removeClass("active");
      $(this).addClass("active");
    });

    $(document).on('click', '.filter-button', function () {
      $('.filter-container .panel').toggleClass('open');
    });
  });

  // FAQ
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/accordion.min.js", "[data-section-type='faq']");

  // MAP
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/jquery.simplegmaps.min.js", "[data-section-type='map']", function () {
    $("[data-section-type='map']").each(function () {
      var apiKey = $(this).attr("data-api-key");
      if (apiKey != null) {
        lazyLoadScript("https://maps.googleapis.com/maps/api/js?&key=" + apiKey);
      }
      waitForGlobal("google", function () {
        $("[data-section-type='map'] .map_shortcode_wrapper").simplegmaps({
          MapOptions: {
            zoom: 14,
            scrollwheel: false,
            styles: [{
                "featureType": "administrative.country",
                "elementType": "labels.text",
                "stylers": [{
                  "lightness": "29"
                }]
              },
              {
                "featureType": "administrative.province",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "lightness": "-12"
                  },
                  {
                    "color": "#796340"
                  }
                ]
              },
              {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "lightness": "15"
                  },
                  {
                    "saturation": "15"
                  }
                ]
              },
              {
                "featureType": "landscape.man_made",
                "elementType": "geometry",
                "stylers": [{
                    "visibility": "on"
                  },
                  {
                    "color": "#fbf5ed"
                  }
                ]
              },
              {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [{
                    "visibility": "on"
                  },
                  {
                    "color": "#fbf5ed"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{
                  "visibility": "off"
                }]
              },
              {
                "featureType": "poi.attraction",
                "elementType": "all",
                "stylers": [{
                    "visibility": "on"
                  },
                  {
                    "lightness": "30"
                  },
                  {
                    "saturation": "-41"
                  },
                  {
                    "gamma": "0.84"
                  }
                ]
              },
              {
                "featureType": "poi.attraction",
                "elementType": "labels",
                "stylers": [{
                  "visibility": "on"
                }]
              },
              {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [{
                  "visibility": "off"
                }]
              },
              {
                "featureType": "poi.business",
                "elementType": "labels",
                "stylers": [{
                  "visibility": "off"
                }]
              },
              {
                "featureType": "poi.medical",
                "elementType": "geometry",
                "stylers": [{
                  "color": "#fbd3da"
                }]
              },
              {
                "featureType": "poi.medical",
                "elementType": "labels",
                "stylers": [{
                  "visibility": "on"
                }]
              },
              {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#b0e9ac"
                  },
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "labels",
                "stylers": [{
                  "visibility": "on"
                }]
              },
              {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "hue": "#68ff00"
                  },
                  {
                    "lightness": "-24"
                  },
                  {
                    "gamma": "1.59"
                  }
                ]
              },
              {
                "featureType": "poi.sports_complex",
                "elementType": "all",
                "stylers": [{
                  "visibility": "on"
                }]
              },
              {
                "featureType": "poi.sports_complex",
                "elementType": "geometry",
                "stylers": [{
                    "saturation": "10"
                  },
                  {
                    "color": "#c3eb9a"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "visibility": "on"
                  },
                  {
                    "lightness": "30"
                  },
                  {
                    "color": "#e7ded6"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "on"
                  },
                  {
                    "saturation": "-39"
                  },
                  {
                    "lightness": "28"
                  },
                  {
                    "gamma": "0.86"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ffe523"
                  },
                  {
                    "visibility": "on"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "visibility": "on"
                  },
                  {
                    "saturation": "0"
                  },
                  {
                    "gamma": "1.44"
                  },
                  {
                    "color": "#fbc28b"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "on"
                  },
                  {
                    "saturation": "-40"
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [{
                  "color": "#fed7a5"
                }]
              },
              {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{
                    "visibility": "on"
                  },
                  {
                    "gamma": "1.54"
                  },
                  {
                    "color": "#fbe38b"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ffffff"
                  },
                  {
                    "visibility": "on"
                  },
                  {
                    "gamma": "2.62"
                  },
                  {
                    "lightness": "10"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "visibility": "on"
                  },
                  {
                    "weight": "0.50"
                  },
                  {
                    "gamma": "1.04"
                  }
                ]
              },
              {
                "featureType": "transit.station.airport",
                "elementType": "geometry.fill",
                "stylers": [{
                  "color": "#dee3fb"
                }]
              },
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "saturation": "46"
                  },
                  {
                    "color": "#a4e1ff"
                  }
                ]
              }
            ],
          }
        });
      });
    });
  });

  // COUNTDOWN
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/jquery.countdown.js", "[data-section-type='image-with-overlay'] .countdown, [data-section-type='countdown'] .countdown", function () {
    $('.countdown').each(function () {
      //Fix data-weeks etc !
      var $countdown = $(this),
        countdownDate = $countdown.attr('data-date');
        $translationsDiv = $countdown.siblings(".countdown-translations"),
        timeWeeks = $translationsDiv.attr('data-weeks'),
        timeDays = $translationsDiv.attr('data-days'),
        timeHours = $translationsDiv.attr('data-hours'),
        timeMinutes = $translationsDiv.attr('data-minutes'),
        timeSeconds = $translationsDiv.attr('data-seconds');

        $countdown.countdown(countdownDate, function (event) {
        var format = $(this).attr('data-format-date');

        if (event.offset.weeks > 0 && format != "dd-hh-mn-ss") {
          $(this).html(event.strftime(
            `<div class="clock_bg">
              <div class="clock_counter">%w</div>
              <div class="clock_label">` + timeWeeks + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%d</div>
              <div class="clock_label">` + timeDays + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%H</div>
              <div class="clock_label">` + timeHours + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%M</div>
              <div class="clock_label">` + timeMinutes + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%S</div>
              <div class="clock_label">` + timeSeconds + `</div>
            </div>`
          ));
        } else if (event.offset.totalDays > 0 && format == "dd-hh-mn-ss") {
          $(this).html(event.strftime(
            `<div class="clock_bg">
              <div class="clock_counter">%D</div>
              <div class="clock_label">` + timeDays + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%H</div>
              <div class="clock_label">` + timeHours + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%M</div>
              <div class="clock_label">` + timeMinutes + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%S</div>
              <div class="clock_label">` + timeSeconds + `</div>
            </div>`
          ));
        } else if (event.offset.totalDays > 0) {
          $(this).html(event.strftime(
            `<div class="clock_bg">
              <div class="clock_counter">%d</div>
              <div class="clock_label">` + timeDays + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%H</div>
              <div class="clock_label">` + timeHours + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%M</div>
              <div class="clock_label">` + timeMinutes + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%S</div>
              <div class="clock_label">` + timeSeconds + `</div>
            </div>`
          ));
        } else {
          $(this).html(event.strftime(
            `<div class="clock_bg">
              <div class="clock_counter">%H</div>
              <div class="clock_label">` + timeHours + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%M</div>
              <div class="clock_label">` + timeMinutes + `</div>
            </div>
            <div class="clock_bg">
              <div class="clock_counter">%S</div>
              <div class="clock_label">` + timeSeconds + `</div>
            </div>`
          ));
        }
      });
    });
  });

  // Popin-offer
  lazyLoadScript("https://cdn.jsdelivr.net/npm/body-scroll-lock@2.6.1/lib/bodyScrollLock.min.js", "[data-section-type='popin-offer']", function () {
    $("[data-section-type='popin-offer']").each(function () {
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

  // REVSLIDER VIDEO
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/revslider/extensions/revolution.extension.video.min.js", "[data-overlay-mode^='video']");

  // Image with overlay - REVSLIDER
  if ($('[data-section-type="image-with-overlay"]').length > 0) {
    $('[data-section-type="image-with-overlay"]').each(function () {
      var $sectionImageWithOverlay = $(this);
      var $imageWithOverlay = $(this).find(".rev-slidebg");

      if (window.innerWidth < 768 && $imageWithOverlay.attr('data-src-mobile') !== undefined ) {
        $imageWithOverlay.attr('src', $imageWithOverlay.data('src-mobile'));
      }

      if ($sectionImageWithOverlay.find(".rev_slider").revolution == undefined) {
        revslider_showDoubleJqueryError(".rev_slider");
      } else if ($sectionImageWithOverlay.attr("data-js-setting")) {
        $sectionImageWithOverlay.find(".rev_slider").show().revolution({
          sliderType: "hero",
          jsFileLocation: "https://applidget.github.io/vx-assets/templates/website/grand-conference/js/revslider/",
          sliderLayout: $sectionImageWithOverlay.attr("data-js-setting"),
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

  // Guests-list
  if ($("[data-section-type='guests-list']").length > 0) {
    // Add active class if checked for filters
    $(".guests-search-form .checkbox [type=checkbox]").on('change', function(e) {
      $checkbox = $(this);
      $label = $(this).closest('.checkbox');
      // debugger
      if ($checkbox.prop('checked')) {
        $label.addClass("active");
      } else {
        $label.removeClass("active");
      }
    });
  }

  // Sessions-list Grand Conference
  lazyLoadScript("https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.js", "[data-section-type='sessions-list']", function () {
    // set grid
    var grid = $('.session-wrapper').masonry({
      itemSelector: '.scheduleday_wrapper',
      horizontalOrder: true,
      columnWidth: '.sizer',
      gutter: 20
    });

    // Check empty session on class changed
    $(".session-item").bind('classChanged', debounce(sessionlistEmptyCheck, 100, false));

    // Expand div for description
    $('li .session_content_wrapper.expandable').on('click', function (e) {
      var targetID = $(this).attr('data-expandid');
      $('#' + targetID).toggleClass('hide');
      $(this).toggleClass('active');
      grid.masonry();
    });

    // Add active class if checked for filters
    $(".filter-container .checkbox").each(function () {
      if ($(this).find('input:checked').length > 0) {
        $(this).addClass("active");
      } else {
        $(this).show();
      }
    });

    // Avoid propagation on register unregister
    $("li .session_content_wrapper.expandable a:not(a[data-thematic-id])").on('click', function (e) {
      e.stopPropagation();
      grid.masonry();
    });

    // init
    sessionlistEmptyCheck();
    $('.session-container').toggleClass("ready");

    // Extend addClass and removeClass (jQuery) to have a ClassChanged trigger
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

    // Debounce function to avoid multiple call need to be scoped
    function debounce(callback, delay) {
      var timer;
      return function () {
        var args = arguments;
        var context = this;
        clearTimeout(timer);
        timer = setTimeout(function () {
          callback.apply(context, args);
        }, delay);
      }
    }

    function sessionlistEmptyCheck() {
      $(".session-wrapper .scheduleday_wrapper").each(function () {
        if ($(this).find('.session-item').length == $(this).find('.session-item.hide').length) {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
      grid.masonry();
    }
  });
});

// Waiting for f(x) utility
function waitForGlobal(key, callback) {
  if (window[key]) {
    callback();
  } else {
    setTimeout(function () {
      waitForGlobal(key, callback);
    }, 100);
  }
}

// Charts-columns
var getCounter = function getCounter() {
  "use strict";

  function getCounter(startCount, endCount, timer, html) {
    this.startCount = startCount;
    this.endCount = endCount;
    this.timer = timer * 1000 / endCount;
    this.html = html;
  }

  var _proto = getCounter.prototype;

  _proto.startCounter = function startCounter(inc, unit) {
    var startTm = this.startCount,
      endTm = this.endCount,
      increment = startTm < endTm ? inc : -1,
      self = this;

    this.interval = setInterval(function () {
      startTm += increment;
      self.html.textContent = startTm + unit;
      if (startTm >= endTm) {
        clearInterval(self.interval);
        self.html.textContent = endTm + unit;
      }
    }, this.timer);
  };
  return getCounter;
}();

function chartsreveal(chartSection) {
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
}

// Slideshow
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

    // autoGallerySize : false to use our CSS; true to let the lib do it
    var autoGallerySize = !($($containerElem).closest('.guests-slideshow').length > 0);
    var flktyOptions = {
      // options
      contain: true,
      imagesLoaded: true,
      wrapAround: needWrap,
      autoPlay: autoPlayDelay,
      cellAlign: alignCell,
      prevNextButtons: false,
      pageDots: false,
      setGallerySize: autoGallerySize,
      on: {
        ready: function () {
          $containerElem.classList.add('slideshow_ready');
        }
      }
    };
    var flkty = new Flickity($containerElem, flktyOptions);
  }
}
