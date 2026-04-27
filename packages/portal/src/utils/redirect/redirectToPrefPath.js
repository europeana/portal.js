import { getLabelledSlug } from '@/plugins/europeana/utils.js';
import { redirectToAltRoute } from './redirectToAltRoute.js';

/**
 * redirect to pref path from numeric id and string pref label
 *
 * unless already on that path
 *
 * @param {number} id
 * @param {string} label
 * @param {object} ctx
 * @returns {boolean} true if redirected, false if not
 */
// Makes alterations to the current route then redirects to it
export const redirectToPrefPath = (id, label, { redirect, route, status = 302 }) => {
  const pathMatch = getLabelledSlug(id, label);

  if (route.params.pathMatch === pathMatch) {
    return false;
  } else {
    const params = {
      ...route.params,
      pathMatch
    };
    delete params['0']; // duplicates original pathMatch for some reason

    redirectToAltRoute(
      { params },
      { redirect, route, status }
    );
    return true;
  }
};
