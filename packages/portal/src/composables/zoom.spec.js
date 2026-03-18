import sinon from 'sinon';
import useZoom from '@/composables/zoom.js';

describe('useZoom', () => {
  afterEach(sinon.resetHistory);
  afterAll(sinon.restore);

  describe('refs', () => {
    describe('min', () => {
      it('defaults to 0', () => {
        const { min } = useZoom();

        expect(min.value).toBe(0);
      });
    });

    describe('max', () => {
      it('defaults to 0', () => {
        const { max } = useZoom();

        expect(max.value).toBe(0);
      });
    });

    describe('default', () => {
      it('defaults to 0', () => {
        const { default: def } = useZoom();

        expect(def.value).toBe(0);
      });
    });

    describe('current', () => {
      it('defaults to 0', () => {
        const { current } = useZoom();

        expect(current.value).toBe(0);
      });
    });
  });

  describe('computed', () => {
    describe('atDefault', () => {
      const def = 0;

      it('is true when current is == min', () => {
        const { atDefault, setCurrent, setDefault } = useZoom();

        setDefault(def);
        setCurrent(def);

        expect(atDefault.value).toBe(true);
      });

      it('is false when current is != min', () => {
        const { atDefault, setCurrent, setDefault } = useZoom();

        setDefault(def);
        setCurrent(def + 1);

        expect(atDefault.value).toBe(false);
      });
    });

    describe('atMax', () => {
      const max = 4;

      it('is true when current is >= max', () => {
        const { atMax, setCurrent, setMax } = useZoom();

        setMax(max);
        setCurrent(max);

        expect(atMax.value).toBe(true);
      });

      it('is false when current is < max', () => {
        const { atMax, setCurrent, setMax } = useZoom();

        setMax(max);
        setCurrent(max - 1);

        expect(atMax.value).toBe(false);
      });
    });

    describe('atMin', () => {
      const min = 0;

      it('is true when current is <= min', () => {
        const { atMin, setCurrent, setMin } = useZoom();

        setMin(min);
        setCurrent(min);

        expect(atMin.value).toBe(true);
      });

      it('is false when current is > min', () => {
        const { atMin, setCurrent, setMin } = useZoom();

        setMin(min);
        setCurrent(min + 1);

        expect(atMin.value).toBe(false);
      });
    });
  });

  describe('methods', () => {
    describe('setCurrent', () => {
      it('sets current zoom value', () => {
        const value = 1;
        const { current, setCurrent } = useZoom();

        setCurrent(value);

        expect(current.value).toBe(value);
      });
    });

    describe('setDefault', () => {
      it('sets default zoom value', () => {
        const value = 1;
        const { default: def, setDefault } = useZoom();

        setDefault(value);

        expect(def.value).toBe(value);
      });
    });

    describe('setMin', () => {
      it('sets min zoom value', () => {
        const value = 1;
        const { min, setMin } = useZoom();

        setMin(value);

        expect(min.value).toBe(value);
      });
    });

    describe('setMax', () => {
      it('sets max zoom value', () => {
        const value = 1;
        const { max, setMax } = useZoom();

        setMax(value);

        expect(max.value).toBe(value);
      });
    });

    describe('zoomIn', () => {
      it('increases current by 1', () => {
        const { current, setCurrent, setMax, zoomIn } = useZoom();

        setCurrent(1);
        setMax(2);
        zoomIn();

        expect(current.value).toBe(2);
      });

      it('prevents zooming in above max', () => {
        const { current, setCurrent, setMax, zoomIn } = useZoom();

        setCurrent(2);
        setMax(2);
        zoomIn();

        expect(current.value).toBe(2);
      });
    });

    describe('zoomOut', () => {
      it('decreases current by 1', () => {
        const { current, setCurrent, setMin, zoomOut } = useZoom();

        setCurrent(2);
        setMin(0);
        zoomOut();

        expect(current.value).toBe(1);
      });

      it('prevents zooming out below min', () => {
        const { current, setCurrent, setMin, zoomOut } = useZoom();

        setCurrent(0);
        setMin(0);
        zoomOut();

        expect(current.value).toBe(0);
      });
    });
  });
});
