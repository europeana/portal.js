import { useEventHooks } from '@/composables/eventHooks.js';
// import { toRef } from '@vueuse/core'

const eventNames = [
  'add',
  'download',
  'like',
  'unlike',
  'view'
];

export default (ctx) => {
  const {} = useEventHooks(eventNames)
  // onEventHooks((itemId) => {
  //   console.log(`I hear this item got hearted: ${itemId}`)
  // })
};
