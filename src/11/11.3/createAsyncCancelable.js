import { CancelError } from "./cancelError.js";

export function createAsyncCancelable(generatorFunction) {
	return function asyncCancelable(...args) {
		const generatorObject = generatorFunction(...args);
		let cancelRequested = false;

		function cancel() {
			cancelRequested = true;
		}

		// trigger executing generatorObject steps only when createPromise called
		const createPromise = () =>
			new Promise((resolve, reject) => {
				async function nextStep(prevResult) {
					if (cancelRequested) {
						return reject(new CancelError());
					}

					if (prevResult.done) {
						return resolve(prevResult.value);
					}

					try {
						nextStep(generatorObject.next(await prevResult.value));
					} catch (err) {
						try {
							nextStep(generatorObject.throw(err));
						} catch (err2) {
							reject(err2);
						}
					}
				}

				nextStep({});
			});

		// include original generatorObject
		// for allowing yielding operations in main generator function
    //
		// note to self: what he means here, at least this is my starting hypothesis, is that the generatorObject
		// of the nested cancelable will be "available" to the main generator
		// by doing this, the nested generator will yield the result of each of its async subroutines into
		// the main async cancelable (each yield inside the nested cancelable will be used to call nextStep inside the main cancelable)
		// so, when cancel is called on the main cancelable and it is in the midle of executing the nestedCancelable routines,
		// the cancelation will also affect the nestedCancelable
		return { createPromise, cancel, generatorObject };
	};
}
