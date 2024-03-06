export default {
  methods: {
    markParity(klass) {
      const elements = document.getElementsByClassName(klass);

      for (let i = 0; i < elements.length; i++) {
        const parity = (((i + 1) % 2) === 1) ? 'odd' : 'even';
        elements[i].dataset.parity = parity;
      }
    }
  }
};
