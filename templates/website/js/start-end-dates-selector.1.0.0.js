/**
  * Copyright (c) 2019
  *
  * Start and End Dates Selector
  *
  * Description:
  *  This class computes the values of 5 form fields into a start datetime field and an end datetime field (likely hidden)
  *  in 'YYYY-MM-DDThh:mm:ss.000Z' format. The 5 fields are the following:
  *    - start date (likely with datepicker)
  *    - start hour
  *    - start minute
  *    - duration hour
  *    - duration minute
  *  In order to instanciate class, form fields must be placed inside a container with "start-end-dates-selector" class.
  *  Each field's HTML tag must have a specific data attribute as shown in the class constructor.
  *
  * Methods:
  *  - bindDatetimeSelectors: bind change events to date, time and duration fields
  *  - computeLocalStartDate: returns stringified start date : YYYY-MM-DDThh:mm:ss.000Z
  *  - computeLocalEndDate: returns stringified end date from start date and duration : YYYY-MM-DDThh:mm:ss.000Z
  *  - padNumber: adds leading 0 before number : 9 -> 09
  *
  * Created at     : 2019-07-15 by @WilfriedDeluche
  * Last modified  : 2019-07-15 by @WilfriedDeluche
  */

class StartEndDatesSelector {
  constructor($container) {
    this.localStartDatetime = $container.find("[data-dates-selector=local-start-datetime]");
    this.localEndDatetime = $container.find("[data-dates-selector=local-end-datetime]");
    this.startDate = $container.find("[data-dates-selector=start-date]");
    this.startHour = $container.find("[data-dates-selector=start-hour]");
    this.startMinute = $container.find("[data-dates-selector=start-minute]");
    this.durationHour = $container.find("[data-dates-selector=duration-hour]");
    this.durationMinute = $container.find("[data-dates-selector=duration-minute]");
    this.bindDatetimeSelectors();
  }

  bindDatetimeSelectors() {
    const datetimeSelector = [this.startDate.selector, this.startHour.selector, this.startMinute.selector].join(", ");
    const durationSelector = [this.durationHour, this.durationMinute];
    const self = this;

    $(document).on("change", datetimeSelector, function() {
      self.computeLocalStartDate();
      self.computeLocalEndDate();
    });

    $(document).on("change", durationSelector, function() {
      self.computeLocalEndDate();
    });
  }

  computeLocalStartDate() {
    const localStartDatetime =  this.startDate.val() + "T" + this.padNumber(this.startHour.val(), 2) + ":" + this.padNumber(this.startMinute.val(), 2) + ":00.000Z";
    this.localStartDatetime.val(localStartDatetime);

    return localStartDatetime;
  }

  computeLocalEndDate() {
    const localStartDatetime = new Date(this.localStartDatetime.val());
    const duration = Number(this.durationHour.val()) * 60 + Number(this.durationMinute.val());
    const localEndDatetime = new Date(localStartDatetime.setMinutes(localStartDatetime.getMinutes() + duration)).toJSON();
    this.localEndDatetime.val(localEndDatetime);

    return localEndDatetime;
  }

  padNumber(num, size) {
    var s = String(num);
    while (s.length < size) s = "0" + s;
    return s;
  }
}

$('.start-end-dates-selector').each(function(i, container) {
  new StartEndDatesSelector($(container));
});
