import waitFor from '@/utils/waitFor.js';

describe('@/utils/waitFor.js', () => {
  describe('waitFor', () => {
    describe('promise', () => {
      it('resolves if callback already truthy', async() => {
        const callback = () => ({});

        const promise = waitFor(callback);

        await expect(promise).resolves.not.toThrow();
      });

      it('resolves if callback becomes truthy later', async() => {
        let target = false;
        const callback = () => target;

        const promise = waitFor(callback, { delay: 10, retries: 10 });
        setTimeout(() => target = true, 5);

        await expect(promise).resolves.not.toThrow();
      });

      it('rejects if callback never truthy in time', async() => {
        let target = false;
        const callback = () => target;

        const promise = waitFor(callback, { name: 'something', delay: 0, retries: 1 });

        await expect(promise).rejects.toEqual(Error('Gave up waiting for something'));
      });
    });
  });
});
