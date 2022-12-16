import sinon from 'sinon';
import * as plugin from '@/plugins/authScheme';

let defaultExportPrototype;
const defaultExportPrototypeStub = sinon.stub().callsFake();

describe('plugins/authScheme', () => {
  describe('default', () => {
    beforeAll(() => {
      defaultExportPrototype = Object.getPrototypeOf(plugin.default);
      Object.setPrototypeOf(plugin.default, defaultExportPrototypeStub);
    });

    afterAll(() => {
      Object.setPrototypeOf(plugin.default, defaultExportPrototype);
    });

    describe('constructor', () => {
      const strategy = 'keycloak';
      const origin = 'https://auth.europeana.eu';
      const realm = 'europeana';
      const options = {
        '_name': strategy
      };
      const runtimeConfig = {
        auth: {
          strategies: {
            [strategy]: {
              origin,
              realm
            }
          }
        }
      };
      const $auth = {
        ctx: {
          $config: runtimeConfig
        }
      };

      it('calls the super class constructor with options including from runtime config', () => {
        const expectedOptions = {
          '_name': strategy,
          origin,
          realm,
          'authorization_endpoint': `${origin}/auth/realms/${realm}/protocol/openid-connect/auth`,
          'access_token_endpoint': `${origin}/auth/realms/${realm}/protocol/openid-connect/token`,
          'userinfo_endpoint': `${origin}/auth/realms/${realm}/protocol/openid-connect/userinfo`,
          'end_session_endpoint': `${origin}/auth/realms/${realm}/protocol/openid-connect/logout`
        };

        new plugin.default($auth, options);

        expect(defaultExportPrototypeStub.calledWith($auth, expectedOptions)).toBe(true);
      });

      it('decorates $auth with userHasClientRole helper', () => {
        new plugin.default($auth, options);

        expect(typeof $auth.userHasClientRole).toBe('function');
      });
    });
  });

  describe('userHasClientRole', () => {
    it('is `false` if no user', () => {
      const auth = { user: undefined };

      const userHasClientRole = plugin.userHasClientRole.call(auth, 'entities', 'editor');

      expect(userHasClientRole).toBe(false);
    });

    it('is `false` if user has no resource access', () => {
      const auth = { user: { 'resource_access': undefined } };

      const userHasClientRole = plugin.userHasClientRole.call(auth, 'entities', 'editor');

      expect(userHasClientRole).toBe(false);
    });

    it('is `false` if user does not have specified client resource access', () => {
      const auth = { user: { 'resource_access': { usersets: { roles: ['editor'] } } } };

      const userHasClientRole = plugin.userHasClientRole.call(auth, 'entities', 'editor');

      expect(userHasClientRole).toBe(false);
    });

    it('is `false` if user does not have specified client resource access role', () => {
      const auth = { user: { 'resource_access': { entities: { roles: ['editor'] } } } };

      const userHasClientRole = plugin.userHasClientRole.call(auth, 'entities', 'publisher');

      expect(userHasClientRole).toBe(false);
    });

    it('is `true` if user does have specified client resource access role', () => {
      const auth = { user: { 'resource_access': { entities: { roles: ['editor'] } } } };

      const userHasClientRole = plugin.userHasClientRole.call(auth, 'entities', 'editor');

      expect(userHasClientRole).toBe(true);
    });
  });
});
