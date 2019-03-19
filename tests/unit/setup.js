const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
global.should = chai.should;

import('../../plugins/vue-filters');
