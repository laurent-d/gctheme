$(document).ready(function () {
  "use strict";

  $(document).setNav();

  var menuLayout = "leftalign";
  var overlayEffect = "blur";
  var $headerStyleWrapper = $('.header_style_wrapper');
  var $customLogo = $('#custom_logo');
  var $customLogoTransparent = $('#custom_logo_transparent');
  var $menuWrapperLinks = $('#menu_wrapper div .nav li > a');
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  var topBarHeight = $headerStyleWrapper.height();
  var logoMargin = parseInt($customLogo.css('marginTop'));
  var logoTransMargin = parseInt($customLogoTransparent.css('marginTop'));
  var menuPaddingTop = parseInt($menuWrapperLinks.css('paddingTop'));
  var menuPaddingBottom = parseInt($menuWrapperLinks.css('paddingBottom'));

  $(window).resize(function () {
    //Resize main menu
    $(document).setNav();

    if ($(this).width() < 768) {
      $('#menu_expand_wrapper a').trigger('click');

      //Calculate wrapper padding top value
      if (menuLayout != 'leftmenu') {
        var resizedTopBarHeight = $('.header_style_wrapper').height();
        $('#wrapper').css('paddingTop', resizedTopBarHeight + 'px');
        $('.fullscreen-section').css('top', resizedTopBarHeight + 'px');
        $('.logo_wrapper').css('marginTop', '');
        $('.top_bar #searchform button').css('paddingTop', '');
      } else {
        $('#wrapper').css('paddingTop', 0);
      }

      //Remove sticky sidebar for mobile & tablet devices
      $("#page_content_wrapper .sidebar_wrapper").trigger("sticky_kit:detach");
    } else {
      //Calculate wrapper padding top value
      $('#wrapper').css('paddingTop', parseInt($('.header_style_wrapper').height()) + 'px');
      $('.fullscreen-section').css('top', parseInt($('.header_style_wrapper').height()) + 'px');

      //Reset menu padding top and bottom
      $('#menu_wrapper div .nav > li > a').attr('style', '');
    }

    //Calculate revolution slider height
    if ($('.page_slider.menu_transparent').find('.rev_slider_wrapper').length > 0) {
      var sliderHeight = $('.page_slider.menu_transparent').find('.rev_slider_wrapper').height();
      var topBarHeight = $('.top_bar').height();

      if ($('.above_top_bar').length > 0) {
        topBarHeight += $('.above_top_bar').height();
      }
      if ($('.page_slider.menu_transparent').find('.rev_slider_wrapper.fullscreen-container').length > 0) {
        topBarHeight = 55;
      }

      $('.ppb_wrapper').css('marginTop', sliderHeight - topBarHeight + 'px');
      $('#page_content_wrapper').css('marginTop', sliderHeight - topBarHeight + 'px');
    }
  });

  $("img").mousedown(function () {
    return false;
  });

  if (menuLayout != 'leftmenu' || $(window).width() <= 768) {
    $('#wrapper').css('paddingTop', parseInt($('.header_style_wrapper').height()) + 'px');
    $('.fullscreen-section').css('top', parseInt($('.header_style_wrapper').height()) + 'px');
  }

  if (menuLayout != 'leftmenu' || $(window).width() <= 960) {
    $('#page_content_wrapper.split, .page_content_wrapper.split').css('top', parseInt(topBarHeight + $('.header_style_wrapper .above_top_bar').height()) + 'px');
    $('#page_content_wrapper.split, .page_content_wrapper.split').css('paddingBottom', parseInt(topBarHeight + $('.header_style_wrapper .above_top_bar').height()) + 'px');
    $(window).scroll(function () {
      if ($('#tg_smart_fixed_menu').val() == 1 && $('html').data('style') != 'fullscreen' && $('html').data('style') != 'fullscreen_white') {
        if ($(this).scrollTop() >= 200) {
          $('.extend_top_contact_info').hide();
          $('.header_style_wrapper').addClass('scroll');
          $('.top_bar').addClass('scroll');

          if ($('.top_bar').hasClass('hasbg')) {
            $('.top_bar').removeClass('hasbg');
            $('.top_bar').data('hasbg', 1);
            $('#custom_logo').removeClass('hidden');
            $('#custom_logo_transparent').addClass('hidden');
          }
        } else if ($(this).scrollTop() < 200) {
          $('.extend_top_contact_info').show();
          $('#custom_logo img').removeClass('zoom');
          $('#custom_logo_transparent img').removeClass('zoom');
          $('#custom_logo').css('marginTop', parseInt(logoMargin) + 'px');
          $('#custom_logo_transparent').css('marginTop', parseInt(logoTransMargin) + 'px');
          $('#menu_wrapper div .nav > li > a').css('paddingTop', menuPaddingTop + 'px');
          $('#menu_wrapper div .nav > li > a').css('paddingBottom', menuPaddingBottom + 'px');

          if ($('.top_bar').data('hasbg') == 1) {
            $('.top_bar').addClass('hasbg');
            $('#custom_logo').addClass('hidden');
            $('#custom_logo_transparent').removeClass('hidden');
          }

          $('.header_style_wrapper').removeClass('scroll');
          $('.top_bar').removeClass('scroll');
        }
      }
    });

    if ($('#tg_smart_fixed_menu').val() == 1 && $('html').data('style') != 'fullscreen' && $('html').data('style') != 'fullscreen_white') {
      //Smart sticky menu
      if (!is_touch_device()) {
        var lastScrollTop = 0;
        $(window).scroll(function (event) {
          var st = $(this).scrollTop();
          if (st > lastScrollTop && st > 0) {
            $('.top_bar').removeClass('scroll_up');
            $('.header_style_wrapper').removeClass('scroll_up').addClass('scroll_down');
          } else {
            $('.top_bar').addClass('scroll_up');
            $('.header_style_wrapper').addClass('scroll_up').removeClass('scroll_down');
          }
          lastScrollTop = st;

          $('.header_style_wrapper').attr('data-st', st).attr('data-lastscrolltop', lastScrollTop);
        });
      } else {
        $(document).bind('touchmove', function (e) {
          var currentY = e.originalEvent.touches[0].clientY;

          if (currentY > 200) {
            $('.top_bar').addClass('scroll_up');
            $('.header_style_wrapper').addClass('scroll_up').removeClass('scroll_down');
          } else {
            $('.top_bar').removeClass('scroll_up');
            $('.header_style_wrapper').removeClass('scroll_up').addClass('scroll_down');
          }

          $('.header_style_wrapper').attr('data-pos', currentY);
        });
      }
    }
  } // Endif (menuLayout != 'leftmenu' || $(window).width() <= 960)

  $('.progress_bar').waypoint(function (direction) {
    $(this).addClass('fadeIn');
    var progressContent = $(this).children('.progress_bar_holder').children('.progress_bar_content');
    var progressWidth = progressContent.data('score');

    progressContent.css({
      'width': progressWidth + '%'
    });
  }, {
    offset: '100%'
  });

  if ($('.page_slider.menu_transparent').find('.rev_slider_wrapper').length > 0) {
    var sliderHeight = $('.page_slider.menu_transparent').find('.rev_slider_wrapper').height();
    var topBarHeight = $('.top_bar').height();

    if ($('.above_top_bar').length > 0) {
      topBarHeight += $('.above_top_bar').height();
    }

    if ($('.page_slider.menu_transparent').find('.rev_slider_wrapper.fullscreen-container').length > 0) {
      var topBarHeight = 55;
    }

    $('.ppb_wrapper').css('marginTop', sliderHeight - topBarHeight + 'px');
    $('#page_content_wrapper').css('marginTop', sliderHeight - topBarHeight + 'px');
  }

  $('.animated').imagesLoaded().each(function () {
    var windowWidth = $(window).width();
    if (windowWidth >= 960) {
      $(this).waypoint(function (direction) {
        var animationClass = $(this).data('animation');
        $(this).addClass(animationClass, direction === 'down');
      }, {
        offset: '100%'
      });
    }
  });

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./) || $('#tg_live_builder').val() == 1) {
    $('.parallax').each(function () {
      var dataImgURL = $(this).data('image');
      if ($.type(dataImgURL) != "undefined") {
        $(this).css('background-image', 'url(' + dataImgURL + ')');
        $(this).css('background-size', 'cover');
        $(this).css('background-position', 'center center');
      }
    });
  } else {
    var parallaxSpeed = 0.5;
    if ($(window).width() > 1200) {
      parallaxSpeed = 0.7;
    }

    $('.parallax').each(function () {
      var parallaxObj = $(this);

      $(this).jarallax({
        zIndex: 0,
        speed: parallaxSpeed,
        onCoverImage: function () {
          parallaxObj.css('z-index', 0);
        }
      });
    });
  }

  $('.rev_slider_wrapper.fullscreen-container').each(function () {
    $(this).append('<div class="icon-scroll"></div>');
  });

  if ($('.one.fullwidth.slideronly').length > 0) {
    $('body').addClass('overflow_hidden');
  }

  if (!is_touch_device()) {
    $(window).stellar({
      positionProperty: 'transform',
      parallaxBackgrounds: false,
      responsive: true,
      horizontalScrolling: false,
      hideDistantElements: false
    });
  }

  if ($(window).width() < 768 || is_touch_device()) {
    $("#page_content_wrapper .sidebar_wrapper").trigger("sticky_kit:detach");
    $(".page_content_wrapper .sidebar_wrapper").trigger("sticky_kit:detach");
  }

  // Find all YouTube & Vimeo videos
  $('iframe[src*="youtube.com"]').each(function () {
    $(this).wrap('<div class="video-container"></div>');
  });

  $('iframe[src*="vimeo.com"]').each(function () {
    $(this).wrap('<div class="video-container"></div>');
  });

  $('#menu_expand_wrapper a').on('click', function () {
    $('#menu_wrapper').fadeIn();
    $('#custom_logo').animate({
      'left': '15px',
      'opacity': 1
    }, 400 );
    $('#menu_close').animate({
      'left': '-10px',
      'opacity': 1
    }, 400);
    $(this).animate({
      'left': '-60px',
      'opacity': 0
    }, 400);
    $('#menu_border_wrapper select').animate({
      'left': '0',
      'opacity': 1
    }, 400).fadeIn();
  });

  $('#menu_close').on('click', function () {
    $('#custom_logo').animate({
      'left': '-200px',
      'opacity': 0
    }, 400);
    $(this).stop().animate({
      'left': '-200px',
      'opacity': 0
    }, 400);
    $('#menu_expand_wrapper a').animate({
      'left': '20px',
      'opacity': 1
    }, 400);
    $('#menu_border_wrapper select').animate({
      'left': '-200px',
      'opacity': 0
    }, 400).fadeOut();
    $('#menu_wrapper').fadeOut();
  });

  //Add to top button when scrolling
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $('#toTop').stop().css({
        opacity: 1,
        "visibility": "visible"
      }).animate({
        "visibility": "visible"
      }, {
        duration: 1000,
        easing: "easeOutExpo"
      });
    } else if ($(this).scrollTop() == 0) {
      $('#toTop').stop().css({
        opacity: 0,
        "visibility": "hidden"
      }).animate({
        "visibility": "hidden"
      }, {
        duration: 1500,
        easing: "easeOutExpo"
      });
    }
  });

  $('#toTop, .hr_totop').on('click', function () {
    $('body,html,#page_content_wrapper.split').animate({
      scrollTop: 0
    }, 800);
  });

  $(document).mouseenter(function () {
    $('body').addClass('hover');
  });

  $(document).mouseleave(function () {
    $('body').removeClass('hover');
  });

  $('#post_more_close').on('click', function () {
    $('#post_more_wrapper').animate({
      right: '-380px'
    }, 300);
    return false;
  });

  $('#mobile_nav_icon').on('click', function () {
    $('body').toggleClass('js_nav');
    $('body').toggleClass(overlayEffect);
    $('#close_mobile_menu').addClass('open');

    if (is_touch_device()) {
      $('body.js_nav').css('overflow', 'auto');
    }
  });

  $('#close_mobile_menu').on('click', function () {
    $('body').removeClass('js_nav').removeClass(overlayEffect);
    $(this).removeClass('open');
  });

  $('.mobile_menu_close a, #mobile_menu_close').on('click', function () {
    $('body').removeClass('js_nav').removeClass(overlayEffect);
    $('#close_mobile_menu').removeClass('open');
  });

  $('.close_alert').on('click', function () {
    var target = $(this).data('target');
    $('#' + target).fadeOut();
  });

  $('.post_share').on('click', function () {
    var targetShareID = $(this).attr('data-share');
    var targetParentID = $(this).attr('data-parent');

    $(this).toggleClass('visible');
    $('#' + targetShareID).toggleClass('slideUp');
    $('#' + targetParentID).toggleClass('sharing');

    return false;
  });

  $('.skin_box').on('click', function () {
    $('.skin_box').removeClass('selected');
    $(this).addClass('selected');
    $('#skin').val($(this).attr('data-color'));
  });

  $('#demo_apply').on('click', function () {
    $('#ajax_loading').addClass('visible');
    $('body').addClass('loading');
    $("form#form_option").submit();
  });

  $('#option_wrapper').mouseenter(function () {
    $('body').addClass('overflow_hidden');
  });

  $('#option_wrapper').mouseleave(function () {
    $('body').removeClass('overflow_hidden');
  });

  $(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function (e) {
    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    var event = state ? 'FullscreenOn' : 'FullscreenOff';

    if (event == 'FullscreenOff') {
      $('#page_maximize').show();
      $('.header_style_wrapper').show();
      $('#option_btn').show();
    }
  });

  $('#page_maximize').on('click', function () {
    launchFullscreen(document.documentElement);
    $(this).hide();
    $('.header_style_wrapper').hide();
    $('#option_btn').hide();
  });

  $('#page_minimize').on('click', function () {
    exitFullscreen();
    $('#page_maximize').show();
    $(this).hide();
    $('.header_style_wrapper').show();
    $('#option_btn').show();
  });

  $('#page_share').on('click', function () {
    $('#overlay_background').addClass('visible share_open');
    $('#fullscreen_share_wrapper').css('visibility', 'visible');
  });

  $('#overlay_background').on('click', function () {
    if (!$('body').hasClass('js_nav')) {
      $('#overlay_background').removeClass('visible share_open');
      $('#fullscreen_share_wrapper').css('visibility', 'hidden');
    }
  });

  $('#post_share_text').click(function () {
    $('body').addClass('overflow_hidden blur');
    $('#side_menu_wrapper').addClass('visible share_open');
    $('#fullscreen_share_wrapper').css('visibility', 'visible');
  });

  $('#close_share').on('click', function () {
    $('body').removeClass('overflow_hidden blur');
    $('#side_menu_wrapper').removeClass('visible share_open');
    $('#fullscreen_share_wrapper').css('visibility', 'hidden');
  });

  $("#page_content_wrapper .sidebar_wrapper, .page_content_wrapper .sidebar_wrapper").stick_in_parent({
    offset_top: 100
  });

  $(window).resize(function () {
    if ($(window).width() < 768 || is_touch_device()) {
      $("#page_content_wrapper .sidebar_wrapper").trigger("sticky_kit:detach");
      $(".page_content_wrapper .sidebar_wrapper").trigger("sticky_kit:detach");
    } else {
      $("#page_content_wrapper .sidebar_wrapper, .page_content_wrapper .sidebar_wrapper").stick_in_parent({
        offset_top: 100
      });
    }
  });
});

$(window).on('resize load', adjustIframes);

function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
