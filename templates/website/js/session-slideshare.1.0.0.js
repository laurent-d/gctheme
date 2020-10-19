$("[data-section-type='session-live']").each(function() {
  if ($("[data-session-support-link]").length && $('.session-live-slides').length) {
    $(window).on('load', function() {
      const supportUrl = $("[data-session-support-link]").data("session-support-link");
      const requestUrl = "https://www.slideshare.net/api/oembed/2?url=" + supportUrl + "&format=json";
      slideshareRequest(requestUrl);
    });

    function slideshareRequest(requestUrl) {
      $.ajax({
        url : requestUrl,
        type : 'GET',
        dataType: "jsonp",
        success: function(data) {
          const $slideshareContainer = $('.session-live-slides')
          $slideshareContainer.append(data.html)
        }
      });
    }
  }
});
