import sinon from 'sinon';

import serverMiddleware from '@/server-middleware/api/entities/organisations';
import cacheUtils from '@/cachers/utils';

const expressResStub = {
  json: sinon.stub(),
  status: sinon.stub()
};

const config = { redis: { url: 'redis://localhost:6379' } };

const organisations = {
  '1482250000004477234': {
    prefLabel: {
      de: 'Abraham Lincoln Presidential Library',
      en: 'Abraham Lincoln Presidential Library',
      es: 'Biblioteca y Museo Presidencial de Abraham Lincoln',
      fr: 'Abraham Lincoln Presidential Library and Museum',
      ja: 'エイブラハム・リンカーン・プレジデンシャル図書館',
      nl: 'Abraham Lincoln Presidential Library and Museum'
    }
  },
  '1482250000004477235': {
    prefLabel: {
      nl: 'Academie voor de Streekgebonden Gastronomie'
    }
  }
};

describe('server-middleware/entities/organisations', () => {
  beforeEach('stub createRedisClient cache util', () => {
    sinon.stub(cacheUtils, 'createRedisClient').returns({
      getAsync: sinon.stub().resolves(JSON.stringify(organisations))
    });
  });

  afterEach('restore createRedisClient cache util', () => {
    cacheUtils.createRedisClient.restore();
  });

  // it('localises organisations and responds with JSON', async() => {
  //   await serverMiddleware(config)({ query: {} }, expressResStub);

  //   const localised = [
  //     {
  //       id: '1482250000004477234',
  //       slug: '1482250000004477234-abraham-lincoln-presidential-library',
  //       prefLabel: 'Abraham Lincoln Presidential Library'
  //     },
  //     {
  //       id: '1482250000004477235',
  //       slug: '1482250000004477235',
  //       prefLabel: 'Academie voor de Streekgebonden Gastronomie'
  //     }
  //   ];

  //   expressResStub.json.should.have.been.calledWith(localised);
  // });
  it('filters out English organisation labels and responds with JSON', async() => {
    await serverMiddleware(config)({ query: {} }, expressResStub);

    const localised = [
      {
        id: '1482250000004477234',
        slug: '1482250000004477234-abraham-lincoln-presidential-library',
        prefLabel: 'Abraham Lincoln Presidential Library'
      }
    ];

    expressResStub.json.should.have.been.calledWith(localised);
  });
});
