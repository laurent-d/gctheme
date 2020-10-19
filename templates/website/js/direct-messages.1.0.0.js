/**
 * DirectMessages class
 *
 * Created       : 2020-07-29 by @davidHuveau
 * Last modified :
 *
 */

 // modal
const VIDEO_CALL_MODAL_ID = "#video-call-modal";

// camera container
const CAMERA_CALL_CONTAINER_ID = "camera-call-container";
const CAMERA_VIDEO_CALL_CONTAINER_ID = "camera-video-call-container";

// information
const INFORMATION_BAR_CLASS = ".information-bar";
const WAITING_CONTACT_CLASS = ".waiting-contact";
const CAM_ACCESS_DENIED_CLASS = ".camera-acccess-denied";

// start stop call
const STOP_CALL_BUTTON_CLASS = ".leave-call";

// camera
const TOGGLE_CAMERA_BUTTON_ID = "#toggle-camera";

// call status
const CALL_STATUS_INIT = "INIT";
const CALL_STATUS_RINGING = "RINGING";
const CALL_STATUS_JOINED = "JOINED";
const CALL_STATUS_FINISHED = "FINISHED";

class DirectMessages {
  constructor($directMessages) {
    this.directMessages = $directMessages;
    this.apiKey = this.directMessages.attr("data-opentok-api-key");

    this.guestId = this.directMessages.attr("data-guest-id");
    this.guestCompanyName = this.directMessages.attr("data-guest-company-name");
    this.displayName = this.directMessages.attr("data-guest-identity");

    if (this.guestCompanyName && this.guestCompanyName.length > 0) {
      this.displayName += " - " + this.guestCompanyName;
    }

    this.opentokSessionId = null;
    this.opentokToken = null;

    this.session = null;
    this.publisher = null;
    this.callStatus = CALL_STATUS_INIT;
    this.cameraEnabled = true;
    this.participantCount = 0;
    this.joinCallAllowed = true;

    this.bindEvent();
  }

  bindEvent() {
    const self = this;

    this.directMessages.on("call-to-action-clicked", function(e, callToAction) {
      const callToActionData = self.parseCallToAction(callToAction);
      if (!self.isEmpty(callToActionData)) {
        self.opentokSessionId = callToActionData.opentok_session_id;
        self.opentokToken = callToActionData.guests_opentok_token_mapping[self.guestId];

        self.init();
        self.displayModal();
      }
    });

    // participant: toggle call
    this.directMessages.on("click", STOP_CALL_BUTTON_CLASS, function() {
      self.closeModal();
    });

    // toggle camera
    this.directMessages.on("click", TOGGLE_CAMERA_BUTTON_ID, function() {
      if (self.publisher != null){
        const nextState = self.cameraEnabled ? "off" : "on";
        self.changeBtnState(nextState, TOGGLE_CAMERA_BUTTON_ID);
        self.cameraEnabled = !self.cameraEnabled;
        self.publisher.publishVideo(self.cameraEnabled);
      }
    });

    // modal closed
    this.domElement(VIDEO_CALL_MODAL_ID).on("click", ".close", function() {
      self.leaveCall();
    });
  }

  parseCallToAction(callToAction) {
    const hostAndPathname = callToAction.split("/?")[0];
    const callToActionSplitted = hostAndPathname.split("/");
    const protocol = callToActionSplitted[0];

    if (protocol !== "io.eventmaker:") {
      return {};
    }

    // callToAction example:
    // messages/5f2041e73d422f60759f6d4e/session/2_MX40Njg1OTc3NH5-MTU5NTk0OTU0MzkzNX5YRDFXTmFWem93RVFwYW51MHlkdHZoYUh-UH4/
    const data = {};
    data["message_id"] = callToActionSplitted[3];
    data["opentok_session_id"] = callToActionSplitted[5];
    data["guests_opentok_token_mapping"] = {};
    for (let param of new URL(callToAction).searchParams) {
      const guestId = param[0].split("_")[0];
      data["guests_opentok_token_mapping"][guestId] = param[1];
    }
    return data;
  }

  displayModal() {
    const $modal = this.domElement(VIDEO_CALL_MODAL_ID);
    $modal.modal({ backdrop: "static", keyboard: false });
  }

  closeModal() {
    this.leaveCall();

    const $modal = this.domElement(VIDEO_CALL_MODAL_ID);
    $modal.modal("hide");
  }

  init() {
    this.callStatus = CALL_STATUS_INIT;
    this.refreshLayout();

    this.session = OT.initSession(this.apiKey, this.opentokSessionId);

    const self = this;
    this.initCall(function(err) {
      if (!err) {
        self.joinCall();
        return;
      }
      if (err.name === "OT_USER_MEDIA_ACCESS_DENIED") {
        self.show(CAM_ACCESS_DENIED_CLASS);
        return;
      }
      self.handleErrorIfAny(err);
    });
  }

