import axios from 'axios';
import { isbot } from 'isbot';
import { getCurrentInstance, watchEffect } from 'vue';

export function useLogEvent() {
  const instance = getCurrentInstance();
  const $root = instance.proxy.$root;

  const logEvent = (actionType, objectUri, session) => {
    // if feature is not enabled, or running on server-side, or user agent is a
    // bot, don't log
    if (!$root.$features?.eventLogging || !process.client || isbot(navigator?.userAgent)) {
      return;
    }

    let unwatch;

    // wait for session to become active, then log
    unwatch = watchEffect(async() => {
      if (session?.isActive) {
        await sendEventLog(actionType, objectUri, session);
        unwatch();
      }
    });
  };

  const sendEventLog = async(actionType, objectUri, session) => {
    const data = {
      actionType,
      objectUri,
      sessionId: session?.id
    };

    await axios({
      baseURL: window.origin,
      method: 'post',
      data,
      url: '/_api/events'
    });
  };

  return {
    logEvent
  };
}
