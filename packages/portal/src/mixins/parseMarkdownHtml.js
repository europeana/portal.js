import { marked } from 'marked';

export default {
  methods: {
    parseMarkdownHtml(text) {
      return text ? marked.parse(text) : text;
    }
  }
};
