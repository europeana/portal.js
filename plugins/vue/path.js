import { URL, URLSearchParams } from '../url';
import {
  sslNegotiationEnabled, routePermittedOnEitherScheme, routeOnDatasetBlacklist
} from '../ssl';

export default {
  install(Vue) {
    Vue.prototype.$path = function(route) {
      const localePath = this.localePath(route);

      if (!sslNegotiationEnabled || routePermittedOnEitherScheme(route)) return localePath;

      const routeBlacklisted = routeOnDatasetBlacklist(route);

      // TODO: observe ssl feature toggle
      let switchToProtocol;
      if (routeBlacklisted && this.$store.state.http.protocol === 'https:') {
        switchToProtocol = 'http:';
      } else if (!routeBlacklisted && this.$store.state.http.protocol === 'http:') {
        switchToProtocol = 'https:';
      }

      if (!switchToProtocol) return localePath;

      return `${switchToProtocol}//${this.$store.state.http.host}${localePath}`;
    };

    Vue.prototype.$goto = function(route) {
      if (typeof route === 'string' && route.includes('://')) {
        window.location.href = route;
      } else if (typeof route === 'object' && route.path.includes('://')) {
        const url = new URL(route.path);
        url.search = new URLSearchParams(route.query);
        window.location.href = url.toString();
      } else {
        this.$router.push(route);
      }
    };
  }
};
