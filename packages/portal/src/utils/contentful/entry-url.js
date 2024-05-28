export const contentfulEntryUrl = (entry) => {
  let urlPrefix;

  switch (entry['__typename']) {
    case 'BlogPosting':
      urlPrefix = '/blog';
      break;
    case 'ExhibitionPage':
      urlPrefix = '/exhibitions';
      break;
    case 'Story':
      urlPrefix = '/stories';
      break;
  }

  return `${urlPrefix}/${entry.identifier}`;
};
