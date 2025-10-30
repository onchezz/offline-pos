module.exports = function (api) {
    api.cache(true);
    let plugins = [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
    ];

    return {
        presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

        plugins,
    };
};
