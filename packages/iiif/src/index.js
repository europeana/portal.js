import fetchResource from './utils/fetch.js';
import V2Manifest from './presentation/v2/Manifest.js';
import V3Manifest from './presentation/v3/Manifest.js';
import V2AnnotationPage from './presentation/v2/AnnotationPage.js';
import V3AnnotationPage from './presentation/v3/AnnotationPage.js';

export default class IIIFFactory {
  static async fetch(url, options = {}) {
    const response = await fetchResource(url, options);
    const data = response.data;

    const type = data.type || data['@type'];
    const presentationVersion = this.versionFromContext(data['@context']);

    let dataClass;

    if (['sc:Manifest', 'Manifest'].includes(type)) {
      if (presentationVersion === 2) {
        dataClass = V2Manifest;
      } else if (presentationVersion === 3) {
        dataClass = V3Manifest;
      } else {
        throw new Error(`Unknown manifest version ${presentationVersion} in ${url}`);
      }
    } else if (type === 'AnnotationPage') {
      dataClass = V3AnnotationPage;
    } else if (type === 'sc:AnnotationList') {
      dataClass = V2AnnotationPage;
    } else {
      throw new Error(`Unknown IIIF resource type ${type} in ${url}`);
    }

    return new dataClass(data);
  }

  static versionFromContext(context) {
    const contexts = [].concat(context).filter((ctx) => !!ctx);

    if (contexts.some((ctx) => ctx.endsWith('//iiif.io/api/presentation/2/context.json'))) {
      return 2;
    } else if (contexts.some((ctx) => ctx.endsWith('//iiif.io/api/presentation/3/context.json'))) {
      return 3;
    } else {
      return null;
    }
  }
}
