/*! add-to-calendar-buttons
 *  Copyright: (c) 2015 carlsednaoui - https://github.com/carlsednaoui/add-to-calendar-buttons
 */

;(function(e) {
  var t = 60 * 1e3;
  var dateToString = function(e) {
    return e.toISOString().replace(/-|:|\.\d+/g, "")
  };
  var getEndDate = function(e) {
    return e.end ? dateToString(e.end) : n(new Date(e.start.getTime() + e.duration * t))
  };
  var allCalendars = {
    google: function(e) {
      var startDate = dateToString(e.start);
      var endDate = getEndDate(e);
      var encodage = encodeURI(["https://www.google.com/calendar/render", "?action=TEMPLATE", "&text=" + (e.title || ""), "&dates=" + (startDate || ""), "/" + (endDate || ""), "&details=" + (e.description || ""), "&location=" + (e.address || ""), "&sprop=&sprop=name:"].join(""));
      return '<a class="icon-google" target="_blank" href="' + encodage + '">Google Calendar</a>'
    },
    yahoo: function(e) {
      var r = e.end ? (e.end.getTime() - e.start.getTime()) / t : e.duration;
      var i = r < 600 ? "0" + Math.floor(r / 60) : Math.floor(r / 60) + "";
      var s = r % 60 < 10 ? "0" + r % 60 : r % 60 + "";
      var duration = i + s;
      var startDate = dateToString(new Date(e.start - e.start.getTimezoneOffset() * t)) || "";
      var encodage = encodeURI(["http://calendar.yahoo.com/?v=60&view=d&type=20", "&title=" + (e.title || ""), "&st=" + startDate, "&dur=" + (duration || ""), "&desc=" + (e.description || ""), "&in_loc=" + (e.address || "")].join(""));
      return '<a class="icon-yahoo" target="_blank" href="' + encodage + '">Yahoo! Calendar</a>'
    },
    ics: function(e, class_name, label) {
      var startDate = dateToString(e.start);
      var endDate = getEndDate(e);
      var encodage = encodeURI("data:text/calendar;charset=utf8," + ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", "URL:" + document.URL, "DTSTART:" + (startDate || ""), "DTEND:" + (endDate || ""), "SUMMARY:" + (e.title || ""), "DESCRIPTION:" + (e.description || ""), "LOCATION:" + (e.address || ""), "END:VEVENT", "END:VCALENDAR"].join("\n"));
      return '<a class="' + class_name + '" target="_blank" href="' + encodage + '">' + label + " Calendar</a>"
    },
    ical: function(e) {
      return this.ics(e, "icon-ical", "iCal")
    },
    outlook: function(e) {
      return this.ics(e, "icon-outlook", "Outlook")
    }
  };
  var calendars = function(e) {
    return {
      google: allCalendars.google(e),
      yahoo: allCalendars.yahoo(e),
      ical: allCalendars.ical(e),
      outlook: allCalendars.outlook(e)
    }
  };
  var haveData = function(e) {
    return e.data !== undefined && e.data.start !== undefined && (e.data.end !== undefined || e.data.duration !== undefined)
  };
  var render = function(calendars, class_name, label, id, icone) {
    var btn_calendar = document.createElement("div");
    var modalHeader = document.createElement("div");
    var opt = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title text-center" id="myModalLabel">'+ icone +'&nbsp;'+ label +'</h4>';
    jQuery(".modal-content").prepend(modalHeader);
    btn_calendar.innerHTML = '<label for="checkbox-for-' + id + '" class="add-to-calendar-checkbox">'+ icone +'&nbsp;'+ label +'</label>';
    btn_calendar.innerHTML += '<input name="add-to-calendar-checkbox" class="add-to-calendar-checkbox" id="checkbox-for-' + id + '" type="checkbox">';
    Object.keys(calendars).forEach(function(class_name) {
      opt.innerHTML += calendars[class_name]
    });
    opt.className = "add-to-calendar";
    if (class_name !== undefined) {
      opt.className += " " + class_name
    }
    opt.id = id;
    jQuery('.btn-calendar').append(btn_calendar)
    return opt
  };
  var getClass = function(e) {
    if (e.options && e.options.class) {
      return e.options.class
    }
  };
  var getLabel = function(e) {
    if (e.options && e.options.label) {
      return e.options.label
    }
  };
  var getIcone = function(e) {
    if (e.options && e.options.icone == "true") {
      return '<span aria-hidden="false"><i class="fa fa-calendar-o"></i></span>'
    } else {
      return ""
    }
  };
  var getId = function(e) {
    return e.options && e.options.id ? e.options.id : Math.floor(Math.random() * 1e6)
  };
  e.createCalendar = function(e) {
    if (!haveData(e)) {
      console.log("Event details missing.");
      return
    }
    return render(calendars(e.data), getClass(e), getLabel(e), getId(e), getIcone(e))
  }
})(this);
