import { promiseAll } from "../5.1";

describe("promiseAll", () => {
    it("should resolve with an array of resolved values in the correct order when all promises resolve", async () => {
        const promises = [
            new Promise(resolve => setTimeout(resolve, 300, "foo")),
            new Promise(resolve => setTimeout(resolve, 100, "bar")),
            new Promise(resolve => setTimeout(resolve, 200, "baz")),
            "qux"
        ];
        await expect(promiseAll(promises)).resolves.toEqual(["foo", "bar", "baz", "qux"]);
    });

    it("should correctly handle an array containing both promises and regular values", async () => {
        const valuesAndPromises = [
            new Promise(resolve => setTimeout(resolve, 300, "foo")),
            "qux",
            new Promise(resolve => setTimeout(resolve, 100, "bar")),
        ];
        await expect(promiseAll(valuesAndPromises)).resolves.toEqual(["foo", "qux", "bar"]);
    });

    it("should reject when any promise rejects", async () => {
        const promises = [
            Promise.resolve("foo"),
            Promise.reject(new Error("rejected")),
            Promise.resolve("baz"),
        ];
        await expect(promiseAll(promises)).rejects.toThrow("rejected");
    });

    it("should resolve with an empty array when given an empty array", async () => {
        const promises = [];
        await expect(promiseAll(promises)).resolves.toEqual([]);
    });
});
