/*
 * Copyright (c) 2019
 *
 * Methods:
 *   - datetimeOverlapse
 *   - handleOverlapse
 *   - handleDisabledAttrSession
 *   - getSessionInfo
 *   - getRegisteredSessions
 *
 * Created       : 2019-10-17 by @opheJansen
 * Last modified : 2020-07-10 by @opheJansen
*/

function datetimeOverlapse() {
  var registeredSessions = [];
  var allDates = [];

  $('[data-datetime-overlapse="true"]').each(function() {
    const currentDate = $(this).attr('data-date');

    if (allDates.indexOf(currentDate) === -1) {
      allDates.push(currentDate);
    }
  });

  allDates.forEach(function(date, i) {
    registeredSessions[date.toString()] = getRegisteredSessions(date);
  });  
  
  $(".accesspoint-register").closest('[data-datetime-overlapse="true"]').each(function () {
    var currentSession = getSessionInfo($(this));

    if (registeredSessions[currentSession.date.toString()].length > 0) {
      var registeredSessionsByDate = registeredSessions[currentSession.date.toString()];

      registeredSessionsByDate.each(function (i, session) {
        handleOverlapse(registeredSessionsByDate, currentSession, session);
      });
    } else {
      $(this).find('.btn-datetime-overlapse').removeAttr('disabled');
    }
  });
}

function handleOverlapse(registeredSessionsByDate, unregisteredSession, registeredSession) {
  if (!(registeredSession.endTime <= unregisteredSession.startTime || registeredSession.startTime >= unregisteredSession.endTime)) {
    handleDisabledAttrSession(unregisteredSession, true);
  } else {
    handleDisabledAttrSession(unregisteredSession, false);
    registeredSessionsByDate.each(function (i, session) {
      if (!(session.endTime <= unregisteredSession.startTime || session.startTime >= unregisteredSession.endTime)) {
        handleDisabledAttrSession(unregisteredSession, true);
        return false;
      }
    });
  }
}

function handleDisabledAttrSession(session, disabled) {
  var $button = session.elem.find('.btn-datetime-overlapse'),
      $tooltipElement = $button.closest('[data-title]');

  if (disabled) {
    $button.attr('disabled', '');
    $tooltipElement.attr('data-toggle', 'tooltip');
  } else {
    $button.removeAttr('disabled');
    $tooltipElement.removeAttr('data-toggle');
  }
}

function getSessionInfo($session) {
  var date = $session.attr('data-date');
  var startTime = $session.attr('data-start-time');
  var endTime = $session.attr('data-end-time');

  return {
    "elem": $session,
    "date": date,
    "startTime": startTime,
    "endTime": endTime
  }
}

function getRegisteredSessions(date) {
  return $(".accesspoint-unregister, .accesspoint-registered").closest('[data-datetime-overlapse="true"][data-date=' + date + ']').map(function () {
    return getSessionInfo($(this));
  });
}