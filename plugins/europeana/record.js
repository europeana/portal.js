import { apiError } from './utils';
import axios from 'axios';
import escapeRegExp from 'lodash/escapeRegExp';
import omitBy from 'lodash/omitBy';
import merge from 'deepmerge';

/**
 * Parse the record data based on the data from the API response
 * @param {Object} response data from API response
 * @return {Object} parsed data
 */
function parseRecordDataFromApiResponse(response) {
  const edm = response.data.object;

  const providerAggregation = edm.aggregations[0];
  const europeanaAggregation = edm.europeanaAggregation;
  const entities = [].concat(edm.concepts, edm.places, edm.agents)
    .filter(isNotUndefined)
    .reduce((memo, entity) => {
      memo[entity.about] = entity;
      return memo;
    }, {});
  const proxyData = merge.all(edm.proxies);

  return {
    altTitle: proxyData.dctermsAlternative,
    description: proxyData.dcDescription,
    identifier: edm.about,
    image: {
      link: providerAggregation.edmIsShownAt,
      src: europeanaAggregation.edmPreview
    },
    coreFields: lookupEntities(omitBy({
      dcContributor: proxyData.dcContributor, // Plus rdaGr2DateOfBirth & rdaGr2DateOfDeath
      dcCreator: proxyData.dcCreator, // Plus rdaGr2DateOfBirth & rdaGr2DateOfDeath
      dcPublisher: proxyData.dcPublisher,
      dcSubject: proxyData.dcSubject,
      dcType: proxyData.dcType,
      dcTermsMedium: proxyData.dctermsMedium
    }, isUndefined), entities),
    fields: lookupEntities(omitBy({
      dcTermsCreated: proxyData.dcTermsCreated,
      edmCountry: europeanaAggregation.edmCountry,
      edmDataProvider: providerAggregation.edmDataProvider,
      edmRights: providerAggregation.edmRights
    }, isUndefined), entities),
    media: aggregationMedia(providerAggregation),
    agents: edm.agents,
    concepts: edm.concepts,
    title: proxyData.dcTitle
  };
}

function aggregationMedia(aggregation) {
  // Gather all isShownBy and hasView URIs
  const mediaUris = [aggregation.edmIsShownBy].concat(aggregation.hasView || []).filter(isNotUndefined);

  // Filter web resources to isShownBy and hasView
  const media = aggregation.webResources.filter((webResource) => mediaUris.includes(webResource.about));

  // Sort by isNextInSequence property if present
  return sortByIsNextInSequence(media);
}

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
function sortByIsNextInSequence(source) {
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
}

function isUndefined(value) {
  return value === undefined;
}
function isNotUndefined(value) {
  return !isUndefined(value);
}

/**
 * Update a set of fields, in order to find linked entity data.
 * will match any literal values in  the 'def' key to about fields
 * in any of the entities and return the related object instead of
 * the plain string.
 * @param fields Object representing the metadata fields
 * @param entities key(URI) value(JSON object) map of entity objects for this record
 * @return {Object[]} The fields with any entities as JSON objects
 */
function lookupEntities(fields, entities) {
  for (const key in fields) {
    setMatchingEntities(fields, key, entities);
  }
  return fields;
}

function setMatchingEntities(fields, key, entities) {
  // Only looks for entities in 'def'
  for (const [index, value] of (fields[key]['def'] || []).entries()) {
    if (entities[value]) {
      fields[key]['def'][index] = entities[value];
    }
  }
}

/**
 * Get the record data from the API
 * @param {string} europeanaId ID of Europeana record
 * @param {Object} params additional parameters sent to the API
 * @param {string} params.wskey API key
 * @return {Object} parsed record data
 */
function getRecord(europeanaId, params) {
  return axios.get(`https://api.europeana.eu/api/v2/record${europeanaId}.json`, {
    params
  })
    .then((response) => {
      return {
        record: parseRecordDataFromApiResponse(response),
        error: null
      };
    })
    .catch((error) => {
      throw apiError(error);
    });
}

/**
 * Tests whether a string is a valid Europeana record ID.
 * @param {string} value Value to test
 * @return {Boolean}
 */
export function isEuropeanaRecordId(value) {
  return /^\/[0-9]+\/[a-zA-Z0-9_]+$/.test(value);
}

const SIMILAR_ITEMS_FIELDS = new Map([
  ['what', { data: ['dcSubject', 'dcType'], boost: 0.8 }],
  ['who', { data: ['dcCreator'], boost: 0.5 } ],
  ['DATA_PROVIDER', { data: ['edmDataProvider'], boost: 0.2 } ]
]);

export function similarItemsQuery(about, data = {}) {
  const queryTerms = new Map;

  for (const [queryField, queryFieldOptions] of SIMILAR_ITEMS_FIELDS) {
    for (const dataField of queryFieldOptions.data) {
      if (data[dataField]) {
        queryTerms.set(queryField, (queryTerms.get(queryField) || []).concat(data[dataField]));
      }
    }
  }

  const fieldQueries = [];
  for (const [queryField, queryFieldTerms] of queryTerms) {
    const boost = SIMILAR_ITEMS_FIELDS.get(queryField).boost;
    const fieldQuery = `${queryField}:(` + queryFieldTerms.map((term) => {
      return '"' + escapeLuceneSpecials(term) + '"';
    }).join(' OR ') + `)^${boost}`;
    fieldQueries.push(fieldQuery);
  }

  if (fieldQueries.length === 0) return null;

  const query = '(' + fieldQueries.join(' OR ') + `) NOT europeana_id:"${about}"`;
  return query;
}

function escapeLuceneSpecials(string) {
  const specials = ['\\', '+', '-', '&', '|', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '/'];

  return specials.reduce((memo, special) => {
    memo = memo.replace(new RegExp(escapeRegExp(special), 'g'), `\\${special}`);
    return memo;
  }, string);
}

export default getRecord;
