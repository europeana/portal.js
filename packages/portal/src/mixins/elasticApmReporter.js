export default {
  data() {
    return {
      // TODO: refactor to support multiple transactions, in an array, mainly
      //       for SSR where they don't get logged immediately
      apmTransaction: null
    };
  },

  mounted() {
    this.logApmTransaction();
  },

  methods: {
    async logApmTransaction(apmTransaction) {
      if (apmTransaction) {
        this.apmTransaction = apmTransaction;
      }

      if (!process.client) {
        return;
      }

      if (!this.apmTransaction?.name) {
        return;
      }

      const labels = {
        ...(this.apmTransaction.labels || {})
      };
      if (this.$session?.id) {
        labels['session_id'] = this.$session.id;
      }

      const transaction = this.$apm?.startTransaction(this.apmTransaction.name, 'user-interaction');
      transaction?.addLabels(labels);

      // wait a moment as otherwise the transaction is too fast and the APM
      // agent appears to discard it
      const delay = () => new Promise(resolve => {
        setTimeout(resolve, 100);
      });
      await delay();

      transaction?.end();
      this.apmTransaction = null;
    }
  }
};
