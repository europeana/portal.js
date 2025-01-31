const { url } = require('../config/nightwatch.conf.js').test_settings.default.globals;

const pages = {
  '"Hammerflügel" item page': `${url}/en/item/09102/_GNM_693983`,
  '"Het laatste avondmaal" item page': `${url}/en/item/90402/RP_P_OB_70_879`,
  '"The Milkmaid" item page': `${url}/en/item/90402/SK_A_2344`,
  '"World War I" theme page': `${url}/en/search?qf=collection%3Aww1`,
  'account page': `${url}/en/account`,
  'collections page': `${url}/en/collections`,
  'data space page': `${url}/en/dataspace-culturalheritage`,
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
  'newspaper entity page': `${url}/en/collections/topic/18-newspaper`,
  'immersive story page': `${url}/en/stories/melitta-bentz-the-woman-who-invented-the-coffee-filter`,
  'item page with a IIIF Image': `${url}/en/item/9200357/BibliographicResource_3000095247457`,
  'item page with a IIIF Presentation': `${url}/en/item/9200301/BibliographicResource_3000126341277`,
  'item page with a responsive embedded video': `${url}/en/item/2021007/_SLS_1226`,
  'item page with audio media': `${url}/en/item/937/Culturalia_e4c6f6cd_e2fd_4bb1_88d4_cf4744b754ff`,
  'item page with IIIF annotations': `${url}/en/item/9200338/BibliographicResource_3000127242400`,
  'item page with mixed media': `${url}/en/item/09102/_GNM_693983`,
  'item page without isShownBy or hasView': `${url}/en/item/2051923/data_euscreenXL_102336`,
  'search page': `${url}/en/search`,
  'search page with a search query': `${url}/en/search?query=art`,
  'share your collections page': `${url}/en/share-your-collections`,
  'static page': `${url}/en/about-us`,
  'stories page': `${url}/en/stories`,
  'Swedish home page': `${url}/sv`,
  'topics listing page': `${url}/en/collections/topics`,
  'times listing page': `${url}/en/collections/times`,
  'static page with linklist': `${url}/en/rights`,
  'story page': `${url}/en/stories/nilde-iotti`,
  'user gallery page': `${url}/en/set/2`
};

module.exports = {
  pageUrl(pageName) {
    return pageName.startsWith('/') ? `${url}${pageName}` : pages[pageName];
  }
};
