export const contentfulEntryUrl = (entry) => {
  let urlPrefix;

  switch (entry['__typename']) {
    case 'ExhibitionPage':
      urlPrefix = '/exhibitions';
      break;
    case 'Story':
      urlPrefix = '/stories';
      break;
  }

  return `${urlPrefix}/${entry.identifier}`;
};
