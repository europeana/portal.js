import axios from 'axios';
import isbot from 'isbot';
import { computed, getCurrentInstance, ref, watch } from 'vue';

export function useLogEvent() {
  const instance = getCurrentInstance();
  const $root = instance.proxy.$root;

  const eventBeingLogged = ref(false);
  const eventToLog = ref(null);

  const logEvent = (actionType, objectUri) => {
    eventToLog.value = { actionType, objectUri };
  };

  const eventMayBeLogged = computed(() => !!(
    $root.$features?.eventLogging &&
    eventToLog.value &&
    !eventBeingLogged.value &&
    !$root.$fetchState?.error &&
    process.client &&
    !isbot(navigator?.userAgent) &&
    $root.$session?.isActive
  ));

  const sendEventLog = async() => {
    console.log('sendEventLog', eventMayBeLogged.value)
    if (!eventMayBeLogged.value) {
      return;
    }

    eventBeingLogged.value = true;

    const postData = {
      ...eventToLog.value,
      sessionId: $root.$session?.id
    };

    try {
      await axios({
        baseURL: $root.$config?.app?.baseUrl,
        method: 'post',
        data: postData,
        url: '/_api/events'
      });
    // } catch (e) {
    //   console.error(e)
    //   throw e;
    } finally {
      eventToLog.value = null;
      eventBeingLogged.value = false;
    }
  };

  watch(eventMayBeLogged, sendEventLog);

  return {
    logEvent
  };
}
