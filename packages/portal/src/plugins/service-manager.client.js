import { configure as configureServiceManager } from '@/composables/serviceManager.js';
import definitions from '@/utils/services/definitions.js';

export default (ctx) => {
  if (ctx.$features?.embeddedMediaNotification) {
    // configure the services for the service manager
    // TODO: supply callbacks...?
    configureServiceManager({ definitions });
  }
};
