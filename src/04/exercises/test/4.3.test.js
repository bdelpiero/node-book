import path from "path";

import { fileURLToPath } from "url";
import { recursiveFind } from "../4.3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = ["notADir", "empty", "flat", "nested"].map(dir => path.join("find", dir));
const word = "asd";

test("should throw an error if invalid dir path", done => {
    function callback(error) {
        expect(error).toBeTruthy();
        done();
    }

    const dir = path.resolve(__dirname, paths[0]);
    recursiveFind(dir, word, callback);
});

test("should handle an empty dir", done => {
    function callback(error, files) {
        if (error) {
            done(error);
            return;
        }
        try {
            expect(files).toHaveLength(0);
            done();
        } catch (error) {
            done(error);
        }
    }

    const dir = path.resolve(__dirname, paths[1]);
    recursiveFind(dir, word, callback);
});

test("should handle dir with no nested dirs", done => {
    function callback(error, files) {
        if (error) {
            done(error);
            return;
        }
        try {
            expect(files).toHaveLength(2);
            done();
        } catch (error) {
            done(error);
        }
    }

    const dir = path.resolve(__dirname, paths[2]);
    recursiveFind(dir, word, callback);
});

test("should handle nested dirs", done => {
    function callback(error, files) {
        if (error) {
            done(error);
            return;
        }
        try {
            expect(files).toHaveLength(3);
            done();
        } catch (error) {
            done(error);
        }
    }

    const dir = path.resolve(__dirname, paths[3]);
    recursiveFind(dir, word, callback);
});
