const { url } = require('../config/nightwatch.conf.js').test_settings.default.globals;

const pages = {
  '"Hammerflügel" item page': `${url}/en/item/09102/_GNM_693983`,
  '"Het laatste avondmaal" item page': `${url}/en/item/90402/RP_P_OB_70_879`,
  '"The Milkmaid" item page': `${url}/en/item/90402/SK_A_2344`,
  '"The pride of Glencoe, song" item page': `${url}/en/item/2059213/data_sounds_455`,
  '"World War I" theme page': `${url}/en/search?qf=collection%3Aww1`,
  'account page': `${url}/en/account`,
  'blog page': `${url}/en/blog`,
  'collections page': `${url}/en/collections`,
  'data space page': `${url}/en/dataspace-culturalheritage`,
  '"Easter with art" blog page': `${url}/blog/easter-with-art-and-culture-5-activities-for-the-whole-family`,
  'English home page': `${url}/en`,
  'entity page': `${url}/en/collections/person/60305-william-shakespeare`,
  'exhibition chapter': `${url}/en/exhibitions/faces-of-europe/introduction`,
  'exhibition credits': `${url}/en/exhibitions/faces-of-europe/credits`,
  'exhibition fashion chapter': `${url}/en/exhibitions/past-to-present/fashion-reinterpretations-part-1`,
  'exhibition page': `${url}/en/exhibitions/faces-of-europe`,
  'exhibitions page': `${url}/en/exhibitions`,
  'Fashion theme search page': `${url}/en/search?qf=collection%3Afashion`,
  'first page of results': `${url}/en/search?page=1`,
  'gallery page': `${url}/en/galleries/9109-blue`,
  'gallery foyer page': `${url}/en/galleries`,
  'home page': `${url}/en`,
  'Newspapers theme search page': `${url}/en/search?qf=collection%3Anewspaper`,
  'item page with a responsive embedded video': `${url}/en/item/2021007/_SLS_1226`,
  'item page with a IIIF Image': `${url}/en/item/9200357/BibliographicResource_3000095247457`,
  'item page with a IIIF Presentation': `${url}/en/item/9200301/BibliographicResource_3000126341277`,
  'item page without isShownBy or hasView': `${url}/en/item/2051923/data_euscreenXL_102336`,
  'item page': `${url}/en/item/09102/_GNM_693983`,
  'search page': `${url}/en/search`,
  'search page with a search query': `${url}/en/search?query=art`,
  'share your data page': `${url}/en/share-your-data`,
  'user gallery page': `${url}/en/set/2`,
  'Swedish home page': `${url}/sv`,
  'topics listing page': `${url}/en/collections/topics`,
  'times listing page': `${url}/en/collections/times`,
  'static page': `${url}/en/about-us`
  // TODO: enable when linklist is actually present
  // 'static page with linklist': `${url}/en/rights`
};

module.exports = {
  pageUrl(pageName) {
    return pageName.startsWith('/') ? `${url}${pageName}` : pages[pageName];
  }
};
