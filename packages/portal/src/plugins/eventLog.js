import { useEventHooks } from '@/composables/eventHooks.js';

export default (ctx) => {
  const hooks = useEventHooks();

  for (const eventName in hooks) {
    hooks[eventName].on(function() {
      console.log(eventName, arguments)
    })
  }
};
