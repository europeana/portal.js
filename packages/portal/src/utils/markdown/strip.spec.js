import stripMarkdown from '@/utils/markdown/strip.js';

describe('utils/markdown/strip.js', () => {
  describe('stripMarkdown', () => {
    describe('when the text is plain', () => {
      const textBefore = 'Contains only plain text.';

      it('returns the text as is', () => {
        const result = stripMarkdown(textBefore);
        expect(result).toBe('Contains only plain text.');
      });
    });

    describe('when the text contains markdown', () => {
      const textBefore = 'Contains _markdown_ with [a link](http://example.org)!';

      it('returns the text as plain text', () => {
        const result = stripMarkdown(textBefore);
        expect(result).toBe('Contains markdown with a link!');
      });
    });

    describe('when the text contains html', () => {
      const textBefore = '<p>Contains <em>HTML</em> with <a href="http://example.org">a link</a>!</p>';

      it('returns the text as plain text', () => {
        const result = stripMarkdown(textBefore);
        expect(result).toBe('Contains HTML with a link!');
      });
    });

    describe('when passing in the a tag as an option to remove only links', () => {
      const tags = ['a'];
      describe('when the text is plain', () => {
        const textBefore = 'Contains only plain text.';

        it('returns the text wrapped in a "<p>" tag', () => {
          const result = stripMarkdown(textBefore, tags);
          expect(result).toBe('<p>Contains only plain text.</p>');
        });
      });

      describe('when the text contains markdown', () => {
        const textBefore = 'Contains _markdown_ with [a link](http://example.org)!';

        it('returns the text as plain text', () => {
          const result = stripMarkdown(textBefore, tags);
          expect(result).toBe('<p>Contains <em>markdown</em> with a link!</p>');
        });
      });

      describe('when the text contains html', () => {
        const textBefore = '<p>Contains <em>HTML</em> with <a href="http://example.org">a link</a>!</p>';

        it('returns the text as plain text', () => {
          const result = stripMarkdown(textBefore, tags);
          expect(result).toBe('<p>Contains <em>HTML</em> with a link!</p>');
        });
      });
    });
  });
});
