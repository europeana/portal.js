import pg from 'pg';
import sinon from 'sinon';

import pgEvents from '@/server-middleware/api/pg/pg.js';

const pgPoolOn = sinon.stub();
const pgPoolQuery = sinon.stub();

describe('@/server-middleware/api/pg/pg', () => {
  beforeAll(() => {
    sinon.replace(pg.Pool.prototype, 'on', pgPoolOn);
    sinon.replace(pg.Pool.prototype, 'query', pgPoolQuery);
  });
  afterEach(sinon.resetHistory);
  afterAll(sinon.resetBehavior);

  describe('pool', () => {
    it('creates and returns a pg pool, with error handler', () => {
      const pool = pgEvents.pool;

      expect(pool instanceof pg.Pool).toBe(true);
      expect(pgPoolOn.calledWith('error', sinon.match.func)).toBe(true);
    });
  });

  describe('query', () => {
    it('delegates with all args to pg pool', () => {
      const sql = 'SELECT * FROM table WHERE type=$1';
      const params = ['like'];

      pgEvents.query(sql, params);

      expect(pgPoolQuery.calledWith(sql, params)).toBe(true);
    });
  });
});
