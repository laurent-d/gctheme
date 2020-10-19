$.fn.center = function () {
	this.css("left", ($(window).width() / 2) - (this.outerWidth() / 2));
	return this;
}

$.fn.setNav = function () {
	var calScreenWidth = $(window).width();
	var menuLayout = "leftalign";
	var $menuItems = $('#menu_wrapper .nav li.menu-item, li.menu-item.dp');
	var $mobileMainMenu = $('#mobile_main_menu.mobile_main_nav');
	var $mobileSubMenu = $('.mobile_menu_wrapper div #sub_menu');

	if (calScreenWidth >= 960) {
		$menuItems.hover(
			function () {
				$(this).children('ul:first').addClass('visible');
				$(this).children('ul:first').addClass('hover');
			},
			function () {
				$(this).children('ul:first').removeClass('visible');
				$(this).children('ul:first').removeClass('hover');
			}
		);

		$menuItems.children('ul:first.hover').hover(
			function () {
				$(this).stop().addClass('visible');
			},
			function () {
				$(this).stop().removeClass('visible');
			}
		);
	}

	$('body').on('click', '.mobile_main_nav > li a', function (event) {
		var $thisListItem = $(this).parent('li');
		var $sublist = $thisListItem.find('ul.sub-menu:first');
		var menuContainerClass = $thisListItem.parent('#mobile_main_menu.mobile_main_nav').parent('div');
		var menuLevel = 'top_level';
		var parentMenu = '';

		if ($sublist.length > 0) {
			event.preventDefault();
		}

		if ($thisListItem.parent('ul').attr('id') == 'mobile_main_menu') {
			menuLevel = 'parent_level';
		} else {
			parentMenu = $thisListItem.attr('id');
		}

		if ($sublist.length > 0) {
			$mobileMainMenu.addClass('mainnav_out');
			$mobileSubMenu.removeClass('subnav_in');
			$mobileSubMenu.addClass('mainnav_out');

			if (menuLayout == 'hammenufull') {
				$('.mobile_menu_wrapper .logo_container').fadeOut('slow');
				$('.mobile_menu_wrapper .social_wrapper').fadeOut('slow');
			}

			setTimeout(function () {
				$mobileMainMenu.css('display', 'none');
				$mobileSubMenu.remove();

				var subMenuHTML = '<li><a href="#" id="menu_back" class="' + menuLevel + '" data-parent="' + parentMenu + '">' + $('#pp_back').val() + '</a></li>';
				subMenuHTML += $sublist.html();

				menuContainerClass.append('<ul id="sub_menu" class="nav ' + menuLevel + '"></ul>');
				menuContainerClass.find('#sub_menu').html(subMenuHTML);
				menuContainerClass.find('#sub_menu').addClass('subnav_in');
			}, 200);
		}
	});

	$('body').on('click', '#menu_back.parent_level', function () {
		var $mobileSubMenu = $(this).closest('.mobile_menu_wrapper').find('div #sub_menu');

		$mobileSubMenu.removeClass('subnav_in');
		$mobileSubMenu.addClass('subnav_out');
		$mobileMainMenu.removeClass('mainnav_out');

		if (menuLayout == 'hammenufull') {
			$('.mobile_menu_wrapper .logo_container').fadeIn('slow');
			$('.mobile_menu_wrapper .social_wrapper').fadeIn('slow');
		}

		setTimeout(function () {
			$mobileSubMenu.remove();
			$mobileMainMenu.css('display', 'block');
			$mobileMainMenu.addClass('mainnav_in');
		}, 200);
	});

	$('body').on('click', '#menu_back.top_level', function () {
		event.preventDefault();
		$mobileSubMenu.addClass('subnav_out');
		var parentMenuId = $(this).data('parent');

		setTimeout(function () {
			$mobileSubMenu.remove();
			var menuLevel = 'top_level';
			var parentMenu = '';

			if ($('#mobile_main_menu.mobile_main_nav li#' + parentMenuId).parent('ul.sub-menu:first').parent('li').parent('ul#main_menu').length == 1) {
				menuLevel = 'parent_level';
			} else {
				parentMenu = $('#mobile_main_menu.mobile_main_nav li#' + parentMenuId).parent('ul.sub-menu:first').parent('li').attr('id');
			}

			var subMenuHTML = '<li><a href="#" id="menu_back" class="' + menuLevel + '" data-parent="' + parentMenu + '">' + $('#pp_back').val() + '</a></li>';
			subMenuHTML += $('#mobile_main_menu.mobile_main_nav li#' + parentMenuId).parent('ul.sub-menu:first').html();
			$('.mobile_menu_wrapper div').append('<ul id="sub_menu" class="nav ' + menuLevel + '"></ul>');

			$mobileSubMenu.html(subMenuHTML);
			$mobileSubMenu.addClass('mainnav_in');
		}, 200);
	});
}

$.fn.setiLightbox = function () {
	var thumbnailPath = "horizontal";
	var iLightboxapi = $('a.fancy-gallery, .pp_gallery a, .img_frame, .fancy_video, .lightbox_vimeo, .lightbox_youtube, .woocommerce-product-gallery__image a').iLightBox({
		skin: "metro-black",
		path: thumbnailPath,
		type: 'inline, video, image',
		maxScale: 1,
		controls: {
			slideshow: true,
			arrows: true,
			thumbnail: "1"
		},
		overlay: {
			opacity: "0.8"
		},
		callback: {
			onOpen: function (api, position) {
				$('body').addClass('blur');
			},
			onHide: function () {
				$('body').removeClass('blur');
			}
		}
	});

	iLightboxapi.refresh();
}

function adjustIframes() {
	$('iframe').each(function () {
		var $this = $(this),
			proportion = $this.data('proportion'),
			w = $this.attr('width'),
			actual_w = $this.width();

		if (!proportion) {
			proportion = $this.attr('height') / w;
			$this.data('proportion', proportion);
		}

		if (actual_w != w) {
			$this.css('height', Math.round(actual_w * proportion) + 'px !important');
		}
	});
}

function is_touch_device() {
	// 'ontouchstart' works on most browsers || 'onmsgesturechange' works on ie10
	return 'ontouchstart' in window || 'onmsgesturechange' in window;
}

function triggerClick(element) {
	if (document.createEvent) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		element.dispatchEvent(evt);
	} else {
		element.click();
	}
}
