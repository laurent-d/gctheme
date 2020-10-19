/*
 * Copyright (c) 2019
 *
 * Methods:
 *  - handleAddSpeaker
 *  - serializeFormJSON
 *    Inspired by https://jsfiddle.net/gabrieleromanato/bynaK/
 *  - request
 *  - addSpeakersApiResponse
 *    request's CallBack
 *  - addNewOption
 *  - updateOriginalElementWithSOL
 *  - redoSOL
 *    redo the SOL initialisation with the new option
 *  - resetFormAddSpeaker
 *
 * Created       : 2019-11-20 by @opheJansen
 * Last modified : 2019-11-20 by @opheJansen
*/

function handleAddSpeaker($form) {
  var requestURL =  $form.attr("action") + ".json";
  
  request(requestURL, $form.serializeFormJSON())
}

$.fn.serializeFormJSON = function() {
  var jsonSerialize = { "guest": {} };
  var serializeArrayForm = this.serializeArray();
  $.each(serializeArrayForm, function (i, elem) {
    if ((elem.name).indexOf('guest[') != -1) {
      var elemName = elem.name;
      var elementType = elemName.substring(elemName.indexOf('[') + 1, elemName.length - 1);
      if (elementType.indexOf('guest_metadata') != -1) {
        var elemKey = elementType.substring(elementType.indexOf('metadata[') + 9, elementType.length - 1);
        if (!jsonSerialize['guest']['guest_metadata']) {
          jsonSerialize['guest']['guest_metadata'] = {};
        }
        jsonSerialize['guest']['guest_metadata'][elemKey] = elem.value || '';
      } else if (elementType.indexOf('access_privileges_attributes') != -1) {
        return true;
      } else {
        jsonSerialize['guest'][elementType] = elem.value || '';
      }
    } else if ((elem.name) == "posted_through_website_page") {
      jsonSerialize[elem.name] = elem.value || '';
    }
  });
  return jsonSerialize;
};

function request(requestURL, payload) {
  $errorsContainer = $("#guest-errors");
  $.ajax({
    type: 'POST',
    url: requestURL,
    data: payload,
    success: function(data) {
      $errorsContainer.hide();
      addSpeakersApiResponse(data)
    },
    error: function(data) {
      $errorsList = $errorsContainer.find("ul").html("");
      data.responseJSON.forEach(function(error) {
        $errorsList.append("<li>" + error + "</li>");
      });
      $errorsContainer.show();
      $('.add-speaker-container .modal-body').scrollTop(0);
    }
  });
}

function addSpeakersApiResponse(data) {
  var $originalElement = $('[data-section-type="session-form"] form.session-form select[data-type=speakers]'),
      $container = $originalElement.prev('.sol-container'),
      $options = $container.find('.sol-selection-container .sol-selection .sol-option');

  addNewOption($originalElement, data);
  updateOriginalElementWithSOL($originalElement, $options);

  redoSOL($originalElement, $container);
  resetFormAddSpeaker();
};

function addNewOption($originalElement, data) {
  var newOption = '<option value="' + data._id + '">' + data.first_name + ' ' + data.last_name + '</option>';

  $originalElement.append(newOption);
  $originalElement.find('option[value="' + data._id + '"]').prop('selected', true);
}

function updateOriginalElementWithSOL($originalElement, $options) {
  $originalElement.find('option').each(function() {
    if ($options.find('[type=checkbox][value="' + $(this).val() + '"]:checked').length > 0) {
      $(this).prop('selected', true);
    }
  });
}

function redoSOL($originalElement, $container) {
  $originalElement.data(SearchableOptionList.prototype.DATA_KEY, '');
  $container.remove();
  $originalElement.searchableOptionList();
}

function resetFormAddSpeaker() {
  var $speakerContainer = $('.add-speaker-container'),
      $speakerForm = $speakerContainer.find('form');

  $speakerForm[0].reset();
  $speakerContainer.modal('hide')
}