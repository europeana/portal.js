import uniq from 'lodash/uniq';

import { errorHandler } from '../index.js';
import graphql from './graphql.js';

const fetchStories = async(axios, options = {}) => {
  const defaultOptions = {
    limit: 24,
    page: 1,
    locale: 'en-GB',
    preview: false,
    tags: null
  };
  const localOptions = { ...defaultOptions, ...options };

  const response = {};
  const selectedTags = localOptions.tags?.split(',') || [];
  let stories;

  // Fetch minimal data for all stories to support ordering by datePublished
  // and filtering by categories.
  const storyIdsVariables = {
    locale: localOptions.locale,
    preview: localOptions.preview
  };
  const storyIdsResponse = await graphql(axios, 'storiesMinimal', storyIdsVariables);
  stories = [
    storyIdsResponse.data.data.blogPostingCollection.items,
    storyIdsResponse.data.data.exhibitionPageCollection.items
  ].flat();

  // Filter by categories
  if (selectedTags.length > 0) {
    stories = stories.filter((story) => {
      const storyTags = story.cats.items.map((cat) => cat?.id);
      return selectedTags.every((tag) => storyTags.includes(tag));
    });
  }
  const filteredTags = uniq(stories.map((story) => story.cats.items.filter((cat) => !!cat).map((cat) => cat.id)).flat());

  // Order by date published
  stories = stories.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());

  // Paginate
  const total = stories.length;
  const page = localOptions.page || 1;
  const sliceFrom = (page - 1) * localOptions.limit;
  const sliceTo = sliceFrom + localOptions.limit;
  const storySysIds = stories.slice(sliceFrom, sliceTo).map(story => story.sys.id);

  // Fetch full data for display of page of stories
  const storiesVariables = {
    locale: localOptions.locale,
    preview: localOptions.preview,
    limit: localOptions.limit,
    ids: storySysIds
  };
  const storiesResponse = await graphql(axios, 'storiesBySysId', storiesVariables);
  stories = [
    storiesResponse.data.data.blogPostingCollection.items,
    storiesResponse.data.data.exhibitionPageCollection.items
  ].flat();
  response.stories = storySysIds.map((sysId) => stories.find((story) => story.sys.id === sysId)).filter(Boolean);

  return {
    total,
    items: stories,
    tags: filteredTags
  };
};

export const middleware = (axios, req, res) => {
  const options = req.body;

  fetchStories(axios, options)
    .then((response) => res.json(response))
    .catch((error) => {
      if (error.response) {
        error.message = error.response.data.errors?.[0]?.message || error.message;
      }
      errorHandler(res, error);
    });
};

export default fetchStories;
