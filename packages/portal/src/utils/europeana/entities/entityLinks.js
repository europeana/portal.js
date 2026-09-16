import { organizationEntityNativeName } from './organizations.js';

export const collectionTitle = (collection) => {
  let title;

  const organizationNativePrefLabel = organizationEntityNativeName(collection);
  if (organizationNativePrefLabel) {
    title = organizationNativePrefLabel;
  } else if (collection.prefLabel) {
    title = collection.prefLabel;
  } else {
    title = collection.name;
  }

  return title;
};
