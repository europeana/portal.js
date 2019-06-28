const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));
chai.should();
global.should = chai.should;

import('../../plugins/vue-filters');
