// waits for the callback to return a truthy value
const waitFor = (callback, { name = 'unknown', delay = 100, retries = 20 } = {}) => {
  return new Promise((resolve, reject) => {
    const attempt = (counter = 0) => {
      if (callback()) {
        return resolve();
      } else if (counter >= retries) {
        return reject(new Error(`Gave up waiting for ${name}`));
      } else {
        return setTimeout(() => attempt(counter + 1), delay);
      }
    };
    return attempt();
  });
};

export default waitFor;
