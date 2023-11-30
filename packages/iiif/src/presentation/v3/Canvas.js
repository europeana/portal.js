import Base from '../Base.js';
import AnnotationPage from './AnnotationPage.js';
import Image from '../Image.js';

export default class IIIFPresentationV3Canvas extends Base {
  static MAPPINGS = [
    { as: Image, filter: (image) => image.type === 'Image', from: 'items.items.body', to: 'images', which: 'all' },
    { as: Image, filter: (thumb) => thumb.type === 'Image', from: 'thumbnail', which: 'first' },
    { as: AnnotationPage, from: 'annotations', to: 'annotationPages', which: 'all' }
  ];
}
