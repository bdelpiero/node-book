import axios from "axios";

// returns string of the form "baz=bar&foo=bar" with sorted keys
function _stringifyObj(obj, delimiter) {
    return Object.keys(obj)
        .sort()
        .map(key => `${key}=${obj[key]}`)
        .join(delimiter);
}

// params can be either a plain obj or an instance of URLSearchParams
// returns string of the form "baz=bar&foo=bar" with sorted keys
function _stringifyParams(params) {
    const obj = !(params instanceof URLSearchParams)
        ? params
        : Object.fromEntries(params.entries());
    return _stringifyObj(obj, "&");
}

function _getCacheKey(urlStr, options) {
    const url = new URL(urlStr);
    let cacheKey = url.host + url.pathname;
    const params = options.params || url.searchParams;
    const headers = options.headers;

    cacheKey += !params ? "" : `:${_stringifyParams(params)}`;
    cacheKey += !headers ? "" : `:${_stringifyObj(headers, ",")}`;

    console.log("Cache key: ", cacheKey);
    return cacheKey;
}

// TODO add cache ttl
function createAxiosCache(axios) {
    const cache = new Map();

    const useCache = async (cacheKey, fetcher) => {
        if (cache.get(cacheKey)) {
            console.log("Retrieving from cache...");
            const cachedData = cache.get(cacheKey);
            // Deserialize the cached data
            const response = JSON.parse(cachedData);
            return response;
        }

        // should add error handling?
        const response = await fetcher();
        // Serialize the response data and save it as a string in the cache
        const serializedResponse = JSON.stringify(response);
        cache.set(cacheKey, serializedResponse);

        return response;
    };

    const axiosCacheHandler = {
        get: (target, property) => {
            if (property === "get" || property === "head") {
                return async function (urlStr, options = {}) {
                    const cacheKey = _getCacheKey(urlStr, options);
                    const fetcher = async () => await target[property](urlStr, options);
                    return await useCache(cacheKey, fetcher);
                };
            }

            return target[property];
        },

        // In case axios is called as a function by the client axios(options)
        apply: async (target, thisArg, argumentsList) => {
            if (!argumentsList.length) {
                throw new Error("Improper usage of axios. Please provide an options parameter");
            }

            // Assume options is the first parameter
            const options = argumentsList[0];
            //! if options.url is absolute, then baseURL is ignored by axios
            const urlStr = options.baseURL ? options.baseURL + options.url : options.url;

            const cacheKey = _getCacheKey(urlStr, options);
            const fetcher = async () => await target.apply(thisArg, argumentsList);
            return await useCache(cacheKey, fetcher);
        },
    };

    return new Proxy(axios, axiosCacheHandler);
}

export default createAxiosCache(axios);
