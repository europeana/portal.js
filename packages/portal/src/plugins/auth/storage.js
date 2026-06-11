import { PLUGIN_NAME } from './constants.js';

export const createStorage = ({ cookies, prefix = PLUGIN_NAME }) => {
  const storageKey = (key) => `${prefix}.${key}`;

  return {
    // TODO: client-side only?
    local: {
      get: (key) => localStorage.getItem(storageKey(key)),
      set: (key, value) => localStorage.setItem(storageKey(key), value),
      remove: (key) => localStorage.removeItem(storageKey(key))
    },
    cookies: {
      get: (key) => cookies.get(storageKey(key)),
      set: (key, value) => cookies.set(storageKey(key), value),
      // TODO: does this do anything server-side?
      remove: (key) => cookies.remove(storageKey(key))
    }
  };
};
