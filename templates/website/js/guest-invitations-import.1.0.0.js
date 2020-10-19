/**
  * Copyright (c) 2020
  *
  * GuestInvitationsImport Class
  *
  * Functions:
  *  - bindEvents
  *  - createImport : launch import and check status asynchronously
  *  - invitationsImportModalToggle : display right version of invitations import modal according to state
  *  - checkInvitationsImportStatus : check if import has finished successfully or not and display right information
  *  - afterImportSuccess : display number of created guest invitations and potential validations errors
  *
  * Created        : 2020-05-14 by @WilfriedDeluche
  * Last modified  : 2020-05-14 by @WilfriedDeluche
  */

 class GuestInvitationsImport {
  constructor($container) {
    this.container = $container;
    this.importFormBlock = this.container.find("[data-import-role=form]");
    this.importInProgressBlock = this.container.find("[data-import-role=in-progress]");
    this.importErrorsBlock = this.container.find("[data-import-role=errors]");
    this.importDoneBlock = this.container.find("[data-import-role=done]");
    this.interval = null;
    this.bindEvents();
  }

  bindEvents() {
    const self = this;

    // launch import
    this.importFormBlock.on("submit", "form", function(e) {
      e.preventDefault();
      self.createImport(this);
    });

    // open files selector popup when clicking button
    this.importFormBlock.on("click", ".import-file-button", function() {
      self.importFormBlock.find(".import-file-input").click();
    });

    // display selected file name
    this.importFormBlock.on("change", ".import-file-input", function(e) {
      self.importFormBlock.find(".import-file-button span").text(e.target.files[0].name);
    })

    // reinit import modal
    this.container.on("click", ".import-modal-init", function() {
      self.invitationsImportModalToggle("init");
    })

    // reload page after successful import
    this.importDoneBlock.on("click", ".import-modal-close", function() {
      document.location.reload(true);
    })
  }

  createImport(form) {
    const requestUrl = $(form).attr('data-show-url');
    const self = this;

    $.ajax({
      type: "POST",
      url: $(form).attr('action'),
      data: new FormData(form),
      processData: false,
      contentType: false
    }).fail(function(data) {
      self.invitationsImportModalToggle("error");
      self.importErrorsBlock.find(".custom-error-message").text(data.responseJSON.join(". "));
    }).success(function(data) {
      self.invitationsImportModalToggle("inProgress");
      self.interval = setInterval(function() {
        self.checkInvitationsImportStatus(requestUrl.replace("IMPORT_ID", data._id));
      }, 5000);
    });
  }

  invitationsImportModalToggle(newState) {
    if (newState == "inProgress") {
      this.importFormBlock.hide();
      this.importInProgressBlock.show();
    } else if (newState == "error") {
      this.importFormBlock.hide();
      this.importInProgressBlock.hide();
      this.importErrorsBlock.show();
    } else if (newState == "ok") {
      this.importInProgressBlock.hide()
      this.importDoneBlock.show();
    } else if (newState == "init") {
      this.importErrorsBlock.hide();
      this.importDoneBlock.hide();
      this.importFormBlock.find(".import-file-input").val(""); // reset input file
      const $filenamePlaceholder = this.importFormBlock.find(".import-file-button span");
      $filenamePlaceholder.text($filenamePlaceholder.data("default-text")); // reset filename placeholder
      this.importFormBlock.show();
      this.importErrorsBlock.find(".custom-error-message").text("");
      this.importDoneBlock.find(".validation-errors-table").collapse('hide').find("tbody").html("");
      this.importDoneBlock.find(".validation-errors-count").hide();
    }
  }

  checkInvitationsImportStatus(requestUrl) {
    const self = this;

    $.getJSON(requestUrl).fail(function() {
      self.invitationsImportModalToggle("error");
      clearInterval(self.interval);
    }).success(function(data) {
      if (data.parse_status == 6 || data.parse_status == 10) {
        clearInterval(self.interval);
        if (data.parse_status == 6) { // success
          self.afterImportSuccess(data);
        } else { // finished with errors
          self.invitationsImportModalToggle("error");
          self.importErrorsBlock.find(".custom-error-message").text(data.parse_error);
        }
      }
    });
  }

  afterImportSuccess(data) {
    this.invitationsImportModalToggle("ok");
    const $creationCountBlock = this.importDoneBlock.find(".created-guest-invitations-count");
    $creationCountBlock.html($creationCountBlock.html().replace("#COUNT#", data.created_guest_invitations_count));

    const $alreadyInvitedCountBlock = this.importDoneBlock.find(".already-invited-guest-invitations-count");
    if ($alreadyInvitedCountBlock.length >= 1) {
      $alreadyInvitedCountBlock.html($alreadyInvitedCountBlock.html().replace("#COUNT#", data.already_invited_guest_invitations_count));
    }

    // build validation errors table
    if (data.import_validation_errors.length) {
      const $validationErrorsCountBlock = this.importDoneBlock.find(".validation-errors-count");
      $validationErrorsCountBlock.html($validationErrorsCountBlock.html().replace("#COUNT#", data.import_validation_errors.length)).show();
      const $validationErrorsTableBody = this.importDoneBlock.find("tbody");
      data.import_validation_errors.forEach(function(error) {
        $validationErrorsTableBody.append("<tr><td>" + error.line_number + "</td><td>" + error.validation_errors.join(". ")  + "</td></tr>");
      })
    }
  }
}

$(".guest-invitations-import").each(function() {
  new GuestInvitationsImport($(this));
});
