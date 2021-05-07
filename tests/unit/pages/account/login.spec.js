import { shallowMountNuxt } from '../../utils';
import sinon from 'sinon';

import page from '../../../../src/pages/account/login';

describe('pages/account/login.vue', () => {
  describe('beforeRouteEnter', () => {
    it('stores the previous page full path for auth redirection', () => {
      const authStorageSetUniversal = sinon.spy();
      const wrapper = shallowMountNuxt(page, {
        mocks: {
          $auth: {
            loginWith: sinon.spy(),
            $storage: {
              setUniversal: authStorageSetUniversal
            }
          },
          $i18n: {
            locale: 'en'
          }
        }
      });

      const from = { fullPath: '/eu/item/123/def' };
      const next = sinon.stub().yields(wrapper.vm);
      page.beforeRouteEnter.call(wrapper.vm, null, from, next);

      next.should.have.been.called;
      authStorageSetUniversal.should.have.been.calledWith('redirect', from.fullPath);
    });
  });
});
