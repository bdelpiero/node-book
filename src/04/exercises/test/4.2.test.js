import path from "path";
import {jest} from '@jest/globals'

import { fileURLToPath } from "url";
import { listNestedFiles } from "../4.2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

beforeEach(() => jest.resetModules());
test('should handle an empty dir', done => {
    function callback(error, files) {
      if (error) {
        done(error);
        return;
      }
      try {
        expect(files).toHaveLength(0)
        done();
      } catch (error) {
        done(error);
      }
    }
    
    const dir = path.resolve(__dirname, "case1");
   listNestedFiles(dir, callback);
});
  
test('should handle dir with no nested dirs', done => {
    function callback(error, files) {
      if (error) {
        done(error);
        return;
      }
      try {
        expect(files).toHaveLength(3)
        done();
      } catch (error) {
        done(error);
      }
    }
    
    const dir = path.resolve(__dirname, "case2");
   listNestedFiles(dir, callback);
});

test('should handle nested dirs', done => {
    function callback(error, files) {
      if (error) {
        done(error);
        return;
      }
      try {
        console.log(files)
        expect(files).toHaveLength(8)
        done();
      } catch (error) {
        done(error);
      }
    }
    
    const dir = path.resolve(__dirname, "case3");
   listNestedFiles(dir, callback);
});
