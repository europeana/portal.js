import sinon from 'sinon';

import middleware from '../../../middleware/legacy';

describe('middleware/legacy', () => {
  it('removes /portal prefix', () => {
    const redirect = sinon.spy();

    middleware({
      redirect,
      route: {
        path: '/portal/en/about-us'
      }
    });

    redirect.should.have.been.calledWith({
      path: '/en/about-us'
    });
  });

  it('removes .html suffix', () => {
    const redirect = sinon.spy();

    middleware({
      redirect,
      route: {
        path: '/de/record/90402/SK_A_2344.html'
      }
    });

    redirect.should.have.been.calledWith({
      path: '/de/record/90402/SK_A_2344'
    });
  });

  it('redirects legacy agent entity paths', () => {
    const redirect = sinon.spy();

    middleware({
      redirect,
      route: {
        path: '/fr/explore/people/60404-johannes-vermeer.html'
      }
    });

    redirect.should.have.been.calledWith({
      path: '/fr/entity/person/60404'
    });
  });

  it('redirects legacy concept entity paths', () => {
    const redirect = sinon.spy();

    middleware({
      redirect,
      route: {
        path: '/nl/explore/topics/47-painting.html'
      }
    });

    redirect.should.have.been.calledWith({
      path: '/nl/entity/topic/47'
    });
  });
});
