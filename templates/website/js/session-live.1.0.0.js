/**
 * SessionLive class
 *
 * Created       : 2020-04-06 by @opheJansen
 * Last modified : 2020-07-16 by @laurent-d
 *
 */

const SPEAKER = "speaker";
const VIEWER = "viewer";
const VIDEO_TYPE_SCREEN = "screen";

const STREAM_MIN_WIDTH = 167; // this is speaker-panel width
const STREAM_MIN_HEIGHT = 125.25; // this is STREAM_MIN_WIDTH * 3/4

// video streams
const CAMERA_STREAM_CONTAINER_ID = "camera-stream-container";

// information
const VIEWERS_COUNT_DIV_CLASS = ".session-viewers";
const VIEWERS_COUNT_CLASS = ".viewers-count";
const MSG_WAITING_SPEAKER_CLASS = ".waiting-speaker-message";
const MSG_SPEAKER_LEFT_CLASS = ".speaker-left-live-message";
const CENTRAL_PANEL_CLASS = ".central-panel";
const INFORMATION_BAR_CLASS = ".information-bar";
const CAM_ACCESS_DENIED_CLASS = ".camera-acccess-denied";
const INITIALIZING_SPEAKER_LOADER_CLASS = ".initializing-speaker-loader";

// interactivity panel - chat related for retro compatibility
const INTERACTIVITY_PANEL_CLASS = ".interactivity-panel, .chat-container";
const TOGGLE_INTERACTIVITY_PANEL_BUTTON_ID = "#toggle-interactivity-panel, #toggle-chat";

// chat
const CHAT_CLASS = ".chat-container";
const CHAT_NOTIFICATION_BADGE_ID = "#chat-notification-badge";
const CHAT_TAB_ID = "#chat-button";

// slides
const TOGGLE_SLIDES_BUTTON_ID = "#toggle-slides";
const SLIDES_CONTAINER_CLASS = ".session-live-slides";

// focus-mode
const TOGGLE_FOCUS_BUTTON_ID = "#toggle-focus";
const TOGGLE_FOCUS_CLASS = "focus-mode";
const TOGGLE_FOCUS_TRANSITION_CLASS = "focus-in";

// screen sharing
const TOGGLE_SCREEN_SHARING_BUTTON_ID = "#toggle-screen-sharing";
const SCREEN_STREAM_CONTAINER_ID = "video-screen-sharing";
const SCREEN_SHARING_PLACEHOLDER_ID = "screen-sharing-placeholder";

// camera
const TOGGLE_CAMERA_BUTTON_ID = "#toggle-camera";

// start stop streaming
const TOGGLE_STREAMING_BUTTON_ID = "#toggle-streaming";
const TOGGLE_STREAMING_CLASS = ".toggle-streaming-group";
const TOGGLE_STREAMING_WHEN_BROADCAST_NOT_STARTED_CLASS = ".toggle-streaming-group-broadcast-not-started";
const TOGGLE_STREAMING_WHEN_BROADCAST_STARTED_CLASS = ".toggle-streaming-group-broadcast-started";
const STOP_STREAMING_BUTTON_CLASS = ".stop-streaming";

const SPEAKERS_PANEL_CLASS = ".speakers-panel";

// broadcasting
const START_BROADCAST_GROUP_CLASS = ".start-broadcast-group";
const START_BROADCAST_BUTTON_ID = "#start-broadcast";
const HLS_BROADCAST_DELAY_HIGH = 15; // seconds
const HLS_BROADCAST_DELAY_LOW = 8; // seconds
const HLS_BROADCAST_INDICATOR_CLASS = ".hls-live-broadcast-indicator";
const BROADCAST_VIDEO_ID = "#broadcast-video";
const BROADCAST_VIDEO_WRAPPER_CLASS = ".broadcast-video-wrapper";
const BROADCAST_VIDEO_CONTAINER_CLASS = ".broadcast-video-container";
const CONNECT_TO_OPENTOK_BUTTON_ID = "#connect-to-opentok";
const BROADCAST_VIDEO_MIN_WIDTH = 100;

// sesssion recording
const RECORDING_STARTED_MODAL_ID = "#session-recording-started-modal";
const RECORDING_IN_PROGRESS_CLASS = ".session-recording-in-progress";
const NOT_RECORDING_WARNING_CLASS = ".session-not-recording-warning";

