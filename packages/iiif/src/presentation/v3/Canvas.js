import Base from '../Base.js';
import AnnotationPage from './AnnotationPage.js';
import Image from '../Image.js';

export default class IIIFPresentationV3Canvas extends Base {
  constructor(data) {
    super(data);

    const items = data.items || [];
    const annotations = items.map((item) => item.items).flat();
    const images = annotations.map((ann) => ann.body).flat().filter((ann) => ann.type === 'Image');
    this.images = images.map((img) => new Image(img));

    this.annotationPages = [].concat(data.annotations || []).map((ann) => new AnnotationPage(ann));

    this.thumbnail = [].concat(data.thumbnail || [])
      .filter((thumb) => thumb.type === 'Image')
      .map((thumb) => new Image(thumb))[0];
  }
}
