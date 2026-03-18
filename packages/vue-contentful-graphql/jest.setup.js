// Always use HTTP adapter to prevent XHR weirdness during testing

import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
axios.defaults.adapter = httpAdapter;
