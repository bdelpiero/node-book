export function promiseAll(arr) {
  const promises = arr.map((x) => Promise.resolve(x));
  const resolved = [];

  if (!arr.length) {
    return Promise.resolve(resolved);
  }

  let resolvedCount = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((promise, i) => {
      promise
        .then((val) => {
          resolved[i] = val;
          if (++resolvedCount === promises.length) {
            resolve(resolved);
          }
        })
        .catch(reject);
    });
  });
}
