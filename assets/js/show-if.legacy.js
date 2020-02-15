/**
  * Babelified with BabelJs.io
  * Copyright (c) 2020
  *
  * Description:
  *  - ShowIf
  *
  * Functions:
  *  - analyzeDataShowIf : build array of array of objects from show-if data attribute value
  *  - bindEvents : bind on change event for conditioning fields
  *  - evalDisplay : evaluate element display status
  *  - isDisplayable : evaluate set of AND conditions
  *  - isDisplayConditionValid : evaluate a single condition
  *  - isDisplayConditionValidMulti : evaluate a single condition when target can have multiple values
  *  - extractConditionElements : extract search field, value and operation from string
  *  - getTarget : returns target field name and whether it is a multiple value field or not
  *  - handleShowHide : show or hide element according to shouldBeVisible property
  *  - requiredFieldsFromBloc : add required attribute if necessary
  *  - resetFieldsFromBloc : empty element and trigger on change event
  *
  * Created        : 2020-01-31 by @opheJansen
  * Last modified  : 2020-02-06 by @WilfriedDeluche
  */

 var ShowIf = function () {

  function ShowIf(elem) {
    if (elem === void 0) {
      elem = null;
    }

    this.elem = elem;
    this.shouldBeVisible = false;
    this.initialized = false;
    var person;
    var linkedGuestIndex;

    if (this.elem.closest("[id*=linked-person]").length > 0) {
      linkedGuestIndex = this.elem.closest("[id*=linked-person]").attr('id').split('linked-person-')[1];
      person = "linked-person-" + linkedGuestIndex;
    }

    this.person = person || "main-person";
    this.linkedGuestIndex = linkedGuestIndex || null;
    this.displayConditions = this.analyzeDataShowIf();
    this.bindEvents();
    this.evalDisplay();
    this.initialized = true;
  }

  var _proto = ShowIf.prototype;

  _proto.analyzeDataShowIf = function analyzeDataShowIf() {
    var orConditions = this.elem.attr('data-show-if').split("EM_OR_OP");
    return orConditions.map(function (orCondition) {
      var andConditions = orCondition.split("EM_AND_OP");
      return andConditions.map(function (andCondition) {
        var searchElts = this.extractConditionElements(andCondition),
            // array containing search elts as follows : [ field, value, operation ]
        targetElts = this.getTarget(searchElts[0]); // array containing target elts as follow : [ targetName, targetMultiple ]

        return {
          field: searchElts[0],
          value: searchElts[1],
          operation: searchElts[2],
          target: targetElts[0],
          multiple: targetElts[1]
        };
      }, this);
    }, this);
  };

  _proto.evalDisplay = function evalDisplay() {
    this.shouldBeVisible = this.displayConditions.some(function (orCondition) {
      return this.isDisplayable(orCondition);
    }, this);
    this.handleShowHide();
  };

  _proto.bindEvents = function bindEvents() {
    var self = this;
    var searchFieldsNames = [];
    this.displayConditions.flat().forEach(function (condition) {
      if (condition.target === undefined) return; // no need to bind onchange event if already bound

      if (searchFieldsNames.indexOf(condition.field) !== -1) return;
      searchFieldsNames.push(condition.field); // toggle $element on searchField change

      $(document).on('change', condition.target, function () {
        if ($(this).attr('type') == "radio") {
          if ($(this).is(':checked')) {
            self.evalDisplay();
          } else {
            self.elem.hide();
          }
        } else {
          self.evalDisplay();
        }
      });
    });
  };

  _proto.isDisplayable = function isDisplayable(andArray) {
    return andArray.every(function (condition) {
      var searchValue = condition.value,
          operation = condition.operation,
          target = condition.target;
      if (target === undefined) return false; // toggle $element on page load

      if ($(target).attr('type') == "radio") {
        if (operation == "endsWith" && $(target).filter(':checked').length > 0 || operation != "endsWith") {
          return this.isDisplayConditionValid($(target).filter(':checked'), searchValue, operation);
        } else {
          return false;
        }
      } else if ($(target + ":checkbox").length > 0) {
        return this.isDisplayConditionValid($(target + ":checkbox"), searchValue, operation, condition.multiple);
      } else {
        return this.isDisplayConditionValid($(target), searchValue, operation);
      }
    }, this);
  };

  _proto.isDisplayConditionValid = function isDisplayConditionValid($target, searchValue, operation, multiple) {
    if (multiple === void 0) {
      multiple = false;
    }

    if (multiple) return this.isDisplayConditionValidMulti($target, searchValue, operation);
    var targetIsCheckboxOrRadio = $target.attr("type") == "checkbox" || $target.attr("type") == "radio";

    if (operation == "equal") {
      if ($target.val() == searchValue && $target.val() != undefined) {
        return !(targetIsCheckboxOrRadio && !$target.is(":checked"));
      }
    } else if (operation == "diff") {
      if ($target.val() == searchValue && $target.val() != undefined) {
        return targetIsCheckboxOrRadio && !$target.is(":checked");
      } else {
        return true;
      }
    } else if (operation == "startsWith") {
      // if startsWith searchValue
      if ($target.val() != undefined && $target.val().substring(0, searchValue.length).indexOf(searchValue) != -1) {
        return !(targetIsCheckboxOrRadio && !$target.is(":checked"));
      } else {
        return false;
      }
    } else if (operation == "endsWith") {
      // if endsWith searchValue
      if ($target.val() != undefined && $target.val().substring($target.val().length - searchValue.length, $target.val().length).indexOf(searchValue) != -1) {
        return !(targetIsCheckboxOrRadio && !$target.is(":checked"));
      } else {
        return false;
      }
    }
  };

  _proto.isDisplayConditionValidMulti = function isDisplayConditionValidMulti($targets, searchValue, operation) {
    switch (operation) {
      case "equal":
        return $targets.filter('[value="' + searchValue + '"]:checked').length > 0;

      case "diff":
        return $targets.filter('[value="' + searchValue + '"]:checked').length == 0;

      case "startsWith":
        return $targets.filter('[value^="' + searchValue + '"]:checked').length > 0;

      case "endsWith":
        return $targets.filter('[value$="' + searchValue + '"]:checked').length > 0;
    }
  };

  _proto.extractConditionElements = function extractConditionElements(query) {
    if (query.indexOf("!=") != -1) {
      var searchField = query.split("!=")[0];
      var searchValue = query.split("!=")[1];
      var searchOperation = "diff";
    } else if (query.indexOf("==") != -1) {
      var searchField = query.split("==")[0];
      var searchValue = query.split("==")[1];
      var searchOperation = "equal";
    } else if (query.indexOf("^=") != -1) {
      var searchField = query.split("^=")[0];
      var searchValue = query.split("^=")[1];
      var searchOperation = "startsWith";
    } else if (query.indexOf("$=") != -1) {
      var searchField = query.split("$=")[0];
      var searchValue = query.split("$=")[1];
      var searchOperation = "endsWith";
    }

    return [searchField, searchValue, searchOperation];
  };

  _proto.getTarget = function getTarget(searchField) {
    var target = "",
        isMultiple = false; // check whether bloc is in linked person or not

    if (this.person == "main-person") {
      if ($('[name=guest\\[guest_metadata\\[' + searchField + '\\]\\]]').length > 0 || $('[data-name=guest\\[guest_metadata\\[' + searchField + '\\]\\]]').length > 0) {
        if ($('[name=guest\\[guest_metadata\\[' + searchField + '\\]\\]]').length > 0) {
          target = '[name=guest\\[guest_metadata\\[' + searchField + '\\]\\]]';
        } else if ($('[data-name=guest\\[guest_metadata\\[' + searchField + '\\]\\]]').length > 0) {
          // for MultiSelect
          target = '[data-name=guest\\[guest_metadata\\[' + searchField + '\\]\\]]';
        }
      } else {
        target = '[name=guest\\[' + searchField + '\\]]';
      }
    } else {
      if ($('[name*=\\[' + this.linkedGuestIndex + '\\]\\[guest_metadata\\[' + searchField + '\\]\\]]').length > 0 || $('[data-name*=\\[' + this.linkedGuestIndex + '\\]\\[guest_metadata\\[' + searchField + '\\]\\]]').length > 0) {
        if ($('[name*=\\[' + this.linkedGuestIndex + '\\]\\[guest_metadata\\[' + searchField + '\\]\\]]').length > 0) {
          target = '[name*=\\[' + this.linkedGuestIndex + '\\]\\[guest_metadata\\[' + searchField + '\\]\\]]';
        } else if ($('[data-name*=\\[' + this.linkedGuestIndex + '\\]\\[guest_metadata\\[' + searchField + '\\]\\]]').length > 0) {
          target = '[data-name*=\\[' + this.linkedGuestIndex + '\\]\\[guest_metadata\\[' + searchField + '\\]\\]]';
        }
      } else {
        target = '[name*=\\[' + this.linkedGuestIndex + '\\]\\[' + searchField + '\\]]';
      }
    } // Multiselect show-if


    if ($(target).attr('multiple') == "multiple") {
      // Edition
      if ($(target).attr('data-value') && !$(target).attr('data-name')) {
        return []; // Because SOL library isn't loaded yet
      } else {
        if (this.person == "main-person") {
          target = '[name=guest\\[guest_metadata\\[' + searchField + '\\]\\]\\[\\]]';
        } else {
          target = '[name*=\\[' + this.linkedGuestIndex + '\\]\\[guest_metadata\\[' + searchField + '\\]\\]\\[\\]]';
        }
      }

      isMultiple = true;
    }

    if ($(target).closest('.sol-option').length > 0 && !isMultiple) {
      isMultiple = true;
    }

    return [target, isMultiple];
  };

  _proto.handleShowHide = function handleShowHide() {
    if (this.shouldBeVisible) {
      this.elem.show();
      this.requiredFieldsFromBloc();
    } else {
      this.elem.hide();
      this.resetFieldsFromBloc();
    }
  };

  _proto.requiredFieldsFromBloc = function requiredFieldsFromBloc() {
    this.elem.find('[data-required]:visible').closest('[data-show-if]').find('.control-label').attr('required', 'required');
    this.elem.find('[data-required=true]:visible').attr('required', 'required');
  };

  _proto.resetFieldsFromBloc = function resetFieldsFromBloc() {
    if (this.elem.is("optgroup") && this.elem.find('option:selected').length > 0) {
      this.elem.closest('select').val('');
    }

    if (this.elem.find('.products-table').length > 0) {
      var val = this.elem.find('select option:first').val();
      this.elem.find('select').val(val);
    } else {
      this.elem.find('select').val("");
    }

    this.elem.find('input, textarea').not('[type=checkbox],[type=radio],[name*=access_privileges_attributes], [type=submit]').val("");
    this.elem.find('[data-required]').closest('[data-show-if]').find('.control-label').removeAttr('required');
    this.elem.find('[data-required=true]').removeAttr('required');
    this.elem.find('[id*=linked-person-] .add-linked-guest').attr('data-people-current', 1); // No change needs to be triggered when initializing conditional display

    if (this.initialized) {
      this.elem.find('[type=checkbox]:checked,[type=radio]:checked').prop('checked', false).change();
      this.elem.find('select').change();
      this.elem.find('[id*=linked-person-] .remove-linked-guest').click();

      if (this.elem.is("optgroup") && this.elem.find('option:selected').length > 0) {
        this.elem.closest('select').change();
      }
    } else {
      this.elem.find('[type=checkbox]:checked,[type=radio]:checked').prop('checked', false);
    }
  };

  return ShowIf;
}();
