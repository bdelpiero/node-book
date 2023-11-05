const MODIFIER_METHODS = ["swap", "write", "fill"];

function createLazyBuffer(size) {
    // actual buffer
    let _buffer = null;

    const lazyBufferHandler = {
        get: (_, property) => {
            if (_buffer) {
                return typeof _buffer[property] === "function"
                    ? _buffer[property].bind(_buffer)
                    : _buffer[property];
            }

            if (!MODIFIER_METHODS.some(m => property.startsWith(m))) {
                console.warn("Attempting to use buffer before initialization");
                // returns dummy function so that the program doesn't crash
                //? is there a way to know if the property being accessed is callable?
                return () => {};
            }

            // first write. initialize buffer
            _buffer = Buffer.alloc(size);
            return _buffer[property].bind(_buffer);
        },
    };

    // empty object that intercepts each property access and delegates it to the actual buffer
    return new Proxy({}, lazyBufferHandler);
}

export { createLazyBuffer };
