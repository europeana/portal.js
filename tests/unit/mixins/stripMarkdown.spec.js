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
      describe('when the text is plain', () => {
        const textBefore = 'Contains only plain text.';

        it('returns the text as is', () => {
          const result = factory().vm.stripMarkdown(textBefore);
          expect(result).toBe('Contains only plain text.');
        });
      });

      describe('when the text contains markdown', () => {
        const textBefore = 'Contains _markdown_ with [a link](http://example.org)!';

        it('returns the text as plain text', () => {
          const result = factory().vm.stripMarkdown(textBefore);
          expect(result).toBe('Contains markdown with a link!');
        });
      });

      describe('when the text contains html', () => {
        const textBefore = '<p>Contains <em>HTML</em> with <a href="http://example.org">a link</a>!</p>';

        it('returns the text as plain text', () => {
          const result = factory().vm.stripMarkdown(textBefore);
          expect(result).toBe('Contains HTML with a link!');
        });
      });

      describe('when passing in the a tag as an option to remove only links', () => {
        const tags = ['a'];
        describe('when the text is plain', () => {
          const textBefore = 'Contains only plain text.';

          it('returns the text wrapped in a "<p>" tag ', () => {
            const result = factory().vm.stripMarkdown(textBefore, tags);
            expect(result).toBe('<p>Contains only plain text.</p>');
          });
        });

        describe('when the text contains markdown', () => {
          const textBefore = 'Contains _markdown_ with [a link](http://example.org)!';

          it('returns the text as plain text', () => {
            const result = factory().vm.stripMarkdown(textBefore, tags);
            expect(result).toBe('<p>Contains <em>markdown</em> with a link!</p>');
          });
        });

        describe('when the text contains html', () => {
          const textBefore = '<p>Contains <em>HTML</em> with <a href="http://example.org">a link</a>!</p>';

          it('returns the text as plain text', () => {
            const result = factory().vm.stripMarkdown(textBefore, tags);
            expect(result).toBe('<p>Contains <em>HTML</em> with a link!</p>');
          });
        });
      });
    });
  });
});
