import sinon from 'sinon';

export const expressReqStub = (mocks = {}) => ({
  query: {},
  headers: {},
  params: {},
  get: sinon.spy(),
  ...mocks
});

export const expressResStub = (mocks = {}) => ({
  json: sinon.spy(),
  sendStatus: sinon.spy(),
  ...mocks
});

export const expressNextStub = () => sinon.spy();
