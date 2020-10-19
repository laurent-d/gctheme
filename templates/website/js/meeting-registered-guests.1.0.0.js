/**
 * MeetingRegisteredGuests class
 *
 * Methods:
 *  - initModal
 *    Remove all line that are not the initial one + change modal title
 *  - request
 *    Request AJAX to get the informations of the guests registered on a specific meeting
 *  - completeGuestsTable
 *
 * Created       : 2020-07-27 by @opheJansen
 * Last modified : 2020-10-02 by @opheJansen
 *
 */
class MeetingRegisteredGuests {
  constructor($link) {
    this.section = $link.closest("[data-section-type]");
    this.meeting = $link.closest(".guest-meeting");

    this.messagingPagePath = this.section.data("messaging-page-path");

    this.guestId = $(document).find("[name=guest_id]").attr("content");

    this.meetingName = this.meeting.data("meeting-name");
    this.requestUrl = this.meeting.data("registered-guest-url");

    this.modal = this.section.find(".modal#registeredGuestsModal");
    this.initLine = this.modal.find(".init");

    this.initModal();
    this.request();
  }

  initModal() {
    this.modal.find('.modal-title').text(this.meetingName);
    this.modal.find("tbody tr:not('.init')").remove();
    if (this.messagingPagePath.length == 0) {
      this.modal.find('.modal-body .table thead td:last').remove();
      this.initLine.find('.message').remove();
    }
  }

  request() {
    const self = this;

    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: self.requestUrl,
      complete: function(data) {
        self.completeGuestsTable(data.responseJSON);
      }
    });
  }

  completeGuestsTable(guests) {
    const self = this;

    guests.forEach(function(guest) {
      const $newLine = self.initLine.clone();

      $newLine.removeClass("init");
      $newLine.find('.identity span').text(guest.identity);
      $newLine.find('.identity img').attr("src", guest.avatar_thumb);
      $newLine.find('.company').text(guest.company_name);
      $newLine.find('.message a').attr("href", "/" + self.messagingPagePath + "?receiver_id=" + guest._id);
      if (guest._id == self.guestId) {
        $newLine.find('.message a').addClass("disabled");
      }
      self.initLine.after($newLine);
    });
  }

}

$(document).on('click', ".display-registered-guests", function() {
  new MeetingRegisteredGuests($(this));
});
