/**
 * Util: Set a value if it is not undefined, otherwise use a fallback value
 * JSDoc: https://jsdoc.app/tags-type.html
 * @param value
 * @param fallback
 * @returns {*}
 */
export const setValue = (value, fallback) => {
    return value === undefined ? fallback : value;
}