class SessionsSearch {
  constructor() {
    this.searchForm = $(".sessions-search-form");
    this.sessionsList = $(".sessions-list");
    this.noResults = $(".no-results");
    this.searchTimeout = null;
    this.searchTextTerms = [];
    this.searchDates = null;
    this.searchStartTime = null;
    this.searchEndTime = null;
    this.searchSessionTypes = null;
    this.searchThematics = null;
    this.searchLocations = null;
    this.bindSearchEvents();
    this.search();
  }

  bindSearchEvents() {
    const self = this;

    $(document).on("keyup", ".form-text-search", function() {
      self.searchForm.trigger("submit");
    });
    $(document).on("change", ".form-slider-handle, .search-filter [type=checkbox], .search-filter [type=radio]", function() {
      self.searchForm.trigger("submit");
    });
    $(document).on("click", ".sessions-list .session-thematics a", function() {
      self.singleChoiceForThematics($(this).data("thematic-id"));
      self.searchForm.trigger("submit");
    });

    self.searchForm.on("submit", function(e) {
      e.preventDefault();
      self.clearTimeout();
      self.addBackdrop();
      self.searchTimeout = setTimeout(function() {
        self.search();
      }, 500);
    });
  }

  clearTimeout() {
    if (this.searchTimeout)
      clearTimeout(this.searchTimeout);
  }

  addBackdrop() {
    if (this.sessionsList.find(".sessions-backdrop").length == 0 && this.noResults.hasClass('hide'))
      this.sessionsList.prepend("<div class='sessions-backdrop'></div>");
  }

  removeBackdrop() {
    this.sessionsList.find(".sessions-backdrop").remove();
  }

  modifyPageURL() {
    const searchQuery = this.searchForm.serialize();
    const pagePath = window.location.pathname;

    window.history.pushState(null, null, pagePath + "?" + searchQuery);
  }

  singleChoiceForThematics(thematicId) {
    this.searchForm.find(".search-thematics [type=checkbox]").prop("checked", false); // uncheck all thematics
    this.searchForm.find(".search-thematics [type=checkbox][value=" + thematicId + "]").prop("checked", true);
  }

  extractSearchParams() {
    const searchParams = this.searchForm.serializeArray();
    const searchText = this.extractSimpleSearchParam(searchParams, "q");

    this.searchTextTerms = this.searchTextRegexTerms(searchText);
    this.searchDates = this.extractArraySearchParam(searchParams, "dates[]");
    this.searchStartTime = this.extractSimpleSearchParam(searchParams, "start_time");
    this.searchEndTime = this.extractSimpleSearchParam(searchParams, "end_time");
    this.searchSessionTypes = this.extractArraySearchParam(searchParams, "session_types[]");
    this.searchThematics = this.extractArraySearchParam(searchParams, "thematics[]");
    this.searchLocations = this.extractArraySearchParam(searchParams, "locations[]");
  }

  normalizeTextSearch(search) {
    // Thanks to https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
    return search.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  searchTextRegexTerms(search) {
    if (!search) return [];

    const searchTerms = this.normalizeTextSearch(search).split(' ');

    return searchTerms.reduce(function(acc, term) {
      if (term.length > 0)
        acc.push(new RegExp('\\b' + term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')));
      return acc;
    }, []);
  }

  extractArraySearchParam(params, key) {
    return params.filter(function(searchFilter) {
      return searchFilter.name == key;
    }).map(function(searchFilter) {
      return searchFilter.value;
    });
  }

  extractSimpleSearchParam(params, key) {
    const searchParam = params.find(function(searchFilter) {
      return searchFilter.name == key;
    });
    return searchParam && searchParam["value"];
  }

  arraySearchMatchesItem(searchArray, itemValue) {
    return searchArray.length == 0 || $.inArray(itemValue, searchArray) !== -1
  }

  timeSearchMatchesItem(startTime, endTime) {
    if (!this.searchStartTime || !this.searchEndTime)
      return true;

    return startTime >= this.searchStartTime && startTime <= this.searchEndTime && endTime >= this.searchStartTime && endTime <= this.searchEndTime;
  }

  allSearchTermsMatchSearchableKeywords(keywordsStr) {
    if (this.searchTextTerms.length == 0)
      return true;

    return this.searchTextTerms.filter(function(regex) {
      return keywordsStr.search(regex) === -1;
    }).length == 0;
  }

  showItemIfMatchesSearch($item) {
    const matchTextSearch = this.allSearchTermsMatchSearchableKeywords($item.data("searchable-keywords"));
    const matchDate = this.arraySearchMatchesItem(this.searchDates, $item.data("date"));
    const matchTimeslot = this.timeSearchMatchesItem($item.data("start-time"), $item.data("end-time"));
    const matchSessionTypes = this.arraySearchMatchesItem(this.searchSessionTypes, $item.data("session-type"));
    const matchThematics = (function(_this) {
      return $item.data("thematics").split(",").some(function(itemValue) {
        return _this.arraySearchMatchesItem(_this.searchThematics, itemValue);
      });
    })(this);
    const matchLocations = this.arraySearchMatchesItem(this.searchLocations, $item.data("location"));;

    if (matchTextSearch && matchDate && matchTimeslot && matchSessionTypes && matchThematics && matchLocations)
      $item.removeClass("hide");
    else
      $item.addClass("hide");
  }

  search() {
    const self = this;

    self.extractSearchParams();
    self.modifyPageURL()

    self.sessionsList.find(".session-item").each(function(i, item) {
      self.showItemIfMatchesSearch($(item));
    });

    self.removeBackdrop();

    if (self.sessionsList.find(".session-item:not(.hide)").length == 0) {
      self.noResults.removeClass('hide');
    } else {
      self.noResults.addClass('hide');
    }
  }
}

if ($(".sessions-search-form").length > 0)
  new SessionsSearch();
