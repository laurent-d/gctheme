/**
 * badgePrinting class
 *
 * Methods:
 *  - bindEvent
 *  - request
 *    Request AJAX to get badge url from order_uid
 *  - modalTextsForError
 *    Get modal texts by errors types
 *  - changeModalStatus
 *    Change modal texts when an error happened
 *  - modalTexts
 *    Get modal texts for printing and success
 *  - printBadgePdf
 *  - printingIframe
 *    Find Iframe or create Iframe if it doesn't exist
 *  - redirection
 *
 * Created       : 2020-02-13 by @opheJansen
 * Last modified : 2020-02-24 by @opheJansen
 *
 * Doc: https://3.basecamp.com/3178566/buckets/4756018/google_documents/2406028343
 */

const RETRY_INTERVAL = 3000;
const INTER_MODAL_INTERVAL = 2000;
const REQUEST_TIMEOUT = 30000;

class badgePrinting {
  constructor(badgePrintingBloc) {
    this.badgePrintingBloc = badgePrintingBloc;
    this.input = this.badgePrintingBloc.find('[name="order_uid"]');
    this.form = this.input.closest('form');
    this.requestUrl = this.form.attr('action') + ".json";

    this.totalRequestWaitingTime = 0;
    this.printInProgress = false;

    this.modal = $('.onsite-badge-printing-container');
    this.modalTitle = this.modal.find('.modal-title');
    this.modalText = this.modal.find('.modal-body .modal-text');
    this.modalLoader = this.modal.find('.modal-body .modal-loader');
    this.modalButton = this.modal.find('.modal-footer .btn');
    this.modalMessages = this.modal.find('.modal-messages');

    this.autoPrinting = this.badgePrintingBloc.find(".auto-printing").length > 0;
    this.redirectLink = this.modalButton.data("link");

    this.input.focus();
    this.bindEvent();

    if (this.autoPrinting) {
      this.form.submit();
    }
  }

  bindEvent() {
    const self = this;

    this.form.on('submit', function (e) {
      e.preventDefault();
      self.request();
    });

    this.modalButton.on('click', function () {
      self.redirection();
    });

    this.modal.on('hide.bs.modal', function (e) {
      e.preventDefault();
    });
  }

  request() {
    const self = this;

    self.changeModalStatus("loading");
    self.modal.modal({ show: true });

    $.ajax({
      type: 'GET',
      url: this.requestUrl,
      data: {
        "order_uid": self.input.val().trim()
      },
      success: function (data) {
        if (data.badge_url) {
          self.printBadgePdf(data.badge_url);
        } else {
          if (self.totalRequestWaitingTime < REQUEST_TIMEOUT) {
            setTimeout(function () {
              self.totalRequestWaitingTime = self.totalRequestWaitingTime + RETRY_INTERVAL;
              self.request();
            }, RETRY_INTERVAL);
          } else {
            self.changeModalStatus("errors", "timeout");
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        self.changeModalStatus("errors", errorThrown);
      }
    });
  }

  modalTextsForError(errorType) {
    let texts;
    switch (errorType) {
      case 'Not Found':
        texts = this.modalTexts('errors', 'not-found');
        break;
      case 'timeout':
        texts = this.modalTexts('errors', 'timeout');
        break;
      default:
        texts = this.modalTexts('errors', 'error');
        texts.text += "<p>"+ errorType +"</p>";
        break;
    }

    return texts;
  }

  changeModalStatus(status, errorType = null) {
    const self = this;
    const texts = status == "errors" ? this.modalTextsForError(errorType) : this.modalTexts(status);

    this.modalTitle.text(texts.title);
    this.modalText.html(texts.text);
    this.modalButton.text(texts.button);

    switch (status) {
      case "loading":
      case "printing":
        this.modalLoader.find('i').attr("class", "fa fa-circle-o-notch fa-pulse fa-3x");
        break;
      case "errors":
        this.modalLoader.find('i').attr("class", "fa fa-exclamation-circle fa-5x text-danger");
        break;
      case "success":
        this.modalLoader.find('i').attr("class", "fa fa-check fa-5x text-success");
        setTimeout(function () {
          self.redirection();
        }, INTER_MODAL_INTERVAL);
        break;
    }
  }

  modalTexts(status, errorType = null) {
    let textAttr = "data-text";
    if (errorType) {
      textAttr += "-" + errorType;
    }

    return {
      title: this.modalMessages.find("." + status).attr('data-title'),
      text: this.modalMessages.find("." + status).attr(textAttr),
      button: this.modalMessages.find("." + status).attr('data-button')
    }
  }

  printBadgePdf(badgeUrl) {
    const self = this;
    const $iframe = self.printingIframe(badgeUrl);

    if (!self.printInProgress) {
      self.printInProgress = true;
      self.changeModalStatus("printing");
      $iframe.onload = function () {
        $iframe.focus();
        $iframe.contentWindow.print();
        setTimeout(function () {
          self.changeModalStatus("success");
          self.printInProgress = false;
        }, INTER_MODAL_INTERVAL);
      };
    }
  }

  printingIframe(badgeUrl) {
    let $iframe;

    if (this.badgePrintingBloc.find('#badgePrintingIframe').length > 0) {
      $iframe = this.badgePrintingBloc.find('#badgePrintingIframe')
    } else {
      $iframe = document.createElement('iframe');
      $iframe.id = 'badgePrintingIframe';
      this.badgePrintingBloc.append($iframe);
      $iframe.style.display = 'none';
    }
    $iframe.src = badgeUrl;

    return $iframe;
  }

  redirection() {
    if (this.autoPrinting) {
      window.location.href = this.redirectLink;
    } else {
      window.location.reload();
    }
  }
}
