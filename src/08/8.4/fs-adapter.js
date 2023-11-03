import { resolve } from "path";

export function createFSAdapter() {
    const map = new Map();

    return {
        readFile(filename, options = {}, callback) {
            if (typeof options === "function") {
                // if options is a function, assume it is the callback (no options passed)
                callback = options;
                options = {};
            } else if (typeof options === "string") {
                options = { encoding: options };
            }

            process.nextTick(() => {
                const content = map.get(resolve(filename));
                if (!content) {
                    const err = new Error(`ENOENT, open "${filename}"`);
                    err.code = "ENOENT";
                    err.errno = 34;
                    err.path = filename;
                    return callback && callback(err);
                }

                return callback && callback(null, content.toString(options.encoding));
            });
        },

        // TODO should write to the in memory object
        writeFile(filename, contents, options = {}, callback) {
            if (typeof options === "function") {
                // if options is a function, assume it is the callback (no options passed)
                callback = options;
                options = {};
            } else if (typeof options === "string") {
                options = { encoding: options };
            }

            process.nextTick(() => {
                try {
                    map.set(resolve(filename), Buffer.from(contents, options.encoding));
                    return callback && callback();
                } catch (e) {
                    return callback && callback(e);
                }
            });
        },
    };
}
