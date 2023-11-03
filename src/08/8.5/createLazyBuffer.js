const MODIFIER_NAMES = ["swap", "write", "fill"];

function createLazyBuffer(size) {
    let buffer = {};

    const lazyBufferHandler = {
        get: (_, property) => {
            if (MODIFIER_NAMES.some(m => property.startsWith(m))) {
                return (...args) => {
                    if (!Object.keys(buffer).length) {
                        buffer = Buffer.alloc(size);
                    }
                    return buffer[property].apply(buffer, args);
                };
            }

            if (!buffer[property]) {
                console.warn("Attempting to use buffer before initialization");
                // is there a way to know if the property being accessed is callable
                return () => {};
            }

            return typeof buffer[property] === "function"
                ? (...args) => buffer[property].apply(buffer, args)
                : buffer[property];
        },
    };

    return new Proxy({}, lazyBufferHandler);
}

export { createLazyBuffer };
