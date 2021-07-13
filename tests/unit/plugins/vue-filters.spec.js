import Vue from 'vue';

require('@/plugins/vue-filters');

describe('Vue filters', () => {
  describe('optimisedImageUrl', () => {
    const optimisedImageUrl = Vue.filter('optimisedImageUrl');

    context('when URL is for a Contentful asset', () => {
      context('when content type is "image/jpeg"', () => {
        const imageUrl = '//images.ctfassets.net/image.jpg';
        const contentType = 'image/jpeg';

        it('appends JPEG optimisation parameters', () => {
          const optimised = optimisedImageUrl(imageUrl, contentType);
          optimised.should.startWith(imageUrl);
          optimised.should.endWith('?fm=jpg&fl=progressive&q=50');
        });
      });

      context('when content type is "image/png"', () => {
        const imageUrl = '//images.ctfassets.net/image.png';
        const contentType = 'image/png';

        it('returns URL as-is', () => {
          const optimised = optimisedImageUrl(imageUrl, contentType);
          optimised.should.eq(imageUrl);
        });
      });

      context('when content type is "image/gif"', () => {
        const imageUrl = '//images.ctfassets.net/image.gif';
        const contentType = 'image/gif';

        it('returns URL as-is', () => {
          const optimised = optimisedImageUrl(imageUrl, contentType);
          optimised.should.eq(imageUrl);
        });
      });

      it('applies width and height options', () => {
        const imageUrl = '//images.ctfassets.net/image.png';
        const contentType = 'image/png';
        const options = { width: 200, height: 150 };

        const optimised = optimisedImageUrl(imageUrl, contentType, options);
        optimised.should.startWith(imageUrl);
        optimised.should.endWith(`?w=${options.width}&h=${options.height}`);
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

  describe('stripMarkdown', () => {
    const stripMarkdown = Vue.filter('stripMarkdown');

    context('when the text is plain', () => {
      const textBefore = 'Contains only plain text.';

      it('returns the text as is', () => {
        const result = stripMarkdown(textBefore);
        result.should.eq('Contains only plain text.');
      });
    });

    context('when the text contains markdown', () => {
      const textBefore = 'Contains _markdown_ with [a link](http://example.org)!';

      it('returns the text as plain text', () => {
        const result = stripMarkdown(textBefore);
        result.should.eq('Contains markdown with a link!');
      });
    });

    context('when the text contains html', () => {
      const textBefore = '<p>Contains <em>HTML</em> with <a href="http://example.org">a link</a>!</p>';

      it('returns the text as plain text', () => {
        const result = stripMarkdown(textBefore);
        result.should.eq('Contains HTML with a link!');
      });
    });

    context('when passing in the a tag as an option to remove only links', () => {
      const tags = ['a'];
      context('when the text is plain', () => {
        const textBefore = 'Contains only plain text.';

        it('returns the text wrapped in a "<p>" tag ', () => {
          const result = stripMarkdown(textBefore, tags);
          result.should.eq('<p>Contains only plain text.</p>');
        });
      });

      context('when the text contains markdown', () => {
        const textBefore = 'Contains _markdown_ with [a link](http://example.org)!';

        it('returns the text as plain text', () => {
          const result = stripMarkdown(textBefore, tags);
          result.should.eq('<p>Contains <em>markdown</em> with a link!</p>');
        });
      });

      context('when the text contains html', () => {
        const textBefore = '<p>Contains <em>HTML</em> with <a href="http://example.org">a link</a>!</p>';

        it('returns the text as plain text', () => {
          const result = stripMarkdown(textBefore, tags);
          result.should.eq('<p>Contains <em>HTML</em> with a link!</p>');
        });
      });
    });
  });

  describe('urlWithProtocol', () => {
    const urlWithProtocol = Vue.filter('urlWithProtocol');

    context('when the URL begins with //', () => {
      it('prepends https:', () => {
        const url = '//example.org/';

        const withProtocol = urlWithProtocol(url);

        withProtocol.should.eq('https://example.org/');
      });
    });

    context('when the URL begins with http:', () => {
      it('is returned as-is', () => {
        const url = 'http://example.org/';

        const withProtocol = urlWithProtocol(url);

        withProtocol.should.eq('http://example.org/');
      });
    });
  });
});
