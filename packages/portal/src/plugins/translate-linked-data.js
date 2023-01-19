export default ({ i18n }, inject) => {
  const translateLinkedData = (graph) => {
    if (!graph || graph.length === 0) {
      return graph;
    }

    const strategies = [
      i18n.locale,
      (i18n.locale !== 'en') && 'en',
      graph[0]['@language']
    ];

    let nodes;

    while (!nodes && strategies.length > 0) {
      const lang = strategies.shift();
      if (lang) {
        nodes = graph.filter((node) => node['@language'] === lang);
      }
    }

    return nodes;
  };

  inject('tld', translateLinkedData);
};
