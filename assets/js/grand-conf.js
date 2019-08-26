/*
GRAND CONFERENCE ADD-ON F(X)
*/

/* Charts-columns */
lazyLoadScript("https://cdn.jsdelivr.net/npm/in-view@0.6.1/dist/in-view.min.js", "[data-section-type='charts-column']", function () { console.log("lazyload inview charts") });

class getCounter {
    constructor(startCount, endCount, timer, html) {
      this.startCount = startCount;
      this.endCount = endCount;
      this.timer = (timer*1000)/endCount;
      this.html = html;
    }

    startCounter(inc, unit) {
      let startTm  = this.startCount,
          endTm = this.endCount;
      // if you want it to add a number just replace the -1 with +1
      let increment = startTm < endTm ? inc :-1;
      let self = this;
      this.interval = setInterval(function(){
        startTm += increment;
        self.html.innerHTML = startTm + unit ;
        if(startTm == endTm){
          clearInterval(self.interval);
        }
      }, this.timer);
    }
  }

  var chartsreveal = function () {
    const charts = document.querySelectorAll('.score');
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
        var inc = (val.length > 3) ? 10 : 1 ;
        var unit = "";
      }
      var counter = new getCounter(0, val, 1, textDisplay);
      counter.startCounter(1, unit);
    }
  }

  window.addEventListener("DOMContentLoaded", function (event) {
    inView.offset(200);
    inView('.charts-columns').once('enter', function (el) {
      chartsreveal();
    });
  });


