import axios from 'axios';

import plugin from '@/plugins/axios.server';

describe('plugins/axios.server', () => {
  describe('default export', () => {
    it('enables keep-alive on axios global default agents', () => {
      plugin();

      expect(axios.defaults.httpAgent.keepAlive).toBe(true);
      expect(axios.defaults.httpsAgent.keepAlive).toBe(true);
    });

    it('instantiates single agents to reuse', () => {
      plugin();
      const httpAgent1 = axios.defaults.httpAgent;
      const httpsAgent1 = axios.defaults.httpsAgent;

      plugin();
      const httpAgent2 = axios.defaults.httpAgent;
      const httpsAgent2 = axios.defaults.httpsAgent;

      expect(httpAgent1).toBe(httpAgent2);
      expect(httpsAgent1).toBe(httpsAgent2);
    });

    it('reuses agents in axios requests', () => {
      plugin();

      const axiosInstance1 = axios.create();
      const axiosInstance2 = axios.create();

      expect(axiosInstance1.defaults.httpAgent).toBe(axiosInstance2.defaults.httpAgent);
      expect(axiosInstance1.defaults.httpsAgent).toBe(axiosInstance2.defaults.httpsAgent);
    });
  });
});
