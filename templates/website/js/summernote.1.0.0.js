/**
  * Copyright (c) 2019
  *
  * Summernote RTE Library
  * Documentation: https://summernote.org
  *
  * Description:
  *  - Load library stylesheet
  *  - Load library script
  *  - Load language script
  *  - Init RTE
  *
  * Functions:
  *  - async: append script to DOM and execute code only after script is loaded
  *  - initSummernote: init RTE with right locale
  *
  * Created        : 2019-07-11 by @WilfriedDeluche
  * Last modified  : 2019-07-11 by @WilfriedDeluche
  */

function initSummernote(container, locale) {
  $(container).summernote({
    lang: locale,
    styleTags: ['p', 'h1', 'h2', 'blockquote'], // default value is ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    toolbar: [
      // [groupName, [list of button]]
      ['para', ['style', 'ul', 'ol']],
      ['style', ['bold', 'italic']],
      ['insert', ['link']],
      ['style', ['clear']]
      // ['view', ['codeview']] display source code
    ]
  });

  $(container).siblings(".summernote-loader").hide();
  $.summernote.dom.emptyPara = "<div><br /></div>"; // to match DraftJS use of <div> instead of <p>

  if ($(container).attr('disabled'))
    $(container).summernote('disable');
}

lazyLoadStylesheet("https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote.css");

lazyLoadScript("https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote.js", null, function() {
  $('.summernote').each(function (index, container) {
    var locale = $(container).data("locale");
    var summernoteLocale = locale + "-" + locale.toUpperCase();
    var localeScriptUrl = "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/lang/summernote-" + summernoteLocale + ".js";

    if (summernoteLocale != "en-EN") {
      lazyLoadScript(localeScriptUrl, null, function() {
        initSummernote(container, summernoteLocale);
      });
    } else {
      initSummernote(container, summernoteLocale);
    }
  });
});
