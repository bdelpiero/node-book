export async function asyncMap(iterable, callback, concurrency) {
  const mapped = [];
  const iterableWithIndexes = iterable.map((el, i) => [el, i]);
  const stoppingPoint = iterableWithIndexes.length;
  let processed = 0;
  let processing = 0;

  return new Promise((resolve, reject) => {
    if (!iterableWithIndexes.length) {
      resolve([]);
    }

    function loop() {
      while (processing < concurrency && iterableWithIndexes.length) {
        processing++;
        const [element, index] = iterableWithIndexes.shift();
        callback(element)
          .then((val) => {
            processed++;
            processing--;
            mapped[index] = val;

            if (processed === stoppingPoint) {
              return resolve(mapped);
            }

            loop();
          })
          .catch(reject);
      }
    }

    loop();
  });
}
