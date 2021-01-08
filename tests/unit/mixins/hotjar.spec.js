import HotjarMixin from '../../../mixins/hotjar';

describe('mixins/hotjar', () => {
  describe('computed', () => {
    describe('$hotjarScript', () => {
      context('with Hotjar configured', () => {
        const vm = {
          $config: {
            hotjar: {
              id: '123',
              sv: '1'
            }
          }
        };

        it('returns script object for Hotjar ID & snippet version', () => {
          const script = HotjarMixin.computed.$hotjarScript.call(vm);

          script.src.should.eq('https://static.hotjar.com/c/hotjar-123.js?sv=1');
        });

        it('is an async script', () => {
          const script = HotjarMixin.computed.$hotjarScript.call(vm);

          script.async.should.be.true;
        });
      });

      context('without Hotjar configured', () => {
        const vm = {
          $config: {
            hotjar: {
              id: undefined,
              sv: undefined
            }
          }
        };

        it('returns `null`', () => {
          const script = HotjarMixin.computed.$hotjarScript.call(vm);

          (script === null).should.be.true;
        });
      });
    });
  });
});
