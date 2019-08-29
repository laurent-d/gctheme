/*
GRAND CONFERENCE ADD-ON F(X)
*/

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
    console.log(NUMBER_TYPE);
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
        } else {
            var inc = (val.length > 3) ? 10 : 1;
            var unit = "";
        }
        var counter = new getCounter(0, val, 1, textDisplay);
        counter.startCounter(1, unit);
    }
}



lazyLoadScript("https://cdn.jsdelivr.net/npm/in-view@0.6.1/dist/in-view.min.js", "[data-section-type='charts-column']", function () {
console.log("in-view loaded for charts colulmns");
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
    //const cellSelector = '.images-list-item';
    var needWrap = checkWrap(container);
    var flktyOptions = {
      // options
      imagesLoaded: true,
      wrapAround: needWrap,
      autoPlay: needWrap,
      cellAlign: "center",
      contain: true,
      prevNextButtons: false,
      pageDots: false
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

/* Synoptique */
lazyLoadScript("https://asvd.github.io/syncscroll/syncscroll.js", "[data-section-type='sessions-list-synoptique']", function() {console.log("lazyload session synoptique")});
/* Synoptique */

/* FAQ */
lazyLoadScript("https://laurent-d.github.io/gctheme/assets/js/accordion.min.js", "[data-section-type='faq']", function() {console.log("lazyload faq")});
/* FAQ */

/* Countdown // Image overlay */
lazyLoadScript("https://laurent-d.github.io/gctheme/assets/js/jquery.countdown.js", ".countdown", function () {
  console.log("lazyload countdown")
});
/* Countdown // Image overlay */

/* MAP */
lazyLoadScript("https://laurent-d.github.io/gctheme/assets/js/jquery.simplegmaps.min.js", "[data-section-type='map']", function () {
  console.log("lazyload map");
  function extendMap() {
    if ( jQuery(".map_shortcode_wrapper").height() > jQuery(".map_shortcode_wrapper").siblings('.standard_wrapper').height()  ) {
  } else {
    var extended = jQuery(".map_shortcode_wrapper").siblings('.standard_wrapper').height() + 60;
    //console.log (extended)
    jQuery(".map_shortcode_wrapper").height(extended);
  };
  }


jQuery( window ).resize(function() {
extendMap();
});


jQuery(document).ready(function () {

  extendMap();

  jQuery(".map_shortcode_wrapper").simplegmaps({
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
  lazyLoadScript("https://laurent-d.github.io/gctheme/assets/js/jquery.countdown.js", ".countdown", function () {
    console.log("lazyload map");

  var dataDate = $('.countdown').attr('data-date');
  $('.countdown').countdown(dataDate, function(event) {
    var weeks = event.offset.weeks;
    var days = event.offset.totalDays;
    if (event.offset.weeks > 0) {
      var clock = $(this).html(event.strftime(''
        + '<div class="clock_bg"><div class="clock_counter">%w</div><div class="clock_label">' + time_weeks + '</div></div>'
        + '<div class="clock_bg"><div class="clock_counter">%d</div><div class="clock_label">' + time_days + '</div></div>'
        + '<div class="clock_bg"><div class="clock_counter">%H</div><div class="clock_label">' + time_hours + '</div></div>'
        + '<div class="clock_bg"><div class="clock_counter">%M</div><div class="clock_label">' + time_minutes + '</div></div>'
        + '<div class="clock_bg"><div class="clock_counter">%S</div><div class="clock_label">' + time_seconds + '</div></div>')
      );
    } else if (event.offset.totalDays > 0) {
      var clock = $(this).html(event.strftime(''
      + '<div class="clock_bg"><div class="clock_counter">%d</div><div class="clock_label">' + time_days + '</div></div>'
      + '<div class="clock_bg"><div class="clock_counter">%H</div><div class="clock_label">' + time_hours + '</div></div>'
      + '<div class="clock_bg"><div class="clock_counter">%M</div><div class="clock_label">' + time_minutes + '</div></div>'
      + '<div class="clock_bg"><div class="clock_counter">%S</div><div class="clock_label">' + time_seconds + '</div></div>')
      );
    } else {
      var clock = $(this).html(event.strftime(''
      + '<div class="clock_bg"><div class="clock_counter">%H</div><div class="clock_label">' + time_hours + '</div></div>'
      + '<div class="clock_bg"><div class="clock_counter">%M</div><div class="clock_label">' + time_minutes + '</div></div>'
      + '<div class="clock_bg"><div class="clock_counter">%S</div><div class="clock_label">' + time_seconds + '</div></div>')
      );
    }
  });
});

/* COUNTDOWN */

});

