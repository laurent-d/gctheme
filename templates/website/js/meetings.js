/**
 * Meetings class
 *
 * Methods:
 *  - init
 *  - bindEvents
 *    - eventDays
 *    - filterDays
 *    - call addToMyCalendar from add-to-calendar.js
 *  - meetingModalToggle
 *
 * Created       : 2020-07-23 by @opheJansen
 * Last modified : 2020-09-03 by @opheJansen
 *
 */

class Meetings {
  constructor($meetingsModalButton, $meetingsModal) {
    this.meetingsModalButton = $meetingsModalButton;
    this.meetingsModal = $meetingsModal;
    this.meetingsList = this.meetingsModal.find(".meetings-list");
    this.meetingItems = this.meetingsList.find(".meeting-item");
    this.meetingRegistrationButtons = this.meetingItems.find(".btn-meeting:not('hidden')");
    this.meetingDates = this.meetingsModal.data("available-days").split(",");
    this.locale = this.meetingsModal.data("locale") || "en";
    this.dateFormat = $.datepicker.regional[this.locale].dateFormat;

    this.meetingFormBlock = this.meetingsModal.find("[data-meeting-role=form]");
    this.meetingInProgressBlock = this.meetingsModal.find("[data-meeting-role=in-progress]");
    this.meetingDoneBlock = this.meetingsModal.find("[data-meeting-role=done]");
    this.meetingValidationButton = this.meetingsModal.find(".validate");
    this.meetingValidationMsg = this.meetingsModal.find(".meeting-validation-msg");
    this.meetingBackButton = this.meetingsModal.find(".back");
    this.meetingCloseButton = this.meetingsModal.find(".meeting-modal-close");

    this.init();
    this.bindEvents();
  }

  init() {
    const self = this;

    // prevents registering to multiple meetings with the same person
    if (this.meetingsList.find(".accesspoint-unregister").length > 0) {
      this.meetingItems.find(".accesspoint-register").addClass("disabled");
      this.meetingItems.find(".accesspoint-register").closest(".meeting-item").addClass("disabled");
      this.meetingsList.find(".accesspoint-unregister").closest(".meeting-item").addClass("registered");
      this.meetingValidationMsg.text( this.meetingsList.find(".accesspoint-unregister").closest(".meeting-item").data("meeting-text") );
    }

    this.meetingItems.find(".accesspoint-register.hidden").closest(".meeting-item").addClass("full");
    this.meetingsModal.find(".available-day[data-available-day='" + this.meetingDates[0] + "']").show();

    this.meetingsModal.find(".available-day").each(function() {
      if ($(this).find(".accesspoint-register:not(.hidden), .accesspoint-unregister").length == 0) {
        $(this).find(".no-result").removeClass("hidden");
      }
    })

    function eventDays(date) {
      const dateFormatted = $.datepicker.formatDate(self.dateFormat, date);
      return [$.inArray(dateFormatted, self.meetingDates) != -1];
    }

    function filterDays() {
      const theDate = new Date(Date.parse($(this).datepicker("getDate")));
      const theDateFormatted = $.datepicker.formatDate(self.dateFormat, theDate);
      self.meetingsModal.find(".available-day").hide();
      $(".available-day[data-available-day='" + theDateFormatted + "']").show();
    }

    if (this.locale != "en") {
      $.datepicker.setDefaults($.datepicker.regional[this.locale]);
    }

    this.meetingsModal.find("#datepicker-container div").datepicker({
      dateFormat: this.dateFormat,
      defaultDate: self.meetingDates[0],
      todayHighlight: true,
      beforeShowDay: eventDays,
      onSelect: filterDays
    });
  }

  bindEvents() {
    const self = this;

    this.meetingRegistrationButtons.on("click", function() {
      const accesspointId = $(this).data("accesspoint-id");
      if ($(this).hasClass("accesspoint-register")) {
        $(this).closest(".meeting-item").addClass("registered");
        self.meetingValidationMsg.text( $(this).closest(".meeting-item").data("meeting-text") );
        self.meetingRegistrationButtons.each(function() {
          if ($(this).data("accesspoint-id") != accesspointId) {
            $(this).addClass("disabled");
            $(this).closest(".meeting-item").addClass("disabled");
          }
        });
      } else if ($(this).hasClass("accesspoint-unregister")) {
        self.meetingRegistrationButtons.removeClass("disabled");
        self.meetingRegistrationButtons.closest(".meeting-item").removeClass("disabled");
        self.meetingRegistrationButtons.closest(".meeting-item").removeClass("registered");
      }
    });

    this.meetingItems.find(".accesspoint-unregister").on("click", function(e) {
      e.preventDefault();
    });

    this.meetingsModal.on("hide.bs.modal", function () {
      setTimeout(function () {
        self.meetingModalToggle("init");
      }, 1000);
      if (self.meetingItems.find(".accesspoint-unregister").length > 0) {
        self.meetingsModalButton.find("span").text(self.meetingItems.find(".accesspoint-unregister").closest(".meeting-item").data("meeting-text"));
        self.meetingsModalButton.addClass("btn-success").removeClass("btn-primary");
      } else {
        self.meetingsModalButton.addClass("btn-primary").removeClass("btn-success");
        self.meetingsModalButton.find("span").text(self.meetingsModalButton.data("text-base"));
      }
    });

    this.meetingValidationButton.on("click", function () {
      if (self.meetingItems.find(".accesspoint-unregister").length > 0) {
        self.meetingModalToggle("inProgress");
        setTimeout(function () {
          self.meetingModalToggle("ok");
        }, 1000);
        const $meetingRegisteredItem = self.meetingItems.find(".accesspoint-unregister").closest(".meeting-item");

        addToMyCalendar(self, ".add-calendar", {
          title: $meetingRegisteredItem.data("meeting-title"),
          start: $meetingRegisteredItem.data("meeting-start-time"),
          end: $meetingRegisteredItem.data("meeting-end-time"),
          address: $meetingRegisteredItem.data("meeting-address"),
          description: $meetingRegisteredItem.data("meeting-description"),
          buttonsClass: "btn btn-default btn-sm"
        });
      } else {
        self.meetingsModal.modal("hide");
      }
    });
  }

  meetingModalToggle(newState) {
    if (newState == "inProgress") {
      this.meetingsModal.find(".modal-dialog").removeClass("modal-lg");
      this.meetingFormBlock.hide();
      this.meetingInProgressBlock.show();
    } else if (newState == "ok") {
      this.meetingInProgressBlock.hide();
      this.meetingsModal.find(".modal-dialog").removeClass("modal-lg");
      this.meetingFormBlock.hide();
      this.meetingDoneBlock.show();
    } else if (newState == "init") {
      this.meetingsModal.find(".modal-dialog").addClass("modal-lg");
      this.meetingDoneBlock.hide();
      this.meetingFormBlock.show();
    }
  }
}

$(".meeting-modal-button").each(function() {
  new Meetings($(this), $("#meetings-selection-modal"));
});
