module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-preset-env': {
            browsers: 'last 2 versions',
        },
        'precss': {},
        //    'postcss-font-magician': {
        //      variants: {},
        //      hosted: ['./src/fonts'],
        //      foundries: ['google']
        //    },
        'postcss-short': {},
        'postcss-cssnext': {},
        'postcss-responsive-font': {},
        //    'cssnano': {},
        'css-mqpacker': {}
    },
};
