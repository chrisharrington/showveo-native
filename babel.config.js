module.exports = function(api) {
    api && api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    cwd: 'babelrc',
                    extensions: ['.ts', '.tsx'],
                    alias: {
                        '@lib': './lib'
                    }
                }
            ]
        ]
    };
};
