import merge, { emptyTarget } from 'deepmerge';

/**
 * See: https://github.com/TehShrike/deepmerge#arraymerge-example-combine-arrays
 */
export function combineMerge(target, source, options) {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.isMergeableObject(item) ? merge(emptyTarget(item), item, options) : item;
    } else if (options.isMergeableObject(item)) {
      destination[index] = merge(target[index], item, options);
    } else if (target.indexOf(item) === -1) { // Only add values not yet present
      destination.push(item);
    }
  });
  return destination;
}
