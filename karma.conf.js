/* eslint-disable no-undef */
const {createDefaultConfig} = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = (config) => {
    config.set(
        merge(createDefaultConfig(config), {
            files: [
                // runs all files ending with .test in the test folder,
                // can be overwritten by passing a --grep flag. examples:
                //
                // npm run test -- --grep test/foo/bar.test.js
                // npm run test -- --grep test/bar/*
                {
                    pattern: config.grep ? config.grep : 'test/**/*.test.js',
                    type: 'module',
                },
            ],

            esm: {
                nodeResolve: true,
            },
            // you can overwrite/extend the config further

            coverageIstanbulReporter: {
                reports: ['html', 'lcovonly'],

                thresholds: {
                    global: {
                        statements: 80,
                        lines: 80,
                        branches: 50,
                        functions: 80,
                    },
                },
            },
        })
    );
    return config;
};
