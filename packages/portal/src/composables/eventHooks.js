import { createEventHook, createGlobalState, toRef } from '@vueuse/core'
// store.js
import { computed, ref, watch } from 'vue'

const eventNames = [
  'add',
  'download',
  'like',
  'unlike',
  'view'
];

export const useEventHooks = createGlobalState(
  () => {
    // console.log('useHeart', arguments)
    // state
    // const baseUrl = toRef(options.baseUrl)
    // const i18n = toRef(options.i18n)
    // const route = toRef(options.route)
    // console.log('route', route)
    // watch(route, () => {
    //   console.log('route changed')
    // }, { deep: true })

    const heartEventHook = createEventHook();

    const heart = (itemId) => heartEventHook.trigger(itemId)

    const hooks = eventNames.reduce((memo, name) => {
      memo[name] = createEventHook();
      return memo;
    }, {});

    return hooks;
  }
)
