export default {
  data() {
    return {
      parityClasses: []
    };
  },

  methods: {
    markParity(klass, refName) {
      const elements = Array.from(document.getElementsByClassName(klass));
      const index = elements.indexOf(this.$refs[refName]);
      const num = index + 1;
      const parity = ((num % 2) === 1) ? 'odd' : 'even';

      this.parityClasses.push(`${klass}-${parity}`);
    }
  }
};
