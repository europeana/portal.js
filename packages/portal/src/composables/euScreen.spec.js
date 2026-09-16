import { useEuScreen } from './euScreen.js';

describe('useEuScreen', () => {
  describe('isEuScreenItem', () => {
    it('is `true` if url starts with "http://www.euscreen.eu/item.html"', () => {
      const url = 'http://www.euscreen.eu/item.html?id=EUS_1234';

      const { isEuScreenItem } = useEuScreen(url);

      expect(isEuScreenItem.value).toBe(true);
    });

    it('is `true` if url starts with "https://www.euscreen.eu/item.html"', () => {
      const url = 'https://www.euscreen.eu/item.html?id=EUS_1234';

      const { isEuScreenItem } = useEuScreen(url);

      expect(isEuScreenItem.value).toBe(true);
    });

    it('is `false` otherwise', () => {
      const url = 'https://www.example.org/item.html?id=OTH_1234';

      const { isEuScreenItem } = useEuScreen(url);

      expect(isEuScreenItem.value).toBe(false);
    });
  });

  describe('id', () => {
    it('is the `id` param from URL for EUscreen items', () => {
      const url = 'https://www.euscreen.eu/item.html?id=EUS_1234';

      const { id } = useEuScreen(url);

      expect(id.value).toBe('EUS_1234');
    });

    it('is `undefined` otherwise', () => {
      const url = 'https://www.example.org/item.html?id=OTH_1234';

      const { id } = useEuScreen(url);

      expect(id.value).toBeUndefined();
    });
  });

  describe('embedUrl', () => {
    it('is the EUscreen embed URL for EUscreen items', () => {
      const url = 'https://www.euscreen.eu/item.html?id=EUS_1234';

      const { embedUrl } = useEuScreen(url);

      expect(embedUrl.value).toBe('https://euscreen.embd.eu/EUS_1234');
    });

    it('is `undefined` otherwise', () => {
      const url = 'https://www.example.org/item.html?id=OTH_1234';

      const { embedUrl } = useEuScreen(url);

      expect(embedUrl.value).toBeUndefined();
    });
  });
});
