import Base from '../Base.js';
import Annotation from './Annotation.js';

export default class IIIFPresentationV2AnnotationPage extends Base {
  static MAPPINGS = [
    { as: Annotation, from: 'resources', to: 'annotations' }
  ];
}