  initCall(callback) {
    const self = this;
    const options = {
      name: this.displayName,
      resolution: "640x480"
    };

    this.publisher = OT.initPublisher(CAMERA_CALL_CONTAINER_ID, this.callProperties(options), function(err) {
      if (err) {
        callback(err);
        return;
      }

      self.publisher.on("streamDestroyed", function(e) {
        self.alertPublisherNetworkLostIfNeeded(e);
        e.preventDefault(); // this keep the call in the dom when unpublishing
      });

      self.listenForOtherParticipantsJoining();
      self.listenForOtherParticipantsLeaving();
      self.listenForNetworkDisconnect();
      self.listenForVideoCallSignals();
      callback();
    });
  }

  listenForOtherParticipantsJoining() {
    const self = this;

    this.session.on("streamCreated", function(event) {
      self.participantCount++;
      console.log("participant joining");
      self.subscribeToCall(event, function(err) {
        console.log("subribed with err", err);
        if (err) {
          self.handleErrorIfAny(err);
          return;
        }
        self.callStatus = CALL_STATUS_JOINED;
        self.refreshLayout();
      });
    });
  }

  listenForOtherParticipantsLeaving() {
    const self = this;

    this.session.on("streamDestroyed", function(event) {
      self.participantCount--;
      self.refreshLayout();
    });
  }

  listenForNetworkDisconnect() {
    const self = this;

    this.session.on("sessionDisconnected", function(event) {
      if (event.reason === "networkDisconnected") {
        // try to reconnect
        self.leaveCall();
        self.joinCall();
      }
    });
  }

  listenForVideoCallSignals() {
    const self = this;
    this.session.on("signal:video_call_finished", function() {
      self.closeModal();
    });
  }

  callProperties(opts = {}) {
    return Object.assign({
        insertMode: "append",
        width: "100%",
        height: "100%"
      }, opts);
  }

  subscribeToCall(event, callback) {
    console.log("in subscribe");
    this.session.subscribe(event.stream, CAMERA_VIDEO_CALL_CONTAINER_ID, this.callProperties(), callback);
  }

  joinCall() {
    const self = this;

    if (!this.joinCallAllowed) return;
    this.joinCallAllowed = false;

    this.connectAndPublish(function(err) {
      if (err) {
        self.joinCallAllowed = true;
        self.handleErrorIfAny(err);
        return;
      }
      self.callStatus = CALL_STATUS_RINGING;
      self.refreshLayout();
    });
  }

  connectAndPublish(callback) {
    const self = this;

    this.session.connect(this.opentokToken, function(err) {
      if (err) {
        callback(err);
        return;
      }
      self.session.publish(self.publisher, callback);
    });
  }

  leaveCall() {
    this.joinCallAllowed = true;

    if (this.callStatus == CALL_STATUS_JOINED) {
      this.session.unpublish(this.publisher);
    }

    if (this.session != null) {
      this.session.disconnect();
    }

    if (this.publisher != null) {
      // deletes the Publisher object and removes it from the HTML DOM.
      this.publisher.destroy();
    }

    this.callStatus = CALL_STATUS_FINISHED;
    this.participantCount = 0;

    this.refreshLayout();
  }

  refreshLayout() {
    if (this.callStatus != CALL_STATUS_FINISHED) {
      this.show([TOGGLE_CAMERA_BUTTON_ID, STOP_CALL_BUTTON_CLASS, INFORMATION_BAR_CLASS, WAITING_CONTACT_CLASS]);
      if (this.participantCount > 0) {
        this.hide([INFORMATION_BAR_CLASS, WAITING_CONTACT_CLASS]);
      }
    } else {
      this.show(INFORMATION_BAR_CLASS);
      this.hide([TOGGLE_CAMERA_BUTTON_ID, STOP_CALL_BUTTON_CLASS, WAITING_CONTACT_CLASS]);
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

  domElement(classOrId) {
    const char = classOrId.charAt(0);
    if (char !== "." && char !== "#") {
      classOrId = "#" + classOrId;
    }
    return this.directMessages.find(classOrId);
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
        if (e.data("title-off")) {
          e.attr('data-original-title', e.data("title-off")).tooltip('show');
        }
      } else {
        e.find(".on").show();
        e.find(".off").hide();
        if (withEnableClass) {
          e.removeClass("enabled");
        }
        if (e.data("title-on")) {
          e.attr('data-original-title', e.data("title-on")).tooltip('show');
        }
      }
    });
  }

  // these are passed from ruby in the opentok token generation
  opentokConnectionData(connection) {
    return JSON.parse(connection.data);
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
}
