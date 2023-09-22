
export const FIELD_TYPE_FULLTEXT = 'fulltext';
export const FIELD_TYPE_STRING = 'string';
export const FIELD_TYPE_TEXT = 'text';

const FIELD_SUGGEST_AGENT = 'agent';
const FIELD_SUGGEST_TIMESPAN = 'timespan';
const FIELD_SUGGEST_CONCEPT = 'concept';
const FIELD_SUGGEST_PLACE = 'place';

export const advancedSearchFields = [
  { name: 'fulltext', type: FIELD_TYPE_FULLTEXT },
  { name: 'proxy_dc_contributor', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_AGENT },
  { name: 'proxy_dc_coverage', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_PLACE },
  { name: 'proxy_dc_creator', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_AGENT },
  { name: 'proxy_dc_date', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_TIMESPAN },
  { name: 'proxy_dc_description', type: FIELD_TYPE_TEXT },
  { name: 'proxy_dc_format', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_CONCEPT },
  { name: 'proxy_dc_identifier', type: FIELD_TYPE_STRING },
  { name: 'proxy_dc_publisher', type: FIELD_TYPE_TEXT },
  { name: 'proxy_dc_rights', type: FIELD_TYPE_STRING },
  { name: 'proxy_dc_source', type: FIELD_TYPE_STRING },
  { name: 'proxy_dc_subject', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_CONCEPT },
  { name: 'proxy_dc_title', type: FIELD_TYPE_TEXT },
  { name: 'proxy_dc_type', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_CONCEPT },
  { name: 'proxy_dcterms_alternative', type: FIELD_TYPE_STRING },
  { name: 'proxy_dcterms_created', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_TIMESPAN },
  { name: 'proxy_dcterms_hasPart', type: FIELD_TYPE_STRING },
  { name: 'proxy_dcterms_isPartOf', type: FIELD_TYPE_STRING },
  { name: 'proxy_dcterms_issued', type: FIELD_TYPE_STRING },
  { name: 'proxy_dcterms_medium', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_CONCEPT },
  { name: 'proxy_dcterms_provenance', type: FIELD_TYPE_STRING },
  { name: 'proxy_dcterms_spatial', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_PLACE },
  { name: 'proxy_dcterms_temporal', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_TIMESPAN },
  { name: 'proxy_edm_currentLocation', type: FIELD_TYPE_STRING },
  { name: 'proxy_edm_hasMet', type: FIELD_TYPE_STRING },
  { name: 'proxy_edm_isRelatedTo', type: FIELD_TYPE_STRING },
  { name: 'what', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_CONCEPT, aggregated: true },
  { name: 'when', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_TIMESPAN, aggregated: true },
  { name: 'where', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_PLACE, aggregated: true },
  { name: 'who', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_AGENT, aggregated: true },
  { name: 'YEAR', type: FIELD_TYPE_STRING }
];

export const advancedSearchFieldsForEntityLookUp = advancedSearchFields.filter(field => field.suggestEntityType && !field.aggregated);
