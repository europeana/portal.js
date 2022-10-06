import axios from 'axios';

import plugin from '@/modules/http/templates/plugin.axios.server';

describe('modules/http/templates/plugin.axios.server', () => {
  describe('default export', () => {
    it('enables keep-alive on axios global default agents', () => {
      plugin();

      expect(axios.defaults.httpAgent.keepAlive).toBe(true);
      expect(axios.defaults.httpsAgent.keepAlive).toBe(true);
    });

    it('reuses agents in axios requests', () => {
      const axios1 = axios.create();
      const axios2 = axios.create();

      expect(axios1.defaults.httpAgent).toBe(axios2.defaults.httpAgent);
      expect(axios1.defaults.httpsAgent).toBe(axios2.defaults.httpsAgent);
    });
  });
});
