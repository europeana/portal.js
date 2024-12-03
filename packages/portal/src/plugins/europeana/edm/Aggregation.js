import Base from './Base.js';
import WebResource from './WebResource.js';

/**
 * Sorts an array of objects by the `isNextInSequence` property.
 *
 * Logic:
 * * Any objects not having `isNextInSequence` will not be moved.
 * * Any objects having `isNextInSequence` will be moved to the position
 *   immediately following the other object whose `about` property matches this
 *   one's `isNextInSequence`
 *
 * @param {Object[]} source items to sort
 * @return {Object[]} sorted items
 * @example
 *    const unsorted = [
 *      { about: 'd', isNextInSequence: 'c' },
 *      { about: 'b', isNextInSequence: 'a' },
 *      { about: 'a' },
 *      { about: 'c', isNextInSequence: 'b' }
 *    ];
 *    const sorted = sortByIsNextInSequence(unsorted);
 *    console.log(sorted[0].about); // expected output: 'a'
 *    console.log(sorted[1].about); // expected output: 'b'
 *    console.log(sorted[2].about); // expected output: 'c'
 *    console.log(sorted[3].about); // expected output: 'd'
 */
const sortByIsNextInSequence = (source) => {
  // Make a copy to work on
  const items = [].concat(source);

  const itemUris = items.map((item) => item.about);

  for (const uri of itemUris) {
    // It's necessary to find the item on each iteration to sort as it may have
    // been moved from its original position by a previous iteration.
    const sortItemIndex = items.findIndex((item) => item.about === uri);
    const sortItem = items[sortItemIndex];

    // If it has isNextInSequence property, move it after that item; else
    // leave it be.
    if (sortItem.isNextInSequence) {
      const isPreviousInSequenceIndex = items.findIndex((item) => item.about === sortItem.isNextInSequence);
      if (isPreviousInSequenceIndex !== -1) {
        // Remove the item from its original position.
        items.splice(sortItemIndex, 1);
        // Insert the item after its predecessor.
        items.splice(isPreviousInSequenceIndex + 1, 0, sortItem);
      }
    }
  }

  return items;
};

export default class Aggregation extends Base {
  static propertyClasses = {
    webResources: WebResource
  };

  constructor(data) {
    super(data);

    const edmObjectWebResource = this.webResources?.find((wr) => wr.about === data.edmObject);

    for (const wr of (this.webResources || [])) {
      wr.forEdmIsShownAt = wr.about === data.edmIsShownAt;
      if ([data.edmIsShownBy, data.edmIsShownAt].includes(wr.about) && edmObjectWebResource) {
        // set the wr preview to a copy of edmObjectWebResource to prevent circular reference
        wr.preview = { ...edmObjectWebResource };
      }
    }
  }

  get iiifPresentationManifestWebResources() {
    return (this.webResources || []).filter((wr) => wr.isIIIFPresentationManifest);
  }

  // TODO: memoise
  get displayableWebResources() {
    const uris = [].concat(this.hasView || []);

    if (this.edmIsShownBy) {
      uris.unshift(this.edmIsShownBy);
    } else if (this.edmIsShownAt) {
      uris.unshift(this.edmIsShownAt);
    }

    const wrs = uris.map((uri) => (this.webResources || []).find((wr) => wr.about === uri));

    // Sort by isNextInSequence property if present
    return sortByIsNextInSequence(wrs);
  }
}
