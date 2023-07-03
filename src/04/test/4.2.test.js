import { jest } from "@jest/globals";
import fs from "fs";
import { listNestedFiles } from "../4.2";

const mockFiles = {
    "/flat": [
        { name: "1.txt", isDirectory: () => false },
        { name: "2.txt", isDirectory: () => false },
        { name: "3.txt", isDirectory: () => false },
    ],
    "/nested": [
        { name: "1", isDirectory: () => true },
        { name: "2", isDirectory: () => true },
        { name: "3.txt", isDirectory: () => false },
    ],
    "/nested/1": [
        { name: "1.txt", isDirectory: () => false },
        { name: "2.txt", isDirectory: () => false },
    ],
    "/nested/2": [
        { name: "3", isDirectory: () => true },
        { name: "4.txt", isDirectory: () => false },
    ],
    "/nested/2/3": [{ name: "5.txt", isDirectory: () => false }],
};

describe("listNestedFiles", () => {
    let spy;

    beforeEach(() => {
        spy = jest.spyOn(fs, "readdir");
    });

    afterEach(() => {
        spy.mockRestore();
    });

    test("should list files in flat directory", done => {
        spy.mockImplementation((dir, options, cb) => {
            cb(null, mockFiles[dir]);
        });

        listNestedFiles("/flat", (_, files) => {
            expect(files).toEqual(['/flat/1.txt', '/flat/2.txt', '/flat/3.txt']);
            done();
        });
    });

    test("should handle nested directories", done => {
        spy.mockImplementation((dir, options, cb) => {
            cb(null, mockFiles[dir]);
        });

        listNestedFiles("/nested", (_, files) => {
            expect(files.sort()).toEqual([
                '/nested/1/1.txt', 
                '/nested/1/2.txt', 
                '/nested/2/3/5.txt', 
                '/nested/2/4.txt', 
                '/nested/3.txt'
            ].sort());
            done();
        });
    });

    test("should handle readdir errors", done => {
        spy.mockImplementation((dir, options, cb) => {
            cb(new Error("Test Error"));
        });

        listNestedFiles("/flat", (err, files) => {
            expect(err).toBeInstanceOf(Error);
            expect(err).toHaveProperty('message', 'Test Error');
            done();
        });
    });
});
