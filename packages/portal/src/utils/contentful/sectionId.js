import kebabCase from 'lodash/kebabCase';

export default (section) => {
  return kebabCase(section.nameEN || section.headlineEN);
};
