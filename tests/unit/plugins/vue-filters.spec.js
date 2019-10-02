import Vue from 'vue';

require('../../../plugins/vue-filters');

describe('optimisedImageUrl', () => {
  const optimisedImageUrl = Vue.filter('optimisedImageUrl');

  context('when URL is a Contentful asset', () => {
    const imageUrl = '//images.ctfassets.net/image.jpg';

    it('appends optimisation parameters', () => {
      const optimised = optimisedImageUrl(imageUrl);
      optimised.should.startWith(imageUrl);
      optimised.should.endWith('?fm=jpg&fl=progressive&q=50');
    });
  });

  context('otherwise', () => {
    const imageUrl = 'http://www.example.org/image.jpg';

    it('returns URL as-is', () => {
      const optimised = optimisedImageUrl(imageUrl);
      optimised.should.eq(imageUrl);
    });
  });
});
