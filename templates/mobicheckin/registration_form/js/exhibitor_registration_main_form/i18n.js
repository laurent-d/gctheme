var I18n = {
  locale: "fr",
  availableLocales: [],
  t: function(key) {
    var lookupTable = this.translations[this.locale];
    if (lookupTable[key] != undefined) {
      return lookupTable[key];
    } else {
      return key;
    }
  },
  translations: {}
};

window.I18n = I18n;
