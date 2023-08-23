import { marked } from 'marked';

export default {
  methods: {
    html(text) {
      return text ? marked.parse(text) : text;
    }
  }
};
