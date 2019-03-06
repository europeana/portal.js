const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiNock = require('chai-nock');
chai.use(chaiAsPromised);
chai.use(chaiNock);
chai.should();
global.should = chai.should;
