import { Pool } from 'pg';

let pool;

export default {
  config: {},

  get enabled() {
    return this.config.enabled;
  },

  get pool() {
    if (!pool) {
      pool = new Pool(this.config);
      pool.on('error', (err) => {
        console.error('PostgreSQL pool error', err);
        pool = null;
      });
    }
    return pool;
  },

  query() {
    return this.pool.query(...arguments);
  }
};
