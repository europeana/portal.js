import { marked } from 'marked';

const htmlRemovalPatternsFromTags = (tags) => {
  return [/\n$/].concat(tags.map((tag) => new RegExp(`</?${tag}.*?>`, 'gi')));
};

export const parseMarkdownHtml = (text) => {
  return text ? marked.parse(text) : text;
};

/**
 * Strip markdown from text.
 * This method FIRST converts markdown to HTML, then removes HTML tags.
 * WARNING: This also means any HTML tags already present before will be stripped.
 *
 * As an optional parameter specific HTML tag names can be supplied. In which case,
 * only these will be removed.
 * @param {string} text String containing mark1down
 * @param {string[]} tags the HTML tags to be removed.
 * @return {String} text value with HTML breaks
 */
export const stripMarkdown = (text, tags = ['']) => {
  text = marked.parse(text); // Marked adds newlines to the end of the string, and wraps it in a <p> tag.
  for (const pattern of htmlRemovalPatternsFromTags(tags)) {
    text = text.replace(pattern, '');
  }
  return text;
};
