import pick from 'lodash/pick';
import uniq from 'lodash/uniq';

import { thumbnailUrl, thumbnailTypeForMimeType } from  '../thumbnail';
import { isIIIFPresentation } from '../../media';

const factory = (uri, edm) => {
  const aggregation = edm.aggregations[0];
  const resource = aggregation.webResources.find(webResource => uri === webResource.about);

  return {
    ...pickWebResourceProperties(resource),
    get edmRights() {
      return (this.webResourceEdmRights || aggregation.edmRights || { def: [] }).def[0];
    },
    get downloadable() {
      return this.edmRights && !this.edmRights.includes('/InC/') && (this.about !== aggregation.edmIsShownAt);
    },
    get thumbnailUri() {
      if (aggregation.edmObject && ([aggregation.edmIsShownBy, aggregation.edmIsShownAt].includes(this.about))) {
        return aggregation.edmObject;
      }
      return this.about;
    },
    get thumbnailType() {
      return thumbnailTypeForMimeType(this.ebucoreHasMimeType) || edm.type;
    },
    get thumbnails() {
      return {
        small: thumbnail('w200', this, aggregation),
        large: thumbnail('w400', this, aggregation)
      };
    },
    // Service definitions, e.g. for IIIF
    get services() {
      return (edm.services || [])
        .filter(service => (this.svcsHasService || []).includes(service.about));
    }
  };
};

/**
 * @typedef {Object} Thumbnail
 * @property {string} url URL to sized & typed thumbnail
 * @property {Boolean} linkable Whether it is permitted to link to the web
 *                              resource from the thumbnail
 */
/**
 * Generate thumbnail properties for a web resource
 *
 * NOTE: Do not make this a function of the factory return value, as that causes:
 *       > WARN  Cannot stringify a function thumbnail
 *
 * @param {string} size Size of thumbnail of 'w200' & 'w400'
 * @param {Object} resource Web resource, as returned by `factory`
 * @param {string} resource.about URI of web resource
 * @param {string} resource.thumbnailUri URI of media asset to thumbnail
 * @param {string} resource.thumbnailType EDM type of media asset to thumbnail
 * @param {Object} aggregation Aggregation web resource belongs to
 * @param {string} aggregation.edmIsShownAt isShownAt property of aggregation
 * @return {Thumbnail} Thumbnail properties
 */
const thumbnail = (size, { about, thumbnailUri, thumbnailType }, { edmIsShownAt }) => {
  return {
    url: thumbnailUrl(thumbnailUri, {
      size,
      type: thumbnailType
    }),
    linkable: (about !== edmIsShownAt)
  };
};

// Filter web resources to isShownBy and hasView, respecting the ordering
export default (edm) => {
  let media = mediaUris(edm.aggregations[0])
    .map(uri => factory(uri, edm));

  // Crude check for IIIF content, which is to prevent newspapers from showing many
  // IIIF viewers.
  //
  // Also greatly minimises response size, and hydration cost, for IIIF with
  // many web resources, all of which are contained in a single manifest anyway.
  media = isIIIFPresentation(media[0]) ? [media[0]] : media;

  // Sort by isNextInSequence property if present
  return sortByIsNextInSequence(media).map(Object.freeze);
};

// Gathers all isShownBy/At and hasView URIs
const mediaUris = aggregation => {
  return uniq(
    [aggregation.edmIsShownBy || aggregation.edmIsShownAt]
      .concat(aggregation.hasView || [])
      .filter(Boolean)
  );
};

const pickWebResourceProperties = webResource => {
  return pick(webResource, [
    'about',
    'dctermsIsReferencedBy',
    'ebucoreHasMimeType',
    'ebucoreHeight',
    'ebucoreWidth',
    'isNextInSequence',
    'svcsHasService',
    'webResourceEdmRights'
  ]);
};

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
const sortByIsNextInSequence = source => {
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
