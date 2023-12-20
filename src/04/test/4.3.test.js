import { jest } from "@jest/globals";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";
import { recursiveFind } from "../4.3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = ["notADir", "empty", "flat", "nested"].map((dir) =>
  path.join("find", dir),
);
const word = "asd";

const mockFiles = {
  "/empty": [],
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

const mockFileData = {
  "/flat/1.txt": "asdfsdfa",
  "/flat/2.txt": "ouisduf",
  "/flat/3.txt": "asd",
  "/nested/3.txt": "asd",
  "/nested/1/1.txt": "asd",
  "/nested/1/2.txt": "ffdfdfe",
  "/nested/2/4.txt": "aster",
  "/nested/2/3/5.txt": "asdjksadfj",
};

const WORD = "asd";

describe("listNestedFiles", () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(fs, "readdir");
  });

  afterEach(() => {
    spy.mockRestore();
  });

  test("should handle an empty dir", (done) => {
    jest.spyOn(fs, "readdir").mockImplementation((dir, options, cb) => {
      cb(null, mockFiles[dir]);
    });

    jest.spyOn(fs, "readFile").mockImplementation((path, options, cb) => {
      if (mockFileData[path]) {
        cb(null, mockFileData[path]);
      } else {
        cb(new Error(`ENOENT: no such file or directory, open '${path}'`));
      }
    });

    recursiveFind("/empty", WORD, (_, files) => {
      expect(files).toHaveLength(0);
      done();
    });
  });

  test("should handle a flat dir", (done) => {
    jest.spyOn(fs, "readdir").mockImplementation((dir, options, cb) => {
      cb(null, mockFiles[dir]);
    });

    jest.spyOn(fs, "readFile").mockImplementation((path, cb) => {
      if (mockFileData[path]) {
        // console.log(path)
        cb(null, mockFileData[path]);
      } else {
        cb(new Error(`ENOENT: no such file or directory, open '${path}'`));
      }
    });

    recursiveFind("/flat", WORD, (_, files) => {
      expect(files).toHaveLength(2);
      done();
    });
  });

  test("should handle nested dirs", (done) => {
    jest.spyOn(fs, "readdir").mockImplementation((dir, options, cb) => {
      cb(null, mockFiles[dir]);
    });

    jest.spyOn(fs, "readFile").mockImplementation((path, cb) => {
      if (mockFileData[path]) {
        cb(null, mockFileData[path]);
      } else {
        cb(new Error(`ENOENT: no such file or directory, open '${path}'`));
      }
    });

    recursiveFind("/nested", WORD, (_, files) => {
      expect(files).toHaveLength(3);
      done();
    });
  });
});
