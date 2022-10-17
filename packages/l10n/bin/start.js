import { app as expressApp, server as expressServer } from '@europeana/express';
import app from '../src/app.js';

expressServer(expressApp(app));
