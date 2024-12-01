/**
 * Jest configuration file, see link for more information:
 * https://jestjs.io/docs/configuration
 */

// TODO: try to get the testing framwork to work with ESM modules, or if not
//  then use commonjs modules for the tests, and esm for the source code

module.exports = {
    transform: {
        // transform commonjs modules to es modules so jest can understand them
        '^.+\\.cjs$': 'babel-jest',
        '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'node',
    testMatch: [
        '**/__tests__/**/*.test.{js,cjs}',
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'text', 'lcov', 'clover'],
    collectCoverageFrom: ['src/**/*.js'],
}