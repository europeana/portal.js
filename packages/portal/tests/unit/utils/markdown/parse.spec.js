import parseMarkdown from '@/utils/markdown/parse.js';

describe('utils/markdown/parse.js', () => {
  describe('parseMarkdown', () => {
    it('parses markdown into html', () => {
      const markdown = '# Heading 1';

      const html = parseMarkdown(markdown);

      expect(html).toContain('<h1 id="heading-1">Heading 1</h1>');
    });
  });
});
