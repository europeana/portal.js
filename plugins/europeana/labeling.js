const fieldLabels = {
  default: {
    dcContributor: 'Contributors',
    dcCreator: 'Creators',
    dcDescription: 'Description',
    dcTitle: 'Title',
    dcType: 'Type of object',
    dctermsCreated: 'Creation date',
    edmCountry: 'Providing country',
    edmDataProvider: 'Providing institution',
    edmRights: 'License of the media in this record (unless otherwise specified)'
  },
  webResource: {
    edmRights: 'License for this media resource'
  }
};

function lookupFromContext(key, context = 'default') {
  context = fieldLabels.hasOwnProperty(context) ? fieldLabels[context] : fieldLabels['default'];
  return context.hasOwnProperty(key) ? context[key] : null;
}

/**
 * Lookup the label for the provided metadata field key
 * @param {string} key for metadata field
 * @param {Object} options
 * @return {string} value to display, if not found returns the original key
 */
function fieldLabel(key, options = {}) {
  let label;
  if (options.hasOwnProperty('context')) {
    label = lookupFromContext(key, options['context']);
  }
  if (!label) {
    label = lookupFromContext(key);
  }
  return label ? label : key;
}

export default fieldLabel;
