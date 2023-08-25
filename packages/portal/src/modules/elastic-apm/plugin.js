import Vue from 'vue';

// TODO: this does not work w/ nuxt; no hydration. refactor to use vuex?
//       or just make it client-only?

async function logApmTransaction() {
  if (!this._apmReporter.transaction?.name) {
    return;
  }

  const labels = {
    ...(this._apmReporter.transaction.labels || {})
  };
  if (this.$sessionId) {
    labels['session_id'] = this.$sessionId;
  }

  console.log('logApmTransaction', this._apmReporter.transaction.name, labels);

  const transaction = this.$apm?.startTransaction(this._apmReporter.transaction.name, 'user-interaction');
  transaction?.addLabels(labels);

  // wait a moment as otherwise the transaction is too fast and the APM
  // agent appears to discard it
  const delay = () => new Promise(resolve => {
    setTimeout(resolve, 100);
  });
  await delay();

  transaction?.end();
  this._apmReporter.transaction = null;
}

const apmTransaction = {
  get() {
    return this._apmReporter.transaction;
  },
  set(val) {
    console.log('VueApmReporter $apmTransaction set', val)
    this._apmReporter.transaction = val;
  }
};

const VueApmReporter = {
  install(Vue) {
    Vue.prototype._logApmTransaction = logApmTransaction;

    if (!Vue.prototype.hasOwnProperty('_apmReporter')) {
      Vue.prototype._apmReporter = Vue.observable({ transaction: null });
    }

    if (!Vue.prototype.hasOwnProperty('$apmTransaction')) {
      Object.defineProperty(Vue.prototype, '$apmTransaction', apmTransaction)
    }

    new Vue({
      watch: {
        '_apmReporter.transaction': {
          deep: true,
          handler(to, from) {
            console.log('VueApmReporter watch _apmReporter.transaction', from, to)
            this._logApmTransaction();
          }
        }
      }
    });
  }
};

export default () => {
  Vue.use(VueApmReporter);
};
