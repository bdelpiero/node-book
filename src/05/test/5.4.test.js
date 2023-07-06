import { asyncMap } from "../5.4";

describe("Async Map with Concurrency Limit", () => {
    test("Should process an empty array correctly", async () => {
        const array = [];
        const limit = 2;

        const expected = [];
        const result = await asyncMap(array, () => {}, limit);
        expect(result).toEqual(expected);
    });

    test("Should process an array of numbers correctly", async () => {
        const array = [1, 2, 3, 4, 5];
        const callback = async num => num * 2;
        const limit = 2;

        const expected = [2, 4, 6, 8, 10];
        const result = await asyncMap(array, callback, limit);
        expect(result).toEqual(expected);
    });

    it("Should handle promises in the callback", async () => {
        const array = [1, 2, 3, 4, 5];
        const callback = async num => {
            return new Promise(resolve => setTimeout(() => resolve(num * 2), 1000));
        };
        const limit = 2;

        const expected = [2, 4, 6, 8, 10];
        const result = await asyncMap(array, callback, limit);
        expect(result).toEqual(expected);
    });

    it("Should process the array up to the specified concurrency limit", async () => {
        const array = Array(100)
            .fill(0)
            .map((_, index) => index + 1);
        const callback = async num => {
            return new Promise(resolve => setTimeout(() => resolve(num * 2), 100));
        };
        const limit = 10;

        const expected = array.map(num => num * 2);
        const result = await asyncMap(array, callback, limit);
        expect(result).toEqual(expected);
    });
});
