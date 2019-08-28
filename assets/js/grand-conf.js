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
    console.log("lazyload map")
  });
/* MAP */

});



