import { v4 as uuid } from 'uuid';

const SESSION_ID = 'sessionId';

const VueSessionId = {
  install(Vue, { prefix = '' } = {}) {
    const storageKey = `${prefix}${SESSION_ID}`;

    let sessionId = sessionStorage.getItem(storageKey);

    if (!sessionId) {
      sessionId = uuid();
      sessionStorage.setItem(storageKey, sessionId);
    }

    const instanceProperty = `$${SESSION_ID}`;
    if (!Vue.prototype.hasOwnProperty(instanceProperty)) {
      Object.defineProperty(Vue.prototype, instanceProperty, {
        get() {
          return sessionStorage.getItem(storageKey);
        }
      });
    }
  }
};

export default VueSessionId;
