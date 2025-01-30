import useServiceManager, { configure } from '@/composables/serviceManager.js';

const allServices = [
  {
    name: 'essential',
    services: [
      {
        name: 'auth',
        services: [
          { name: 'auth1' }
        ]
      }
    ]
  },
  {
    name: 'analytics',
    services: [{ name: 'analytics1' }]
  },
  {
    name: 'media',
    services: [
      {
        name: 'audio',
        services: [{ name: 'audio1' }]
      },
      {
        name: 'video',
        services: [
          { name: 'video1' },
          { name: 'video2' }
        ]
      }
    ]
  }
];

describe('@/composables/serviceManager.js', () => {
  beforeAll(() => {
    configure({ definitions: allServices });
  });

  describe('services', () => {
    it('defaults the ref value to all configured service definitions', () => {
      const { services } = useServiceManager();

      expect(services.value).toEqual(allServices);
    });

    it('limits the ref value to those specified in the `pick` option', () => {
      const config = {
        pick: ['essential', 'video2']
      };

      const { services } = useServiceManager(config);

      expect(services.value).toEqual([
        {
          name: 'essential',
          services: [
            {
              name: 'auth',
              services: [
                { name: 'auth1' }
              ]
            }
          ]
        },
        {
          name: 'media',
          services: [
            {
              name: 'video',
              services: [
                { name: 'video2' }
              ]
            }
          ]
        }
      ]);
    });
  });

  describe('deselect', () => {
    it('removes the service from selected', () => {
      const { select, selected, deselect } = useServiceManager();

      select('auth');
      expect(selected.value).toEqual(['auth']);

      deselect('auth');
      expect(selected.value).toEqual([]);
    });
  });
});
