import Base from '../Base.js';
import AnnotationPage from './AnnotationPage.js';
import Image from '../Image.js';

export default class IIIFPresentationV2Canvas extends Base {
  static MAPPINGS = [
    // NOTE: `.type === 'dctypes:Image'` may be preferable, but some provider
    //       manifests incorrectly have dcTypes: prefix, e.g. /64/OOELBXMETSXOOELBXATX1006
    { as: Image, filter: (thumb) => thumb.type.endsWith(':Image'), from: 'thumbnail', which: 'first' },
    { as: Image, filter: (image) => image.type.endsWith(':Image'), from: 'images.resource', to: 'images', which: 'all' },
    { as: AnnotationPage, filter: (annoPage) => annoPage.type === 'sc:AnnotationList', from: 'otherContent', to: 'annotationPages', which: 'all' }
  ];
}
