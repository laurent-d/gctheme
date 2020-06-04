function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * A lightweight youtube embed. Still should feel the same to the user, just MUCH faster to initialize and paint.
 *
 * Thx to these as the inspiration
 *   https://storage.googleapis.com/amp-vs-non-amp/youtube-lazy.html
 *   https://autoplay-youtube-player.glitch.me/
 *
 * Once built it, I also found these:
 *   https://github.com/ampproject/amphtml/blob/master/extensions/amp-youtube (👍👍)
 *   https://github.com/Daugilas/lazyYT
 *   https://github.com/vb/lazyframe
 */
var LiteYTEmbed = /*#__PURE__*/function (_HTMLElement) {
  "use strict";

  _inherits(LiteYTEmbed, _HTMLElement);

  var _super = _createSuper(LiteYTEmbed);

  function LiteYTEmbed() {
    var _this;

    _classCallCheck(this, LiteYTEmbed);

    _this = _super.call(this); // Gotta encode the untrusted value
    // https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#rule-2---attribute-escape-before-inserting-untrusted-data-into-html-common-attributes

    _this.videoId = encodeURIComponent(_this.getAttribute('videoid'));
    /**
     * Lo, the youtube placeholder image!  (aka the thumbnail, poster image, etc)
     * There is much internet debate on the reliability of thumbnail URLs. Weak consensus is that you
     * cannot rely on anything and have to use the YouTube Data API.
     *
     * amp-youtube also eschews using the API, so they just try sddefault with a hqdefault fallback:
     *   https://github.com/ampproject/amphtml/blob/6039a6317325a8589586e72e4f98c047dbcbf7ba/extensions/amp-youtube/0.1/amp-youtube.js#L498-L537
     * For now I'm gonna go with this confident (lol) assertion: https://stackoverflow.com/a/20542029, though I'll use `i.ytimg` to optimize for origin reuse.
     *
     * Worth noting that sddefault is _higher_ resolution than hqdefault. Naming is hard. ;)
     * From my own testing, it appears that hqdefault is ALWAYS there sddefault is missing for ~10% of videos
     *
     * TODO: Do the sddefault->hqdefault fallback
     *       - When doing this, apply referrerpolicy (https://github.com/ampproject/amphtml/pull/3940)
     * TODO: Consider using webp if supported, falling back to jpg
     */

    _this.posterUrl = "https://i.ytimg.com/vi/".concat(_this.videoId, "/hqdefault.jpg"); // Warm the connection for the poster image

    LiteYTEmbed.addPrefetch('preload', _this.posterUrl, 'image'); // TODO: support dynamically setting the attribute via attributeChangedCallback

    return _this;
  }

  _createClass(LiteYTEmbed, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;

      this.style.backgroundImage = "url(\"".concat(this.posterUrl, "\")");
      var playBtn = document.createElement('div');
      playBtn.classList.add('lty-playbtn');
      this.append(playBtn); // On hover (or tap), warm up the TCP connections we're (likely) about to use.

      this.addEventListener('pointerover', LiteYTEmbed.warmConnections, {
        once: true
      }); // Once the user clicks, add the real iframe and drop our play button
      // TODO: In the future we could be like amp-youtube and silently swap in the iframe during idle time
      //   We'd want to only do this for in-viewport or near-viewport ones: https://github.com/ampproject/amphtml/pull/5003

      this.addEventListener('click', function (e) {
        return _this2.addIframe();
      });
    } // // TODO: Support the the user changing the [videoid] attribute
    // attributeChangedCallback() {
    // }

    /**
     * Add a <link rel={preload | preconnect} ...> to the head
     */

  }, {
    key: "addIframe",
    value: function addIframe() {
      var iframeHTML = "\n<iframe width=\"560\" height=\"315\" frameborder=\"0\"\n  allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen\n  src=\"https://www.youtube-nocookie.com/embed/".concat(this.videoId, "?autoplay=1\"\n></iframe>");
      this.insertAdjacentHTML('beforeend', iframeHTML);
      this.classList.add('lyt-activated');
    }
  }], [{
    key: "addPrefetch",
    value: function addPrefetch(kind, url, as) {
      var linkElem = document.createElement('link');
      linkElem.rel = kind;
      linkElem.href = url;

      if (as) {
        linkElem.as = as;
      }

      linkElem.crossOrigin = 'anonymous';
      document.head.append(linkElem);
    }
    /**
     * Begin pre-connecting to warm up the iframe load
     * Since the embed's network requests load within its iframe,
     *   preload/prefetch'ing them outside the iframe will only cause double-downloads.
     * So, the best we can do is warm up a few connections to origins that are in the critical path.
     *
     * Maybe `<link rel=preload as=document>` would work, but it's unsupported: http://crbug.com/593267
     * But TBH, I don't think it'll happen soon with Site Isolation and split caches adding serious complexity.
     */

  }, {
    key: "warmConnections",
    value: function warmConnections() {
      if (LiteYTEmbed.preconnected) return; // The iframe document and most of its subresources come right off youtube.com

      LiteYTEmbed.addPrefetch('preconnect', 'https://www.youtube-nocookie.com'); // The botguard script is fetched off from google.com

      LiteYTEmbed.addPrefetch('preconnect', 'https://www.google.com'); // Not certain if these ad related domains are in the critical path. Could verify with domain-specific throttling.

      LiteYTEmbed.addPrefetch('preconnect', 'https://googleads.g.doubleclick.net');
      LiteYTEmbed.addPrefetch('preconnect', 'https://static.doubleclick.net');
      LiteYTEmbed.preconnected = true;
    }
  }]);

  return LiteYTEmbed;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement)); // Register custome element


customElements.define('lite-youtube', LiteYTEmbed);
