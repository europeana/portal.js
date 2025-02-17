import { useEventHooks } from '@/composables/eventHooks.js';

export default async({ $auth, store }) => {
  const { like, unlike } = useEventHooks();
  like.on(() => store.dispatch('set/fetchLikes'))
  unlike.on(() => store.dispatch('set/fetchLikes'))
  
  if ($auth?.loggedIn) {
    try {
      // TODO: assess whether there is a more efficient way to do this with fewer
      //       API requests
      await store.dispatch('set/setLikes');
      await store.dispatch('set/fetchLikes');
    } catch (e) {
      // Don't cause everything to break if the Set API is down...
    }
  }
};