class SessionLive {
  constructor($sectionSessionLive) {
    this.sessionLive = $sectionSessionLive;
    this.guestType = this.sessionLive.attr("data-guest-type");
    this.chatReceiverId = this.sessionLive.attr("data-chat-receiver-id");
    this.type = this.sessionLive.attr("data-live-session-type");
    this.useHdOnSession = this.sessionLive.attr("data-use-hd-on-opentok-session");

    this.guestIdentity = this.sessionLive.attr("data-guest-identity");
    this.guestCompanyName = this.sessionLive.attr("data-guest-company-name");
    this.guestId = this.sessionLive.attr("data-guest-id");
    this.presenterId = this.sessionLive.attr("data-presenter-id");
    this.archiveStreams = this.sessionLive.attr("data-archive-streams") === "true";
    this.locale = this.sessionLive.attr("data-locale");
    this.hlsBroadcastUrl = this.sessionLive.attr("data-hls-broadcast-url");

    this.displayName = this.guestIdentity.substring(0, 16);

    if (this.guestCompanyName && this.guestCompanyName.length > 0) {
      this.displayName += " - " + this.guestCompanyName.substring(0, 16);
    }

    // speakers related attributes
    this.publisher = null;
    this.isStreaming = false;
    this.screenPublisher = null;
    this.viewerConnectionCount = 0;
    this.otherSpeakers = {};
    this.guestIsPresenter = this.guestId && this.presenterId === this.guestId;
    this.cameraEnabled = true;
    this.recordingInProgress = false;
    this.startLiveBroadcastEndpoint = this.sessionLive.attr("data-start-live-broadcast-url");

    // viewers related fields
    this.speakerCount = 0;
    this.oneSpeakerIsSharingScreen = false;
    this.oneSpeakerIsPresenter = false;
    this.hlsPlayerInitialVideoElement = this.domElement(BROADCAST_VIDEO_ID).clone();

    // viewers and speakers related fields
    this.isShowingSlides = false;
    this.isInFocusMode = false;

    this.bindEvent();

    const apiKey = this.sessionLive.attr("data-opentok-api-key");
    const sessionId = this.sessionLive.attr("data-opentok-session-id");
    this.opentokToken = this.sessionLive.attr("data-session-opentok-token");

    this.session = OT.initSession(apiKey, sessionId);
    this.init();

    this.refreshLayout();
  }

