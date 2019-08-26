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
    function checkWrap(container, carouselSelector = '.slideshow_enabled', cellSelector = '.images-list-item') {
    console.log(container);
    // if sum(carousel-cell width) > carousel width then wrap else not
    var carousel = container.querySelector(carouselSelector);
    var cells = container.querySelectorAll(cellSelector);

    if (carousel && cells) {
      var cellsTotalWidth = 0;
      cells.forEach((cell) => {
        const style = window.getComputedStyle(cell);
        cellsTotalWidth += parseFloat(style.width) +
            parseFloat(style.marginRight) +
            parseFloat(style.marginLeft);
      });
        const carouselWidth = parseFloat(window.getComputedStyle(carousel).width);
        console.log("0");
      return cellsTotalWidth > carouselWidth;
    }
    console.log("1");
    return false;
}

lazyLoadStylesheet("https://unpkg.com/flickity@2/dist/flickity.min.css", "[data-section-type='images-list']");
lazyLoadScript("https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js", "[data-section-type='images-list']", function () {
    console.log("flickity loaded");


//   const flktySelector = '.slideshow_enabled';
//   //const cellSelector = '.images-list-item';

//   const flktyOptions = {
//     // options
//     wrapAround: checkWrap(),
//     autoPlay: checkWrap(),
//     cellAlign: 'center',
//     contain: true,
//     prevNextButtons: false,
//       // Disable previous & next buttons
//     pageDots: false
//   };

  var carouselContainers = document.querySelectorAll('.slideshow_enabled');

    for ( var i=0; i < carouselContainers.length; i++ ) {
        var container = carouselContainers[i];

        var flktySelector = '.slideshow_enabled';
        //const cellSelector = '.images-list-item';

        var flktyOptions = {
          // options
          wrapAround: checkWrap(container),
          autoPlay: checkWrap(container),
          cellAlign: 'center',
          contain: true,
          prevNextButtons: false,
            // Disable previous & next buttons
          pageDots: false
        };

    var flkty = new Flickity(carouselContainers[i], flktyOptions);
    }

  //let flkty = new Flickity(flktySelector, flktyOptions);

  window.addEventListener('resize', (ev) => {
    if ('destroy' in flkty) {
      flkty.destroy();
      flktyOptions.wrapAround = checkWrap(container);
      flktyOptions.autoPlay = checkWrap(container);
      flkty = new Flickity(flktySelector, flktyOptions);
    }
  });


});


/* Source : https://codepen.io/anon/pen/OaYVZr FOR AUTOPLAY AND WRAPPARROUND */
// external js: flickity.pkgd.js

/* Slideshow */

});



