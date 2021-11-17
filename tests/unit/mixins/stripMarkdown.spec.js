import { createLocalVue, shallowMount } from '@vue/test-utils';

import mixin from '@/mixins/stripMarkdown';

const component = {
  template: '<div/>',
  mixins: [mixin]
};

const factory = () => shallowMount(component, {
  localVue: createLocalVue()
});

describe('mixins/stripMarkdown', () => {
  describe('methods', () => {
    describe('stripMarkdown', () => {
      context('when the text is plain', () => {
        const textBefore = 'Contains only plain text.';

        it('returns the text as is', () => {
          const result = factory().vm.stripMarkdown(textBefore);
          result.should.eq('Contains only plain text.');
        });
      });

      context('when the text contains markdown', () => {
        const textBefore = 'Contains _markdown_ with [a link](http://example.org)!';

        it('returns the text as plain text', () => {
          const result = factory().vm.stripMarkdown(textBefore);
          result.should.eq('Contains markdown with a link!');
        });
      });

      context('when the text contains html', () => {
        const textBefore = '<p>Contains <em>HTML</em> with <a href="http://example.org">a link</a>!</p>';

        it('returns the text as plain text', () => {
          const result = factory().vm.stripMarkdown(textBefore);
          result.should.eq('Contains HTML with a link!');
        });
      });

      context('when passing in the a tag as an option to remove only links', () => {
        const tags = ['a'];
        context('when the text is plain', () => {
          const textBefore = 'Contains only plain text.';

          it('returns the text wrapped in a "<p>" tag ', () => {
            const result = factory().vm.stripMarkdown(textBefore, tags);
            result.should.eq('<p>Contains only plain text.</p>');
          });
        });

        context('when the text contains markdown', () => {
          const textBefore = 'Contains _markdown_ with [a link](http://example.org)!';

          it('returns the text as plain text', () => {
            const result = factory().vm.stripMarkdown(textBefore, tags);
            result.should.eq('<p>Contains <em>markdown</em> with a link!</p>');
          });
        });

        context('when the text contains html', () => {
          const textBefore = '<p>Contains <em>HTML</em> with <a href="http://example.org">a link</a>!</p>';

          it('returns the text as plain text', () => {
            const result = factory().vm.stripMarkdown(textBefore, tags);
            result.should.eq('<p>Contains <em>HTML</em> with a link!</p>');
          });
        });
      });
    });
  });
});
