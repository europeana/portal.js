import expressApp from '@europeana/express/src/app.js';
import expressServer from '@europeana/express/src/server.js';
import app from './app.js';

expressServer(expressApp(app));