  bindEvent() {
    const self = this;

    // speaker: toggle screen sharing
    this.sessionLive.on("click", TOGGLE_SCREEN_SHARING_BUTTON_ID, function() {
      self.screenPublisher ? self.stopSharingScreen() : self.shareScreen(function(err) {
        if (err) {
          if (err.name !== "OT_USER_MEDIA_ACCESS_DENIED") {
            self.handleErrorIfAny(err);
          }
          self.stopSharingScreen();
        }
        self.refreshLayout();
      });
    });

    // speaker: toggle streaming
    this.sessionLive.on("click", TOGGLE_STREAMING_BUTTON_ID, function() {
      self.isStreaming ? self.stopStreaming() : self.startStreaming();
    });

    // speaker: connect to opentok (broadcast mode)
    this.sessionLive.on("click", CONNECT_TO_OPENTOK_BUTTON_ID, function() {
      self.startStreaming(CONNECT_TO_OPENTOK_BUTTON_ID);
    });

    // toggle interactivity panel
    this.sessionLive.on("click", TOGGLE_INTERACTIVITY_PANEL_BUTTON_ID, function(e) {
      if (self.domElement(CHAT_CLASS).hasClass("active")) {
        self.hide(CHAT_NOTIFICATION_BADGE_ID);
      }
      self.domElement(INTERACTIVITY_PANEL_CLASS).toggleClass("display");
      self.sessionLive.toggleClass("messages-display");
      self.refreshLayout({
        timeout: 500 // must match with the CSS animation
      });
    });

    // chat tab
    this.sessionLive.on("click", CHAT_TAB_ID, function(e) {
      self.hide(CHAT_NOTIFICATION_BADGE_ID);
    });

    // toggle slides
    this.sessionLive.on("click", TOGGLE_SLIDES_BUTTON_ID, function() {
      self.isShowingSlides ? self.hideSlides() : self.showSlides();
    });

    // toggle focus mode
    this.sessionLive.on("click", TOGGLE_FOCUS_BUTTON_ID, function() {
      self.toggleFocus();
    });

    const chatRoot = $("[data-receiver-id=" + this.chatReceiverId + "]");
    chatRoot.on("message-received", function() {
      if (self.domElement(CHAT_CLASS).hasClass("active")) return;

      self.show(CHAT_NOTIFICATION_BADGE_ID);
    });

    // toggle camera
    this.sessionLive.on("click", TOGGLE_CAMERA_BUTTON_ID, function() {
      const nextState = self.cameraEnabled ? "off" : "on";
      self.changeBtnState(nextState, TOGGLE_CAMERA_BUTTON_ID);
      self.cameraEnabled = !self.cameraEnabled;
      self.publisher.publishVideo(self.cameraEnabled);
    });

    // handle resizing
    let resizeTimeout = null;
    window.onresize = function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        self.refreshLayout();
        self.resizeHlsPlayer();
      }, 20);
    };

    // start broadcast
    this.sessionLive.on("click", START_BROADCAST_BUTTON_ID, function() {
      self.startBroadcast(function() {
        self.refreshLayout();
      });
    });

    // unmute player autoplay
    this.sessionLive.on("click", ".vjs-big-unmute-button", function() {
      const player = self.hlsPlayer();
      player.muted(false);
      player.removeChild("BigUnmuteButton", {});
    });
  }

  // --------------------------------------------------------
  // speakers
  // --------------------------------------------------------

  initSpeaker(callback) {
    const self = this;
    const [containerId, options] = this.speakerPublisherOptions();
    this.publisher = OT.initPublisher(containerId, this.streamProperties(options), function(err) {
      if (err) {
        callback(err);
        return;
      }

      self.publisher.on("streamDestroyed", function(e) {
        self.alertPublisherNetworkLostIfNeeded(e);
        e.preventDefault(); // this keep the stream in the dom when unpublishing
        self.refreshLayout({ timeout: 200 });
      });

      self.listenForPersonTalking(self.publisher);
      self.attachSpeakerPermanentSessionEventListeners();

      self.refreshLayout();
      self.session.connect(self.opentokToken, callback);
    });
  }

  speakerPublisherOptions() {
    const options = {
      name: this.displayName,
      resolution: this.useHdOnSession === "true" ? "1280x720" : "640x480"
    };

    if (!this.guestIsPresenter) {
      return [CAMERA_STREAM_CONTAINER_ID, options];
    }

    // guest is presenter, his camera screen will be displayed in the container where
    // we usually display screen sharing
    return [SCREEN_STREAM_CONTAINER_ID, Object.assign({}, options, { fitMode: "contain" })];
  }

  ensureOtherSpeaker(connection) {
    if (this.otherSpeakers[connection.id]) {
      return this.otherSpeakers[connection.id];
    }

    const speakerData = this.opentokConnectionData(connection);
    const speaker = {
      id: speakerData.guest_id,
      identity: speakerData.guest_identity,
      isSharingScreen: false,
      isPresenter: speakerData.guest_id === this.presenterId
    };

    this.otherSpeakers[connection.id] = speaker;
    return speaker;
  }

  startStreaming(buttonId = TOGGLE_STREAMING_BUTTON_ID) {
    const self = this;

    if (this._startStreamingPending) return;

    this._startStreamingPending = true;
    this.changeBtnState("off", buttonId);
    this.reloadSession({ willStream: true }, function(err) {
      if (err) {
        self.handleErrorIfAny(err);
        self.changeBtnState("on", buttonId);
        self._startStreamingPending = false;
        return;
      }

      self.session.publish(self.publisher, function(err) {
        self.changeBtnState("on", buttonId);
        self._startStreamingPending = false;

        if (err) {
          self.handleErrorIfAny(err);
          return;
        }

        self.isStreaming = true;
        self.updateSpeakerInterface();
        self.refreshLayout();
      });
    });
  }

  stopStreaming() {
    this.isStreaming = false;

    this.session.unpublish(this.publisher);
    this.stopSharingScreen();

    if (this.stoppedStreamingHasLastSpeaker() && this.hlsBroadcastUrl) {
      // we are the only speaker and we leave the session. Opentok will send a webhook
      // and we will then send the broadcast_stopped signals. However, I'm alone here
      // and I may never receive the signal because my session will be reloaded and I
      // will be disconnected for a few moment. But we know it's safe to assume the
      // broadcast url is no longer needed
      // Note this situation may happens in a multi-speaker scenrio but is really unlikely
      this.hlsBroadcastUrl = null;
    }

    const self = this;
    this.reloadSession({ willStream: false }, function(err) {
      if (err) {
        self.handleErrorIfAny(err);
        return;
      }
    });
    this.recordingInProgress = false;
    this.otherSpeakers = {};
    this.viewerConnectionCount = 0;
    this.updateSpeakerInterface();
  }

  stoppedStreamingHasLastSpeaker() {
    return this.session.streams.length() === 1 && this.session.streams.map(s => s)[0].connection.id === this.session.connection.id;
  }

  reloadSession(opts, callback) {
    this.session.disconnect();

    // when we disconnect we need to wait for some Opentok events
    // before we ignore them totally
    const timeout = opts.willStream ? 0 : 500;

    const self = this;
    setTimeout(function() {
      if (opts.willStream) {
        self.attachSpeakerStreamingSessionEventListeners();
      } else {
        self.detachSpeakerStreamingSessionEventListeners();
      }
      self.session.connect(self.opentokToken, callback);
    }, timeout);
  }

  elementsVisibilityMapping() {
    if (this._elementsVisibilityMapping) {
      return this._elementsVisibilityMapping;
    }

    const self = this;

    this._elementsVisibilityMapping = {
      [TOGGLE_SCREEN_SHARING_BUTTON_ID]: function() {
        return self.isStreaming;
      },
      [STOP_STREAMING_BUTTON_CLASS]: function() {
        return self.isStreaming;
      },
      [VIEWERS_COUNT_DIV_CLASS]: function() {
        return self.isStreaming;
      },
      [TOGGLE_STREAMING_WHEN_BROADCAST_NOT_STARTED_CLASS]: function() {
        return !self.isStreaming && self.type === "hls_broadcast" && !self.hlsBroadcastUrl;
      },
      [TOGGLE_STREAMING_WHEN_BROADCAST_STARTED_CLASS]: function() {
        return !self.isStreaming && self.type === "hls_broadcast" && self.hlsBroadcastUrl;
      },
      [START_BROADCAST_GROUP_CLASS]: function() {
        return self.isStreaming && self.type === "hls_broadcast" && !self.hlsBroadcastUrl;
      },
      [INFORMATION_BAR_CLASS]: function() {
        return !self.isStreaming || (self.type === "hls_broadcast" && !self.hlsBroadcastUrl);
      },
      [HLS_BROADCAST_INDICATOR_CLASS]: function() {
        return self.isStreaming && self.hlsBroadcastUrl;
      },
      [NOT_RECORDING_WARNING_CLASS]: function() {
        return self.isStreaming && !self.recordingInProgress && self.archiveStreams;
      }
    }
    return this._elementsVisibilityMapping;
  }

  updateSpeakerInterface() {
    const self = this;
    Object.keys(this.elementsVisibilityMapping()).forEach(function(id) {
      const visible = self.elementsVisibilityMapping()[id]();
      visible ? self.show(id) : self.hide(id);
    });
  }

  // --------------------------------------------------------
  // speaker session events
  // --------------------------------------------------------

  // these events are the one we listen to **only** when a speaker is streaming
  attachSpeakerStreamingSessionEventListeners() {
    const self = this;

    this.session.on("connectionCreated", function(e) { self.speakerEventConnectionCreated(e) });
    this.session.on("connectionDestroyed", function(e) { self.speakerEventConnectionDestroyed(e) });
    this.session.on("streamCreated", function(e) { self.speakerEventStreamCreated(e) });
    this.session.on("streamDestroyed", function(e) { self.speakerEventStreamDestroyed(e) });
    this.session.on("archiveStarted", function() { self.speakerEventArchiveStarted() });
    this.session.on("archiveStopped", function() { self.speakerEventArchiveStopped() });
    this.session.on("sessionDisconnected", function(e) { self.speakerEventSessionDisconnected(e) });
  }

  detachSpeakerStreamingSessionEventListeners() {
    this.session.off([
      "connectionCreated",
      "connectionDestroyed",
      "streamCreated",
      "streamDestroyed",
      "archiveStarted",
      "archiveStopped",
      "sessionDisconnected"
    ]);
  }

  attachSpeakerPermanentSessionEventListeners() {
    const self = this;
    this.session.on("signal:broadcast_started", function(e) { self.speakerEventBroadcastStarted(e) });
    this.session.on("signal:broadcast_stopped", function(e) { self.speakerEventBroadcastStopped(e) });
  }

  // someone joined the session if it's a viewer, we increment the viewer counter
  speakerEventConnectionCreated(event) {
    this.updateViewerConnectionCounter(1, event.connection);
  }

  // someone left the session if it's a viewer, we decrement the viewer counter
  speakerEventConnectionDestroyed(event) {
    this.updateViewerConnectionCounter(-1, event.connection);
  }

  // a new stream is created in the session (new speaker or screen sharing)
  speakerEventStreamCreated(event) {
    const connection = event.stream.connection;
    const speaker = this.ensureOtherSpeaker(connection);
    this.updateSpeakersCounter();

    const self = this;
    this.subscribeToStream(event, function(err) {
      if (err) {
        self.handleErrorIfAny(err);
        return;
      }

      if (!self.isCameraStream(event)) {
        // screen sharing
        speaker.isSharingScreen = true;
        self.show(SCREEN_STREAM_CONTAINER_ID);
      }
      self.refreshLayout();
    });
  }

  // a stream is destroyed, either a speaker left the session of stopped screen sharing
  speakerEventStreamDestroyed(event) {
    const connection = event.stream.connection;
    if (this.isCameraStream(event)) {
      // an other speaker just left
      delete this.otherSpeakers[connection.id];
    } else {
      // an other speaker just stopped screen sharing
      const speaker = this.otherSpeakers[connection.id]
      if (speaker) {
        speaker.isSharingScreen = false;
      }
      this.hide(SCREEN_STREAM_CONTAINER_ID);
    }
    this.updateSpeakersCounter();
    this.refreshLayout({ timeout: 200 });
  }

  // an archive just started recording
  speakerEventArchiveStarted() {
    if (!this.archiveStreams || this.type === "hls_broadcast") {
      // in broadcast mode, the archive start recording with the broadcast, no need to warn speakers
      return;
    }

    this.recordingInProgress = true;
    this.show(RECORDING_IN_PROGRESS_CLASS);
    this.hide(NOT_RECORDING_WARNING_CLASS);

    const $modal = this.domElement(RECORDING_STARTED_MODAL_ID);
    if ($modal.length === 0) {
      // theme doesn't support this feature
      return;
    }

    $modal.modal();
    setTimeout(function() {
      $modal.modal("hide");
    }, 5000);

    $modal.on("click", ".close", function() {
      $modal.modal("hide");
    });
  }

  // an archive stopped recording
  speakerEventArchiveStopped() {
    this.recordingInProgress = false;
    this.hide(RECORDING_IN_PROGRESS_CLASS);
    this.show(NOT_RECORDING_WARNING_CLASS);
  }

  speakerEventSessionDisconnected(event) {
    if (event.reason === "networkDisconnected") {
      // try to reconnect
      this.stopStreaming();
      this.startStreaming();
    }
  }

  speakerEventBroadcastStarted(event) {
    const data = JSON.parse(event.data);
    this.hlsBroadcastUrl = data.hls_broadcast_url;
    this.updateSpeakerInterface();
    this.refreshLayout();
  }

  speakerEventBroadcastStopped() {
    this.hlsBroadcastUrl = null;
    this.updateSpeakerInterface();
    this.refreshLayout();
  }

  startBroadcast(callback) {
    const self = this;

    this.changeBtnState("off", START_BROADCAST_BUTTON_ID);
    $.ajax({
      url: this.startLiveBroadcastEndpoint ,
      type: "put",
      dataType: "json",
      success: function() {
        self.changeBtnState("on", START_BROADCAST_BUTTON_ID);
        callback();
      },
      error: function(err) {
        alert(err.responseText);
        self.changeBtnState("on", START_BROADCAST_BUTTON_ID);
      }
    });
  }

  shareScreen(callback) {
    if (this.screenPublisher) {
      callback();
      return;
    }

    if (!this.isStreaming) {
      callback("Can't start screen sharing before streaming has started");
      return;
    }

    const self = this;

    OT.checkScreenSharingCapability(function(response) {
      if (!response.supported || response.extensionRegistered === false) {
        callback("Screen sharing not supported");
        return;
      }

      const otherSpeakerSharingScreen = self.otherSpeakerSharingScreen();
      if (otherSpeakerSharingScreen) {
        alert("You can't share your screen bacause another speaker is already sharing their screen");
        return;
      }

      const options = {
        videoSource: "screen",
        name: self.displayName,
        frameRate: 15
      };
      const properties = self.streamProperties(options);
      const div = document.createElement('div');
      self.screenPublisher = OT.initPublisher(div, properties, function(err) {
        if (err) {
          callback(err);
          return;
        }
        self.session.publish(self.screenPublisher, function(err) {
          if (err) {
            callback(err);
            return;
          }

          self.changeBtnState("on", TOGGLE_SCREEN_SHARING_BUTTON_ID, true);
          self.show([SCREEN_STREAM_CONTAINER_ID, SCREEN_SHARING_PLACEHOLDER_ID]);
          self.hideSlides();
          callback();
        });
      });

      self.screenPublisher.on("streamDestroyed", function(e) {
        self.alertPublisherNetworkLostIfNeeded(e);
        self.stopSharingScreen();
      });
    });
  }

  stopSharingScreen() {
    if (!this.screenPublisher) {
      return;
    }
    this.screenPublisher.destroy();
    this.screenPublisher = null;
    this.changeBtnState("off", TOGGLE_SCREEN_SHARING_BUTTON_ID, true);
    this.hide([SCREEN_STREAM_CONTAINER_ID, SCREEN_SHARING_PLACEHOLDER_ID]);
    this.refreshLayout();
  }

  updateViewerConnectionCounter(change, opentokConnection) {
    const data = this.opentokConnectionData(opentokConnection);
    if (data.role !== VIEWER) {
      return;
    }
    this.viewerConnectionCount += change;
    this.domElement(VIEWERS_COUNT_CLASS).text(this.viewerConnectionCount);
  }

  updateSpeakersCounter() {
    if (this.type !== "meeting") {
      return;
    }

    this.domElement(VIEWERS_COUNT_CLASS).text(Object.keys(this.otherSpeakers).length + 1);
  }

  // --------------------------------------------------------
  // viewers
  // --------------------------------------------------------

  initViewer(callback) {
    if (this.type === "hls_broadcast") {
      // not using webrtc here, only broadcast
      this.listenForBroadcastSignals();
      if (this.hlsBroadcastUrl) this.loadHlsBroadcast();
    } else if (this.type === "streaming") {
      this.loadHlsBroadcast();
      return; // streaming type do not use opentok
    } else {
      this.listenForSpeakersJoining();
      this.listenForSpeakersLeaving();
    }
    this.session.connect(this.opentokToken, callback);
  }

  listenForSpeakersJoining() {
    const self = this;

    this.session.on("streamCreated", function(event) {
      self.subscribeToStream(event, function(err) {
        if (err) {
          self.handleErrorIfAny(err);
          return;
        }
        if (self.isCameraStream(event)) {
          self.speakerJoined(event);
        } else {
          self.speakerStartsScreenSharing();
        }
      });
    });
  }

  listenForSpeakersLeaving() {
    const self = this;

    this.session.on("streamDestroyed", function(event) {
      if (self.isCameraStream(event)) {
        self.speakerLeft(event);
      } else {
        self.speakerStoppedScreenSharing();
      }
    });
  }

  listenForBroadcastSignals() {
    const self = this;

    this.session.on("signal:broadcast_started", function(event) {
      const data = JSON.parse(event.data);
      self.viewerEventBroadcastStarted(data.hls_broadcast_url);
    });

    this.session.on("signal:broadcast_stopped", function() {
      self.viewerEventBroadcastStopped();
    });
  }

  speakerJoined(event) {
    this.speakerCount += 1;
    this.updateViewerInterfaceStreamHappening();

    if (this.presenterId && this.streamIsPresenter(event.stream.connection)) {
      this.oneSpeakerIsPresenter = true;
    }
    this.refreshLayout();
  }

  speakerLeft(event) {
    this.speakerCount -= 1;
    if (this.presenterId && this.streamIsPresenter(event.stream.connection)) {
      this.oneSpeakerIsPresenter = false;
    }
    this.refreshLayout({ timeout: 200 });
    if (this.speakerCount > 0) {
      return;
    }
    this.updateViewerInterfaceNothingHappening()
  }

  speakerStartsScreenSharing() {
    this.oneSpeakerIsSharingScreen = true;
    this.refreshLayout();
    this.show(SCREEN_STREAM_CONTAINER_ID);
    this.hideSlides(); // force screen to appear, man can display slides again after
  }

  speakerStoppedScreenSharing() {
    this.oneSpeakerIsSharingScreen = false;
    this.refreshLayout();
    this.hide(SCREEN_STREAM_CONTAINER_ID);
  }

  viewerEventBroadcastStarted(hlsBroadcastUrl) {
    this.hlsBroadcastUrl = hlsBroadcastUrl;
    clearTimeout(this._startBroadcastTimeout);
    clearTimeout(this._stopBroadcastTimeout);

    const self = this;
    this._startBroadcastTimeout = setTimeout(function() {
      self.loadHlsBroadcast();
    }, HLS_BROADCAST_DELAY_LOW * 1000);
  }

  viewerEventBroadcastStopped() {
    this.hlsBroadcastUrl = null;
    clearTimeout(this._startBroadcastTimeout);
    clearTimeout(this._stopBroadcastTimeout);

    const self = this;
    this._stopBroadcastTimeout = setTimeout(function() {
      self.updateViewerInterfaceNothingHappening();
      const player = self.hlsPlayer();
      player.pause();
      if (player.isFullscreen) player.exitFullscreen();
    }, HLS_BROADCAST_DELAY_HIGH * 1000);
  }

  updateViewerInterfaceStreamHappening() {
    this.hide([MSG_WAITING_SPEAKER_CLASS, MSG_SPEAKER_LEFT_CLASS, INFORMATION_BAR_CLASS]);
    this.show(BROADCAST_VIDEO_WRAPPER_CLASS);
  }

  updateViewerInterfaceNothingHappening() {
    this.hide([SCREEN_STREAM_CONTAINER_ID, BROADCAST_VIDEO_WRAPPER_CLASS]);
    this.show([MSG_SPEAKER_LEFT_CLASS, INFORMATION_BAR_CLASS]);
  }

  loadHlsBroadcast() {
    const player = this.hlsPlayer();
    player.src({
      type: "application/x-mpegurl",
      src: this.hlsBroadcastUrl
    });
    this.startHlsPlayerHealthCheck();
  }

  hlsPlayer() {
    if (this._hlsPlayer) return this._hlsPlayer;

    const options = {
      autoplay: "any",
      preload: "auto",
      language: this.locale,
      controls: true,
      fluid: true,
      aspectRatio: this.useHdOnSession ? "16:9" : "4:3"
    };

    this._hlsPlayer = videojs(BROADCAST_VIDEO_ID, options);
    this.registerUnmuteButtonComponent(this._hlsPlayer);
    this.attachHlsPlayerEvents(this._hlsPlayer);
    return this._hlsPlayer;
  }

  waitAndReloadHlsPlayer() {
    clearTimeout(this._reloadHlsPlayerTimeout);
    this.resetHlsPlayer();

    const self = this;
    this._reloadHlsPlayerTimeout = setTimeout(function() {
      self.loadHlsBroadcast();
    }, 5000);
  }

  startHlsPlayerHealthCheck() {
    if (this._hlsPlayerHealthCheckRunning) return;

    this._hlsPlayerHealthCheckRunning = true;
    this.hlsPlayerHealthCheck();
  }

  hlsPlayerNextHealthCheck() {
    const self = this;
    setTimeout(function() {
      self.hlsPlayerHealthCheck();
    }, 2000);
  }

  hlsPlayerHealthCheck() {
    if (this._hlsPlayer) {
      const self = this;
      this.handleHlsPlayerState(this._hlsPlayer.readyState(), function() {
        self.hlsPlayerNextHealthCheck();
      });
      return;
    }

    this.hlsPlayerNextHealthCheck();
  }

  isHlsBroadcastUrlUp(callback) {
    // we try to download the manifest and check if it's still up
    // we have to do this as some RTMP provider do not close the
    // hls properly and the player "ended" event is never triggered
    $.ajax({
      url: this.hlsBroadcastUrl,
      type: "get",
      success: function() {
        callback(true);
      },
      error: function() {
        callback(false);
      }
    });
  }

  handleHlsPlayerState(state, callback) {
    // https://docs.videojs.com/docs/api/player.html#MethodsreadyState
    const self = this;
    switch (state) {
    case 1:
    case 2:
    case 3:
      this.isHlsBroadcastUrlUp(function(up) {
        if (!up) {
          console.log("killing");
          self.hlsBroadcastEnded();
        }
        callback();
      });
      break;
    default:
      callback();
    }
  }

  attachHlsPlayerEvents(player) {
    const self = this;

    player.ready(function() {
      player.play();
    });

    player.on("play", function() {
      if (player.muted()) {
        player.addChild("BigUnmuteButton", {});
      }
    });

    player.on("pause", function() {
      player.removeChild("BigUnmuteButton", {});
    });

    player.on("ended", function() {
      console.log("player ended");
      self.hlsBroadcastEnded();
    });

    player.on("loadedmetadata", function() {
      self.hlsBroadcastStarted();
    });

    player.on("error", function() {
      const err = player.error();
      if (err.code === 4 || err.code === 2) {
        self.hlsBroadcastFailedToLoadBecauseNotReadyYet();
      }
    });
  }

  hlsBroadcastStarted() {
    this.updateViewerInterfaceStreamHappening();
    this.resizeHlsPlayer();
  }

  hlsBroadcastEnded() {
    // try to reload in case it was temporary
    this.waitAndReloadHlsPlayer();
    this.updateViewerInterfaceNothingHappening();
  }

  hlsBroadcastFailedToLoadBecauseNotReadyYet() {
    // try again in 5 seconds
    clearTimeout(this._retryLoadHlsBroadcast);

    const self = this;
    this._retryLoadHlsBroadcast = setTimeout(function() {
      self.loadHlsBroadcast();
    }, 5000);
  }

  resetHlsPlayer() {
    if (!this._hlsPlayer) return;

    this._hlsPlayer.off();
    this._hlsPlayer.dispose(); // this will remove the element from the dom

    const tech = this._hlsPlayer.tech();
    tech.off();
    tech.dispose();

    this._hlsPlayer = null;

    const elem = this.hlsPlayerInitialVideoElement.prop("outerHTML");
    this.domElement(BROADCAST_VIDEO_CONTAINER_CLASS).html(elem);
  }

  registerUnmuteButtonComponent() {
    const Component = videojs.getComponent("Component");
    const BigUnmuteButton = videojs.extend(Component, {
      constructor: function(player, options) {
        Component.apply(this, arguments);
        this.setup();
      },

      createEl: function() {
        return videojs.dom.createEl("button", {
          className: "vjs-big-unmute-button"
        });
      },

      setup: function() {
        const icon = videojs.dom.createEl("i", {
          className: "vjs-icon-volume-mute"
        });
        videojs.dom.appendContent(this.el(), icon);
      }
    });

    videojs.registerComponent("BigUnmuteButton", BigUnmuteButton);
  }

  resizeHlsPlayer() {
    if (!this._hlsPlayer) return;

    const wrapper = this.domElement(BROADCAST_VIDEO_WRAPPER_CLASS);
    const container = this.domElement(BROADCAST_VIDEO_CONTAINER_CLASS);

    const ratio = wrapper.height() / container.height();
    let width = container.width() * ratio;
    const maxWidth = this.useHdOnSession ? 1280 : 640;

    if (width > maxWidth) width = maxWidth
    else if (width < BROADCAST_VIDEO_MIN_WIDTH) width = BROADCAST_VIDEO_MIN_WIDTH

    container.width(width);
  }

  // --------------------------------------------------------
  // speakers and viewers
  // --------------------------------------------------------

  refreshLayout(opts = { timeout: null }) {
    const refresh = function(self) {
      if (self.speakersPanelUsed()) {
        self.show(SPEAKERS_PANEL_CLASS);
      } else {
        self.hide(SPEAKERS_PANEL_CLASS);
      }

      if (self.mainPanelUsed()) {
        self.domElement(CENTRAL_PANEL_CLASS).removeClass("main-panel-unused");
        self.speakerPanelContentOptimalHeight();
        self.opentokLayout("start").layout();
      } else {
        self.domElement(CENTRAL_PANEL_CLASS).addClass("main-panel-unused");
        self.speakerPanelContentOptimalHeight();
        self.opentokLayout("center").layout();
      }

      if (self.someoneIsPresenter()) {
        self.show(SCREEN_STREAM_CONTAINER_ID);
      }
    };

    if (!opts.timeout) {
      refresh(this);
      return;
    }

    const self = this;
    setTimeout(function() {
      refresh(self);
    }, opts.timeout);
  }

  listenForPersonTalking(subscriberOrPublisher) {
    let activity = null;
    subscriberOrPublisher.on("audioLevelUpdated", function(event) {
      const now = Date.now();
      const element = event.target.element;
      if (event.audioLevel > 0.2) {
        if (!activity) {
          activity = { timestamp: now, talking: false, initialBorderStyle: getComputedStyle(element).border };
        } else if (activity.talking) {
          activity.timestamp = now;
        } else if (now - activity.timestamp > 500) {
          // detected audio activity for more than 0.5s
          // for the first time.
          activity.talking = true;
          element.style.border = "3px solid green";
        }
      } else if (activity && now - activity.timestamp > 2000) {
        // detected low audio activity for more than 2s
        if (activity.talking) {
          element.style.border = activity.initialBorderStyle;
        }
        activity = null;
      }
    });
  }

  mainPanelUsed() {
    if (this.isShowingSlides) {
      return true;
    }

    if (this.someoneIsPresenter()) {
      return true;
    }

    if (this.guestType === SPEAKER) {
      return this.otherSpeakerSharingScreen() || this.screenPublisher;
    }

    return this.oneSpeakerIsSharingScreen;
  }

  speakersPanelUsed() {
    if (!this.presenterId) {
      return true;
    }

    // when we have a presenter, the speaker panel is not used when only one
    // speaker is presenting
    if (this.speakerCount > 1 || Object.keys(this.otherSpeakers).length > 0) {
      return true;
    }

    return !this.someoneIsPresenter();
  }

  init() {
    const self = this;

    if (this.guestType === SPEAKER) {
      self.show(INITIALIZING_SPEAKER_LOADER_CLASS);
      this.initSpeaker(function(err) {
        self.hide(INITIALIZING_SPEAKER_LOADER_CLASS);
        if (!err) {
          if (self.type === "hls_broadcast") {
            const classToShow = self.hlsBroadcastUrl ? TOGGLE_STREAMING_WHEN_BROADCAST_STARTED_CLASS : TOGGLE_STREAMING_WHEN_BROADCAST_NOT_STARTED_CLASS;
            self.show(classToShow);
          } else {
            self.show(TOGGLE_STREAMING_CLASS);
          }
          return;
        }
        if (err.name === "OT_USER_MEDIA_ACCESS_DENIED") {
          self.show(CAM_ACCESS_DENIED_CLASS);
          return;
        }
        self.handleErrorIfAny(err);
      });
    } else {
      this.initViewer(this.handleErrorIfAny);
    }
  }

  showSlides() {
    this.isShowingSlides = true;
    this.refreshLayout();
    this.changeBtnState("on", TOGGLE_SLIDES_BUTTON_ID);
    this.show(SLIDES_CONTAINER_CLASS);
  }

  hideSlides() {
    this.isShowingSlides = false;
    this.refreshLayout();
    this.changeBtnState("off", TOGGLE_SLIDES_BUTTON_ID);
    this.hide(SLIDES_CONTAINER_CLASS);
  }

  toggleFocus() {
    this.isInFocusMode = !this.isInFocusMode;
    this.sessionLive.toggleClass(TOGGLE_FOCUS_CLASS);
    this.sessionLive.addClass(TOGGLE_FOCUS_TRANSITION_CLASS);
    this.refreshLayout({
        timeout: 500 // must match with the CSS animation
    });
    const btnState = this.isInFocusMode ? "on" : "off";
    this.changeBtnState(btnState, TOGGLE_FOCUS_BUTTON_ID);
    /* And remove overriding z-index class after 500ms if it in case of unfocus */
    if (!this.isInFocusMode) {
      this.sessionLive.delay(500).queue(function(next){
        $(this).removeClass(TOGGLE_FOCUS_TRANSITION_CLASS);
        next();
      });
    }
  }

  // --------------------------------------------------------
  // utilities
  // --------------------------------------------------------

  handleErrorIfAny(err) {
    if (!err) {
      return;
    }
    const errMsg = this.isString(err) ? err : this.opentokErrorToString(err);
    alert(errMsg);
  }

  alertPublisherNetworkLostIfNeeded(event) {
    if (event.reason === "networkDisconnected") {
      alert("Network disonnected. Please check your internet connection and try again.");
    }
  }

  isString(data) {
    return typeof data === "string" || data instanceof String;
  }

  opentokErrorToString(err) {
    return "[" + err.name + "] " + err.message;
  }

  // these are passed from ruby in the opentok token generation
  opentokConnectionData(connection) {
    return JSON.parse(connection.data);
  }

  otherSpeakerSharingScreen() {
    return Object.values(this.otherSpeakers).find(v => v.isSharingScreen);
  }

  otherSpeakerIsPresenter() {
    return Object.values(this.otherSpeakers).find(v => v.isPresenter);
  }

  numberOfCameraStreams() {
    return this.guestType === SPEAKER ? Object.keys(this.otherSpeakers).length + 1 : this.speakerCount;
  }

  speakerPanelContentOptimalHeight() {
    // compute the height of the content of the speaker panel, knowing that we want to keep
    // video in a div at least STREAM_MIN_WIDTH x STREAM_MIN_HEIGHT
    const content = this.domElement(CAMERA_STREAM_CONTAINER_ID);

    // reset to default height
    content.height("100%");

    const maxPerLine = Math.floor(content.width() / STREAM_MIN_WIDTH);
    const maxNbLines = Math.ceil(this.numberOfCameraStreams() / maxPerLine);
    const minHeight = maxNbLines * STREAM_MIN_HEIGHT;
    const height = Math.max(minHeight, content.height());
    content.height(height);
  }

  domElement(classOrId) {
    const char = classOrId.charAt(0);
    if (char !== "." && char !== "#") {
      classOrId = "#" + classOrId;
    }
    return this.sessionLive.find(classOrId);
  }

  iterateOnDomElements(classOrIds, fn) {
    if (this.isString(classOrIds)) {
      classOrIds = [classOrIds];
    }
    const self = this;
    classOrIds.forEach(function(id) {
      fn(self.domElement(id));
    });
  }

  hide(classOrIds) {
    this.iterateOnDomElements(classOrIds, function(e) {
      e.hide();
    });
  }

  show(classOrIds) {
    this.iterateOnDomElements(classOrIds, function(e) {
      e.show();
    });
  }

  changeBtnState(state, classOrIds, withEnableClass = false) {
    this.iterateOnDomElements(classOrIds, function(e) {
      if (state === "on") {
        e.find(".on").hide();
        e.find(".off").show();
        if (withEnableClass) {
          e.addClass("enabled");
        }
      }  else {
        e.find(".on").show();
        e.find(".off").hide();
        if (withEnableClass) {
          e.removeClass("enabled");
        }
      }
    });
  }

  streamProperties(opts = {}) {
    return Object.assign({
      insertMode: "append",
      width: "100%",
      height: "100%",
      style: {
        archiveStatusDisplayMode: "off"
      }
    }, opts);
  }

  subscribeToStream(event, callback) {
    const connection = event.stream.connection;
    const elementId = this.isCameraStream(event) && !this.streamIsPresenter(connection) ? CAMERA_STREAM_CONTAINER_ID : SCREEN_STREAM_CONTAINER_ID;
    const subscriber = this.session.subscribe(event.stream, elementId, this.streamProperties(), callback);
    if (this.isCameraStream(event)) {
      this.listenForPersonTalking(subscriber);
    }
    return subscriber;
  }

  isCameraStream(event) {
    return event.stream.videoType !== VIDEO_TYPE_SCREEN;
  }

  opentokLayout(alignItems) {
    // initLayoutContainer is provided by https://github.com/aullman/opentok-layout-js,
    // imported in main.js

    if (this._opentokLayout && this._opentokLayoutAlignItems === alignItems) {
      return this._opentokLayout;
    }

    const opts = {
      alignItems: alignItems,
      fixedRatio: true,
      maxRatio: 4/3
    };

    this._opentokLayout = initLayoutContainer(document.getElementById(CAMERA_STREAM_CONTAINER_ID), opts);
    this._opentokLayoutAlignItems = alignItems;
    return this._opentokLayout;
  }

  streamIsPresenter(connection) {
    if (!connection) {
      return false;
    }

    const speakerData = this.opentokConnectionData(connection);
    return speakerData.guest_id === this.presenterId;
  }

  someoneIsPresenter() {
    if (!this.presenterId) {
      return false;
    }

    if (this.guestType === VIEWER) {
      return this.oneSpeakerIsPresenter;
    }
    return this.guestIsPresenter || this.otherSpeakerIsPresenter();
  }
}
