import pick from 'lodash/pick.js';

export default (data, keys) => {
  if (!Array.isArray(data)) {
    return data;
  }

  return data.map(item => pick(item, keys));
};
