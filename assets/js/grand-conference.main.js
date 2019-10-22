/* GRAND CONFERENCE ADD-ON F(X) */

window.addEventListener("DOMContentLoaded", function (event) {

  /* Charts-columns */
  class getCounter {
      constructor(startCount, endCount, timer, html) {
          this.startCount = startCount;
          this.endCount = endCount;
          this.timer = (timer * 1000) / endCount;
          this.html = html;
      }

      startCounter(inc, unit) {
          let startTm = this.startCount,
              endTm = this.endCount;
          // if you want it to add a number just replace the -1 with +1
          let increment = startTm < endTm ? inc : -1;
          let self = this;
          this.interval = setInterval(function () {
              startTm += increment;
              self.html.innerHTML = startTm + unit;
              if (startTm == endTm) {
                  clearInterval(self.interval);
              }
          }, this.timer);
      }
  }

  var chartsreveal = function (chartSection) {
      var NUMBER_TYPE = chartSection.dataset.chartsType;
      const charts = chartSection.querySelectorAll('.score');
      for (var i = 0; i < charts.length; i++) {
          var val = charts[i].querySelector('data-chart').innerHTML;
          var textDisplay = charts[i].querySelector('.js-text');
          if (NUMBER_TYPE == "graph") {
              var chart = charts[i].querySelector('.js-circle');
              var radius = chart.getAttribute('r')
              var diameter = Math.round(Math.PI * radius * 2)
              var getOffset = (val = 0) => Math.round((100 - val) / 100 * diameter)
              chart.style.strokeDashoffset = getOffset(val)
              //textDisplay.textContent = `${val}%`
              var unit = "%";
              var inc = 1;
          } else {
              var inc = (val.length > 3) ? 10 : 1;
              var unit = "";
          }
          var counter = new getCounter(0, val, 1, textDisplay);
          counter.startCounter(inc, unit);
      }
  }


  lazyLoadScript("https://cdn.jsdelivr.net/npm/in-view@0.6.1/dist/in-view.min.js", "[data-section-type='charts-column']", function () {
    inView.offset(200);
    inView('.toReveal').on('enter', function (chartSection) {
        chartsreveal(chartSection);
    });
  });

  /* Charts-columns */

  /* Slideshow */
  function checkWrap(container) {
    var carouselSelector = ".slideshow_enabled",
      cellSelector = ".images-list-item";
    // if sum(carousel-cell width) > carousel width then wrap else not
    var carousel = container;
    var cells = container.querySelectorAll(cellSelector);
    if (carousel && cells) {
      var cellsTotalWidth = 0;
      cells.forEach(cell => {
        var style = window.getComputedStyle(cell);
        cellsTotalWidth +=
          parseFloat(style.width) +
          parseFloat(style.marginRight) +
          parseFloat(style.marginLeft);
      });
      var carouselWidth = parseFloat(window.getComputedStyle(carousel).width);
      return cellsTotalWidth > carouselWidth;
    }
    return false;
  }

  function initFlkty() {
    var carouselContainers = document.querySelectorAll(".slideshow_enabled");
    for (var i = 0; i < carouselContainers.length; i++) {
      var container = carouselContainers[i];
      var autoPlaySpeed = parseInt(container.getAttribute("data-autoplay-delay"), 10);
      var needWrap = checkWrap(container);
      if (needWrap) {
        var alignCell = "left";
        var autoPlayDelay = autoPlaySpeed;
      } else {
        var alignCell = "center";
        var autoPlayDelay = false;
      }
      var flktyOptions = {
        // options
        imagesLoaded: true,
        wrapAround: needWrap,
        autoPlay: autoPlayDelay,
        cellAlign: alignCell,
        contain: true,
        prevNextButtons: true,
        pageDots: false,
        on: { ready: function() {
          container.classList.add('slideshow_ready');
        }}
      };
      var flkty = new Flickity(container, flktyOptions);
    }
  }

  lazyLoadStylesheet("https://unpkg.com/flickity@2/dist/flickity.min.css","[data-section-type='images-list']");
  lazyLoadScript("https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js","[data-section-type='images-list']",
    function () {
      initFlkty();
      window.addEventListener("resize", function () {
        initFlkty();
      });
    }
  );

  /* Source : https://codepen.io/anon/pen/OaYVZr FOR AUTOPLAY AND WRAPPARROUND */
  // external js: flickity.pkgd.js

/* Slideshow */

  /* Slideshow BIS */

  lazyLoadStylesheet("https://unpkg.com/flickity@2/dist/flickity.min.css","[data-section-type='guests-list-logo']");
  lazyLoadScript("https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js","[data-section-type='guests-list-logo']",
    function () {
      initFlkty();
      window.addEventListener("resize", function () {
        initFlkty();
      });
    }
  );

  /* Source : https://codepen.io/anon/pen/OaYVZr FOR AUTOPLAY AND WRAPPARROUND */
  // external js: flickity.pkgd.js

  /* Slideshow BIS */

/* Synoptique */
  lazyLoadStylesheet("https://unpkg.com/tippy.js@5/dist/backdrop.css", "[data-section-type='sessions-list-synoptique']");
  lazyLoadStylesheet("https://unpkg.com/tippy.js@5/dist/tippy.css", "[data-section-type='sessions-list-synoptique']");
  lazyLoadStylesheet("https://unpkg.com/tippy.js@5.0.1/themes/light.css", "[data-section-type='sessions-list-synoptique']");
  lazyLoadStylesheet("https://unpkg.com/tippy.js@5.0.1/animations/shift-away-subtle.css", "[data-section-type='sessions-list-synoptique']");
  lazyLoadScript("https://asvd.github.io/syncscroll/syncscroll.js", "[data-section-type='sessions-list-synoptique']");
  lazyLoadScript("https://unpkg.com/popper.js@1", "[data-section-type='sessions-list-synoptique']", function () {
    lazyLoadScript("https://unpkg.com/tippy.js@5", "[data-section-type='sessions-list-synoptique']", function () {

    if ($('.filter-container').length > 0) {
      $(window).on('load resize', function () {
        /* Enable fixed cart */
        if ($(document).outerWidth() > 767 && $('.grandconf .filter-container').length != 1 ) {
          var top_cart = 0;
          $('.filter-container').affix({
            offset: {
              top: $('[data-section-type="sessions-list-synoptique"]').offset().top,
              bottom: ($('footer').outerHeight(true) + 85)
            }
          });
          //$('.filter-container').css('width', $('.filter-container').parent().width());
        } else {
          $('.filter-container').removeClass("affix");
        }
      });
    }

    /* Enhance scroll with disable hover on scroll */
    var body = $('body')[0], timer;

    window.addEventListener('scroll', function() {
      clearTimeout(timer);
      if (!body.classList.contains('disable-hover')) {
        body.classList.add('disable-hover')
      }
      timer = setTimeout(function() {
        body.classList.remove('disable-hover')
      }, 500);
    }, false);

  /* init to first date  and change the behavior of the checkbox dates */
    if ($(".search-filter input[type=checkbox][name^=dates]:checked").length == 0) {
      $(".search-filter input[type=checkbox][name^=dates]").first().trigger( "click" );
      $(".search-filter input[type=checkbox][name^=dates]").first().prop('checked',true);
    }
    $(".search-filter input[type=checkbox][name^=dates]").change(function() {
      $(".search-filter input[type=checkbox][name^=dates]").prop('checked',false);
      $(this).prop('checked',true);
    });

    var item = $(".session-item");
    tippy('.session-item', {
      popperOptions: {
        positionFixed: true,
        modifiers: {
          computeStyle: { enabled: false, gpuAcceleration: false },
          preventOverflow: { padding: 0 },
            },
      },
      appendTo: document.body,
      animation: 'shift-away-subtle',
      theme: 'light',
      trigger: 'click',
      placement: 'top',
      maxWidth: 'none',
      interactive: true,
      arrow: false,
      content(reference) {return document.getElementById(reference.getAttribute('data-template'));}
    });

      // console.log("bup");
      // jQuery( ".open_mod" ).click(function() {
      //   // alert( "Hello World" );
      //   var toto = jQuery(this).parent().find("template").html();
      //   jQuery( ".modal_content" ).empty().append(toto);
      //   jQuery( ".modal" ).addClass("open");
      //   jQuery( "body" ).toggleClass('ovh');
      //   // console.log(toto);
      // });

      // jQuery( ".ui_close" ).click(function() {
      //   jQuery( ".modal" ).removeClass("open");
      //   jQuery( "body" ).toggleClass('ovh');
      //   jQuery( ".modal_content" ).empty();
      // });

      // jQuery( "a.open-trigger" ).click(function(event) {
      //   //event.preventDefault();
      //   //alert( "Hello World" );
      //   var hash = jQuery(this).attr('data-link');
      //   // console.log(hash);
      //   var coucou = jQuery( hash + ".open_mod").first();
      //   // console.log(coucou);
      //   jQuery( hash + " .open_mod:first").trigger("click");
      // });

  });
});

  /* Synoptique */

  /* FAQ */
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/accordion.min.js", "[data-section-type='faq']");
  /* FAQ */

  /* MAP */
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/jquery.simplegmaps.min.js", "[data-section-type='map']", function () {
    function extendMap() {
      if ( $(".map_shortcode_wrapper").height() > $(".map_shortcode_wrapper").siblings('.standard_wrapper').height()  ) {
      } else {
        var extended = $(".map_shortcode_wrapper").siblings('.standard_wrapper').height() + 60;
        $(".map_shortcode_wrapper").height(extended);
      };
    }


    $( window ).resize(function() {
      extendMap();
    });


    $(document).ready(function () {
      extendMap();
      $(".map_shortcode_wrapper").simplegmaps({
        debug: true,
        MapOptions: {
          zoom: 14,
          scrollwheel: false,
          styles: [{
            "featureType": "administrative.country",
            "elementType": "labels.text",
            "stylers": [{
              "lightness": "29"
            }]
          }, {
            "featureType": "administrative.province",
            "elementType": "labels.text.fill",
            "stylers": [{
              "lightness": "-12"
            }, {
              "color": "#796340"
            }]
          }, {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{
              "lightness": "15"
            }, {
              "saturation": "15"
            }]
          }, {
            "featureType": "landscape.man_made",
            "elementType": "geometry",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#fbf5ed"
            }]
          }, {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#fbf5ed"
            }]
          }, {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "poi.attraction",
            "elementType": "all",
            "stylers": [{
              "visibility": "on"
            }, {
              "lightness": "30"
            }, {
              "saturation": "-41"
            }, {
              "gamma": "0.84"
            }]
          }, {
            "featureType": "poi.attraction",
            "elementType": "labels",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "poi.business",
            "elementType": "all",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "poi.business",
            "elementType": "labels",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "poi.medical",
            "elementType": "geometry",
            "stylers": [{
              "color": "#fbd3da"
            }]
          }, {
            "featureType": "poi.medical",
            "elementType": "labels",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{
              "color": "#b0e9ac"
            }, {
              "visibility": "on"
            }]
          }, {
            "featureType": "poi.park",
            "elementType": "labels",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{
              "hue": "#68ff00"
            }, {
              "lightness": "-24"
            }, {
              "gamma": "1.59"
            }]
          }, {
            "featureType": "poi.sports_complex",
            "elementType": "all",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "poi.sports_complex",
            "elementType": "geometry",
            "stylers": [{
              "saturation": "10"
            }, {
              "color": "#c3eb9a"
            }]
          }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{
              "visibility": "on"
            }, {
              "lightness": "30"
            }, {
              "color": "#e7ded6"
            }]
          }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
              "visibility": "on"
            }, {
              "saturation": "-39"
            }, {
              "lightness": "28"
            }, {
              "gamma": "0.86"
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
              "color": "#ffe523"
            }, {
              "visibility": "on"
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
              "visibility": "on"
            }, {
              "saturation": "0"
            }, {
              "gamma": "1.44"
            }, {
              "color": "#fbc28b"
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [{
              "visibility": "on"
            }, {
              "saturation": "-40"
            }]
          }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
              "color": "#fed7a5"
            }]
          }, {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{
              "visibility": "on"
            }, {
              "gamma": "1.54"
            }, {
              "color": "#fbe38b"
            }]
          }, {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [{
              "color": "#ffffff"
            }, {
              "visibility": "on"
            }, {
              "gamma": "2.62"
            }, {
              "lightness": "10"
            }]
          }, {
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [{
              "visibility": "on"
            }, {
              "weight": "0.50"
            }, {
              "gamma": "1.04"
            }]
          }, {
            "featureType": "transit.station.airport",
            "elementType": "geometry.fill",
            "stylers": [{
              "color": "#dee3fb"
            }]
          }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
              "saturation": "46"
            }, {
              "color": "#a4e1ff"
            }]
          }],
        }
      });
    });
  });
  /* MAP */

  /* COUNTDOWN */
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/jquery.countdown.js", ".countdown", function () {
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
  lazyLoadScript("https://cdn.jsdelivr.net/npm/body-scroll-lock@2.6.1/lib/bodyScrollLock.min.js","[data-section-type='popin-offer']",
    function () {
      // Fix for scroll iframe on iOs 12 from https://stackoverflow.com/questions/52826005/workaround-for-ios-10-12-webkit-safari-chrome-iframe-focus-bug */
      document.addEventListener('touchstart', {});
        var modoffer = $('.modal-offer')[0];
        var uiclose = $('.ui_close')[0];
        var modal_content = $('.modal_content')[0];
        var timing = "{{ section.settings.timing-event | times: 1000 }}";

        uiclose.onclick = function (e) {
          modoffer.classList.remove('open');
          bodyScrollLock.enableBodyScroll(modal_content);
        }
        var displaymodal = function () {
          modoffer.classList.add('open');
          bodyScrollLock.disableBodyScroll(modal_content);
        };
        setTimeout(displaymodal, timing);
        var cssID = $("#cssID");
        var	contents = $('iframe').contents();
        var	body = contents.find('body');
        $("#cssID").appendTo(contents.find('head'));
    }
  );
  /* popin-offer */

  /* REVSLIDER VIDEO */
  lazyLoadScript("https://applidget.github.io/vx-assets/templates/website/grand-conference/js/revslider/extensions/revolution.extension.video.min.js","[data-overlay-mode^='video']");
  /* REVSLIDER VIDEO */

  /* Session LIST Grand Conf*/
  lazyLoadScript("https://laurent-d.github.io/gctheme/assets/js/jquery.masory.js","[data-section-type='sessions-list'] .grandconf",
    function () {
      (function () {
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
      })();

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

      var grid = $('.session-wrapper').masonry({
        itemSelector: '.scheduleday_wrapper',
        columnWidth: '.sizer',
        gutter: 20
      });

      $(".session-item").bind('classChanged', debounce(function (e) {
        $(".scheduleday_wrapper").each(function () {
          if ($(this).find('.session-item').length == $(this).find('.session-item.hide').length) {
            $(this).hide();
          } else {
            $(this).show();
          }
        });
        grid.masonry();
      }, 100));

      $('li .session_content_wrapper.expandable').on('click', function (e) {
        var targetID = $(this).attr('data-expandid');
        $('#' + targetID).toggleClass('hide');
        $(this).toggleClass('active');
        grid.masonry();
      });

      $(".filter-container .checkbox").each(function () {
        if ($(this).find('input:checked').length > 0) {
          $(this).addClass("active");
        } else {
          $(this).show();
        }
      });

      $(".accesspoint-register, .accesspoint-unregister").click(function (e) {
        e.stopPropagation();
        grid.masonry();
      });

      $(window).load(function () {
        grid.masonry();
        $('.session-container').toggleClass("ready");
      });
    });
  /* Session LIST Grand Conf*/

});
