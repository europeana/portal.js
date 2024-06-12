import { marked } from 'marked';

export default (text) => {
  return text ? marked.parse(text) : text;
};
