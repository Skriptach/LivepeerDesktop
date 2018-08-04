/* POSTCss configuration */

module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-simple-vars':  {},
        'postcss-extend': {},
        'postcss-nested':  {},
        'postcss-reporter':  {},
        'postcss-preset-env': {
            browsers: ['last 2 versions', '> 5%']
        }
    }
};
