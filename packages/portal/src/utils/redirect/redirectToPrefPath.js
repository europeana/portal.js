import { getLabelledSlug } from '@/plugins/europeana/utils.js';
import { redirectToAltRoute } from './redirectToAltRoute.js';

// Makes alterations to the current route then redirects to it
export const redirectToPrefPath = (id, label, { redirect, route, status = 302 }) => {
  const pathMatch = getLabelledSlug(id, label);
  if (route.params.pathMatch !== pathMatch) {
    const params = {
      ...route.params,
      pathMatch
    };
    delete params['0']; // duplicates original pathMatch for some reason

    redirectToAltRoute(
      { params },
      { redirect, route, status }
    );
  }
};
