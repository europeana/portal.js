// get jest-transform-graphql working with jest > 28
// courtesy https://github.com/remind101/jest-transform-graphql/issues/13#issuecomment-1367564978
// and https://github.com/remind101/jest-transform-graphql/issues/13#issuecomment-2756031082
import { process as upstreamProcess } from 'jest-transform-graphql';

const process = (...args) => {
  const code = upstreamProcess(...args);
  return { code };
};

const transformer = { process };
export default transformer;
