import path from "path";
import { fileURLToPath } from "url";
import { listNestedFiles } from "../4.2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = ["notADir", "empty", "flat", "nested"].map(dir => path.join("list", dir))

test("should throw an error if invalid dir path", done => {
    function callback(error) {
        expect(error).toBeTruthy();
        done();
    }

    const dir = path.resolve(__dirname, paths[0]);
    listNestedFiles(dir, callback);
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
    listNestedFiles(dir, callback);
});

test("should handle dir with no nested dirs", done => {
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

    const dir = path.resolve(__dirname, paths[2]);
    listNestedFiles(dir, callback);
});

test("should handle nested dirs", done => {
    function callback(error, files) {
        if (error) {
            done(error);
            return;
        }
        try {
            expect(files).toHaveLength(8);
            done();
        } catch (error) {
            done(error);
        }
    }

    const dir = path.resolve(__dirname, paths[3]);
    listNestedFiles(dir, callback);
});
