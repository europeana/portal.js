import sinon from 'sinon';

import serverMiddleware from '@/server-middleware/api/entities/organisations';
const cacher = require('@/cachers/entities/organisations');

const expressResStub = {
  json: sinon.stub(),
  status: sinon.stub()
};

const options = { redis: { url: 'redis://localhost:6379' } };

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
  beforeEach('stub cache getter', () => {
    sinon.stub(cacher, 'get').resolves({ body: organisations });
  });

  afterEach('restore cache getter', () => {
    cacher.get.restore();
  });

  it('localises organisations and responds with JSON', async() => {
    await serverMiddleware(options)({ query: {} }, expressResStub);

    const localised = [
      {
        id: '1482250000004477234',
        slug: '1482250000004477234-abraham-lincoln-presidential-library',
        prefLabel: 'Abraham Lincoln Presidential Library'
      },
      {
        id: '1482250000004477235',
        slug: '1482250000004477235',
        prefLabel: 'Academie voor de Streekgebonden Gastronomie'
      }
    ];

    expressResStub.json.should.have.been.calledWith(localised);
  });
});
