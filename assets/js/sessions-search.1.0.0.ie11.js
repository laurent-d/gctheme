function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SessionsSearch =
/*#__PURE__*/
function () {
  "use strict";

  function SessionsSearch() {
    _classCallCheck(this, SessionsSearch);

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

  _createClass(SessionsSearch, [{
    key: "bindSearchEvents",
    value: function bindSearchEvents() {
      var self = this;
      $(document).on("keyup", ".form-text-search", function () {
        self.searchForm.trigger("submit");
      });
      $(document).on("change", ".form-slider-handle, .search-filter [type=checkbox]", function () {
        self.searchForm.trigger("submit");
      });
      $(document).on("click", ".sessions-list .session-thematics a", function () {
        self.singleChoiceForThematics($(this).data("thematic-id"));
        self.searchForm.trigger("submit");
      });
      self.searchForm.on("submit", function (e) {
        e.preventDefault();
        self.clearTimeout();
        self.addBackdrop();
        self.searchTimeout = setTimeout(function () {
          self.search();
        }, 500);
      });
    }
  }, {
    key: "clearTimeout",
    value: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function () {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
    })
  }, {
    key: "addBackdrop",
    value: function addBackdrop() {
      if (this.sessionsList.find(".sessions-backdrop").length == 0 && this.noResults.hasClass('hide')) this.sessionsList.prepend("<div class='sessions-backdrop'></div>");
    }
  }, {
    key: "removeBackdrop",
    value: function removeBackdrop() {
      this.sessionsList.find(".sessions-backdrop").remove();
    }
  }, {
    key: "modifyPageURL",
    value: function modifyPageURL() {
      var searchQuery = this.searchForm.serialize();
      var pagePath = window.location.pathname;
      window.history.pushState(null, null, pagePath + "?" + searchQuery);
    }
  }, {
    key: "singleChoiceForThematics",
    value: function singleChoiceForThematics(thematicId) {
      this.searchForm.find(".search-thematics [type=checkbox]").prop("checked", false); // uncheck all thematics

      this.searchForm.find(".search-thematics [type=checkbox][value=" + thematicId + "]").prop("checked", true);
    }
  }, {
    key: "extractSearchParams",
    value: function extractSearchParams() {
      var searchParams = this.searchForm.serializeArray();
      var searchText = this.extractSimpleSearchParam(searchParams, "q");
      this.searchTextTerms = this.searchTextRegexTerms(searchText);
      this.searchDates = this.extractArraySearchParam(searchParams, "dates[]");
      this.searchStartTime = this.extractSimpleSearchParam(searchParams, "start_time");
      this.searchEndTime = this.extractSimpleSearchParam(searchParams, "end_time");
      this.searchSessionTypes = this.extractArraySearchParam(searchParams, "session_types[]");
      this.searchThematics = this.extractArraySearchParam(searchParams, "thematics[]");
      this.searchLocations = this.extractArraySearchParam(searchParams, "locations[]");
    }
  }, {
    key: "normalizeTextSearch",
    value: function normalizeTextSearch(search) {
      // Thanks to https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
      return search.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }
  }, {
    key: "searchTextRegexTerms",
    value: function searchTextRegexTerms(search) {
      if (!search) return [];
      var searchTerms = this.normalizeTextSearch(search).split(' ');
      return searchTerms.reduce(function (acc, term) {
        if (term.length > 0) acc.push(new RegExp('\\b' + term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')));
        return acc;
      }, []);
    }
  }, {
    key: "extractArraySearchParam",
    value: function extractArraySearchParam(params, key) {
      return params.filter(function (searchFilter) {
        return searchFilter.name == key;
      }).map(function (searchFilter) {
        return searchFilter.value;
      });
    }
  }, {
    key: "extractSimpleSearchParam",
    value: function extractSimpleSearchParam(params, key) {
      var searchParam = params.find(function (searchFilter) {
        return searchFilter.name == key;
      });
      return searchParam && searchParam["value"];
    }
  }, {
    key: "arraySearchMatchesItem",
    value: function arraySearchMatchesItem(searchArray, itemValue) {
      return searchArray.length == 0 || $.inArray(itemValue, searchArray) !== -1;
    }
  }, {
    key: "timeSearchMatchesItem",
    value: function timeSearchMatchesItem(startTime, endTime) {
      if (!this.searchStartTime || !this.searchEndTime) return true;
      return startTime >= this.searchStartTime && startTime <= this.searchEndTime && endTime >= this.searchStartTime && endTime <= this.searchEndTime;
    }
  }, {
    key: "allSearchTermsMatchSearchableKeywords",
    value: function allSearchTermsMatchSearchableKeywords(keywordsStr) {
      if (this.searchTextTerms.length == 0) return true;
      return this.searchTextTerms.filter(function (regex) {
        return keywordsStr.search(regex) === -1;
      }).length == 0;
    }
  }, {
    key: "showItemIfMatchesSearch",
    value: function showItemIfMatchesSearch($item) {
      var matchTextSearch = this.allSearchTermsMatchSearchableKeywords($item.data("searchable-keywords"));
      var matchDate = this.arraySearchMatchesItem(this.searchDates, $item.data("date"));
      var matchTimeslot = this.timeSearchMatchesItem($item.data("start-time"), $item.data("end-time"));
      var matchSessionTypes = this.arraySearchMatchesItem(this.searchSessionTypes, $item.data("session-type"));

      var matchThematics = function (_this) {
        return $item.data("thematics").split(",").some(function (itemValue) {
          return _this.arraySearchMatchesItem(_this.searchThematics, itemValue);
        });
      }(this);

      var matchLocations = this.arraySearchMatchesItem(this.searchLocations, $item.data("location"));
      ;
      if (matchTextSearch && matchDate && matchTimeslot && matchSessionTypes && matchThematics && matchLocations) $item.removeClass("hide");else $item.addClass("hide");
    }
  }, {
    key: "search",
    value: function search() {
      var self = this;
      self.extractSearchParams();
      self.modifyPageURL();
      self.sessionsList.find(".session-item").each(function (i, item) {
        self.showItemIfMatchesSearch($(item));
      });
      self.removeBackdrop();

      if (self.sessionsList.find(".session-item:not(.hide)").length == 0) {
        self.noResults.removeClass('hide');
      } else {
        self.noResults.addClass('hide');
      }
    }
  }]);

  return SessionsSearch;
}();

if ($(".sessions-search-form").length > 0) new SessionsSearch();
