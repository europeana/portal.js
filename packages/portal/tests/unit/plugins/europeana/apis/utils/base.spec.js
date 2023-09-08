import EuropeanaApi from '@/plugins/europeana/apis/utils/base.js';

describe('EuropeanaApi', () => {
  describe('createAxios', () => {
    it('uses app.$axiosLogger from context as request interceptor', () => {
      const $axiosLogger = (requestConfig) => requestConfig;
      const context = {
        app: { $axiosLogger }
      };
      const axiosInstance = (new EuropeanaApi(context)).createAxios({}, context);

      expect(axiosInstance.interceptors.request.handlers.some((handler) => {
        return handler.fulfilled === $axiosLogger;
      })).toBe(true);
    });
  });
});
