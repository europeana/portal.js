import sinon from 'sinon';
import useRotation from '@/composables/rotation.js';

describe('useRotation', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('refs', () => {
    describe('rotation', () => {
      it('defaults to 0', () => {
        const { rotation } = useRotation();

        expect(rotation.value).toBe(0);
      });
    });
  });

  describe('methods', () => {
    describe('reset', () => {
      it('resets rotation value to 0', () => {
        const value = 1;
        const { rotation, reset, setRotation } = useRotation();
        setRotation(value);

        reset();

        expect(rotation.value).toBe(0);
      });
    });

    describe('setRotation', () => {
      it('sets rotation value', () => {
        const value = 1;
        const { rotation, setRotation } = useRotation();

        setRotation(value);

        expect(rotation.value).toBe(value);
      });
    });

    describe('rotateLess', () => {
      it('reduces rotation by quarter circle', () => {
        const { rotation, rotateLess } = useRotation();

        rotateLess();

        expect(rotation.value).toBe(0 - (Math.PI / 2));
      });
    });

    describe('rotateMore', () => {
      it('increases rotation by quarter circle', () => {
        const { rotation, rotateMore } = useRotation();

        rotateMore();

        expect(rotation.value).toBe(0 + (Math.PI / 2));
      });
    });
  });
});
