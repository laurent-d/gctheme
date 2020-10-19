/**
  * Copyright (c) 2020
  *
  * Description:
  *  - Accommodation
  *
  * Functions:
  *  - bindEvents
  *  - initDatePickers
  *  - datesRangeValid : check if selected checkin and checkout dates are relevant
  *  - emptyAllHotelSelection : empty hotel dropdown and hide illustration and description blocks
  *  - selectRoomType : Append types of rooms into select field
  *  - getAvailableRooms : Get available checkin points from selection
  *  - appendAvailableHotels : Build all options for Hotel dropdown
  *  - buildHotelOption : Build single option for Hotel dropdown
  *  - checkAccesspointsFromHotelSelection: Checks checkin points according to selected hotel
  *  - displayIllustration
  *  - displayDescription
  *  - initRoomsList
  *  - getSelectedHotel
  *  - getDateFromContext : Get date from URL or from selected accommodation
  *  - getDateFromSelectedAccommodation
  *  - getSelectedRoomType: Returns selected room type from first checked checkin point.
  *  - getAvailableHotels : Returns available establishments for current selection
  *  - getCandidatesHotels
  *
  * Created        : 2020-01-21 by @opheJansen
  * Last modified  : 2020-06-18 by @WilfriedDeluche
  */

 class Accommodation {
  constructor($accommodationBloc) {
    this.accommodationBloc = $accommodationBloc;
    this.checkinDateField = this.accommodationBloc.find('.checkin-date');
    this.checkoutDateField = this.accommodationBloc.find('.checkout-date');
    this.roomTypeField = this.accommodationBloc.find('.room-type');
    this.establishmentField = this.accommodationBloc.find('.establishments-list');
    this.illustrationBloc = this.accommodationBloc.find('.illustration');
    this.descriptionBloc = this.accommodationBloc.find('.description');
    this.accesspoints = this.accommodationBloc.find('.accommodation-accesspoints .accommodation-item');
    this.checkedAccesspoints = this.accesspoints.find('[type=checkbox]:checked');
    this.roomsList = this.initRoomsList();
    this.guestId = $('[name="guest_id"]');
    this.locale = $('[id=guest_locale]').val() || "en";
    this.dateFormat = $.datepicker.regional[this.locale].dateFormat;
    this.pageUrlParams = $.getUrlVars(window.location.href);

    this.bindEvents();
    this.initDatePickers();

    if (!this.guestId) {
      this.getAvailableRooms(true, true); // new guest record
    } else {
      this.selectRoomType();
    }
  }

  bindEvents() {
    const self = this;

    this.accommodationBloc.on('change', '.establishments-list', function () {
      self.checkAccesspointsFromHotelSelection();
    });

    this.accommodationBloc.on('change', '.checkin-date, .checkout-date', function(e) {
      const dateType = $(this).hasClass('checkin-date') ? 'checkin' : 'checkout';

      if (!self.datesRangeValid(dateType)) {
        self.emptyAllHotelSelection();
        e.stopPropagation();
      }
    });

    this.accommodationBloc.on('change', '.checkin-date, .checkout-date, .room-type', function () {
      const selectedHotel = self.getSelectedHotel() || self.pageUrlParams["hotel"];

      self.accesspoints.find("[type=checkbox]").prop("checked", false);
      self.getAvailableRooms(!!selectedHotel, true, selectedHotel);
    });
  }

  initDatePickers() {
    if (this.locale != "en") {
      $.datepicker.setDefaults($.datepicker.regional[this.locale]);
    }

    const checkinDate = this.getDateFromContext("checkin");
    const checkoutDate = this.getDateFromContext("checkout");

    if (checkinDate)
      this.checkinDateField.datepicker({ "dateFormat": this.dateFormat }).datepicker("setDate", new Date(checkinDate));

    if (checkoutDate)
      this.checkoutDateField.datepicker({ "dateFormat": this.dateFormat }).datepicker("setDate", new Date(checkoutDate));
  }

  datesRangeValid(dateType) {
    const checkinDate = this.checkinDateField.datepicker("getDate"),
          checkoutDate = this.checkoutDateField.datepicker("getDate");

    if (checkinDate == null || checkoutDate == null) return false;

    if (checkinDate.getTime() >= checkoutDate.getTime()) {
      if (dateType == "checkin")
        this.checkoutDateField.val("").change();
      else
        this.checkinDateField.val("").change();

      return false;
    }

    return true;
  }

  emptyAllHotelSelection() {
    this.establishmentField.find('option[value!=""]').remove();
    this.checkAccesspointsFromHotelSelection();
  }

  selectRoomType() {
    this.roomTypeField.find('option[value="' + this.getSelectedRoomType() + '"]').prop("selected", true).change();
  }

  getAvailableRooms(autoSelect, buildSelect, selectedHotel = "") {
    let availableCheckinPoints = {},
        availableHotels = [];

    if (this.checkinDateField.datepicker("getDate") == null) return;
    if (this.checkoutDateField.datepicker("getDate") == null) return;

    const checkinDate = this.checkinDateField.datepicker("getDate").getTime(),
          checkoutDate = this.checkoutDateField.datepicker("getDate").getTime(),
          roomType = this.roomTypeField.find('option:selected').val() != "" ? this.roomTypeField.find('option:selected').val() : this.pageUrlParams["room_type"];
    
    if (this.roomTypeField.find('option:selected').val() == "") {
      this.roomTypeField.find('option[value="' + roomType + '"]').attr('selected', "selected");
    }

    if (buildSelect) {
      this.establishmentField.find('option[value!=""]').remove();
    }

    if (checkinDate != "" && checkoutDate != "" && roomType != "") {
      const availableItems = this.getAvailableHotels(roomType, checkinDate, checkoutDate, selectedHotel);

      availableCheckinPoints = availableItems[0];
      availableHotels = availableItems[1];

      if (buildSelect) {
        this.appendAvailableHotels(availableHotels, selectedHotel, autoSelect);
      }
    };

    return availableCheckinPoints;
  }

  getAvailableHotels(roomType, checkinDate, checkoutDate, selectedHotel) {
    let availableCheckinPoints = {},
        availableHotels = [];

    const candidatesHotels = this.getCandidatesHotels(roomType, checkinDate, checkoutDate, selectedHotel);

    for (var i = 0; i < candidatesHotels.length; i++) {
      let available = true,
          roomPrice = 0,
          curtainDate = checkinDate;
      const hotelName = candidatesHotels[i],
            tmpDate = new Date(curtainDate);

      availableCheckinPoints[hotelName] = [];

      while (available == true && curtainDate < checkoutDate) {
        available = false;

        for (let j = 0; j < this.roomsList.length; j++) {
          const otherOption = this.roomsList[j];

          if (otherOption.hotel != hotelName) continue;

          const dateOption = $.datepicker.parseDate('yy-mm-dd', otherOption.date).getTime();

          if (curtainDate != dateOption) continue;

          if (otherOption.remainingSlots < 1 && otherOption.remainingSlots != -1 && hotelName != selectedHotel) continue;

          if (otherOption.type != roomType) continue;

          available = true;
          // if multiple prices for the same room type and hotel, we keep the higher one
          if (parseFloat(roomPrice) <= parseFloat(otherOption.price))
            roomPrice = otherOption.price;
          availableCheckinPoints[hotelName].push(otherOption.id);

          break;
        }

        tmpDate.setDate(tmpDate.getDate() + 1);
        curtainDate = tmpDate.getTime();
      }

      if (available) {
        availableHotels.push({
          "hotel": hotelName,
          "price": roomPrice
        });
      } else {
        availableCheckinPoints[hotelName] = [];
      }
    }

    return [availableCheckinPoints, availableHotels];
  }

  getCandidatesHotels(roomType, checkinDate, checkoutDate, selectedHotel) {
    let candidatesHotels = [];

    for (var i = 0; i < this.roomsList.length; i++) {
      const room = this.roomsList[i],
            roomDate = $.datepicker.parseDate('yy-mm-dd', room.date).getTime();

      if (roomDate < checkinDate || roomDate >= checkoutDate) continue;

      if (room.remainingSlots < 1 && room.remainingSlots != -1) continue;

      if (room.type != roomType) continue;

      if (candidatesHotels.indexOf(room.hotel) == -1) {
        candidatesHotels.push(room.hotel);
      }
    }

    if (selectedHotel != "" && candidatesHotels.indexOf(selectedHotel) == -1) {
      candidatesHotels.push(selectedHotel);
    }

    return candidatesHotels
  }

  appendAvailableHotels(availableHotels, selectedHotel, autoSelect) {
    if (availableHotels.length === 1) {
      this.establishmentField.append(this.buildHotelOption(availableHotels[0]["hotel"], availableHotels[0]["price"], true));
    } else if (availableHotels.length > 0) {
      for (var i = 0; i < availableHotels.length; i++) {
        if (selectedHotel == availableHotels[i]["hotel"] && autoSelect) {
          this.establishmentField.append(this.buildHotelOption(availableHotels[i]["hotel"], availableHotels[i]["price"], true));
        } else {
          this.establishmentField.append(this.buildHotelOption(availableHotels[i]["hotel"], availableHotels[i]["price"], false));
        }
      }
    }

    this.checkAccesspointsFromHotelSelection();
  }

  buildHotelOption(hotelName, hotelPrice, selected) {
    const optionName = hotelName + " - " + hotelPrice,
          $option = $("<option></option>");

    $option.attr("value", hotelName).text(optionName);

    if (selected)
      $option.attr("selected", "selected");

    return $option;
  }

  checkAccesspointsFromHotelSelection() {
    const checkinPoints = this.getAvailableRooms(false, false),
          establishment = this.establishmentField.val();

    this.accommodationBloc.find(".accommodation-accesspoints [type=checkbox]").prop("checked", false);

    if (establishment != "") {
      const accesspointIds = checkinPoints[establishment] || [];

      for (let i = 0; i < accesspointIds.length; i++) {
        this.accommodationBloc.find(".accommodation-accesspoints .accesspoint-" + accesspointIds[i]).find("[type=checkbox]").prop("checked", true);
      }
    }

    this.accommodationBloc.find(".accommodation-accesspoints [type=checkbox]").eq(0).change();
    this.checkedAccesspoints = this.accesspoints.find('[type=checkbox]:checked');
    this.displayIllustration();
    this.displayDescription();
  }

  displayIllustration() {
    let illustrationUrl = "";
    const self = this;

    this.illustrationBloc.find("p").remove();

    this.checkedAccesspoints.each(function() {
      illustrationUrl = $(this).closest('.accommodation-item').data('illustration-url');

      if (illustrationUrl !== "" && illustrationUrl !== undefined) {
        self.illustrationBloc.append("<p><img src='" + illustrationUrl + "' class='img-responsive' /></p>");

        return false;
      }
    });
  }

  displayDescription() {
    const self = this;

    this.descriptionBloc.html("");

    this.checkedAccesspoints.each(function() {
      const description = $(this).closest('.accommodation-item').find('.accesspoint-description').html();

      if (description !== "" && description !== undefined) {
        self.descriptionBloc.html(description + "<br />");

        return false;
      }
    });
  }

  initRoomsList() {
    return this.accesspoints.map(function() {
      const $accesspoint = $(this);

      return {
        "type": $accesspoint.data("room-type"),
        "date": $accesspoint.data("date"),
        "hotel": $accesspoint.data("location"),
        "remainingSlots": $accesspoint.data("remaining-slots"),
        "price": $accesspoint.data("price"),
        "id": $accesspoint.data("id"),
      };
    });
  }

  getSelectedHotel() {
    let selectedHotel;

    this.checkedAccesspoints.each(function() {
      selectedHotel = $(this).closest('.accommodation-item').attr('data-location');

      return false;
    });

    return selectedHotel;
  }

  getDateFromContext(dateType) {
    if (this.checkedAccesspoints.length > 0) {
      return this.getDateFromSelectedAccommodation(dateType);
    } else if (this.pageUrlParams[dateType + '_date']) {
      return new Date(this.pageUrlParams[dateType + '_date']).getTime();
    }
  }

  getDateFromSelectedAccommodation(dateType) {
    let checkedDates = [],
        date;

    this.checkedAccesspoints.each(function() {
      checkedDates.push(new Date($(this).closest('.accommodation-item').attr('data-date')).getTime());
    });

    if (dateType == "checkin") {
      date = new Date(Math.min.apply(Math, checkedDates));
    } else if (dateType == "checkout") {
      date = new Date(Math.max.apply(Math, checkedDates));
      date.setDate(date.getDate() + 1);
    }

    return date;
  }

  getSelectedRoomType() {
    let selectedRoomType = "";

    this.checkedAccesspoints.each(function() {
      selectedRoomType = $(this).closest('.accommodation-item').attr('data-room-type');

      return false;
    });

    return selectedRoomType;
  }

}
