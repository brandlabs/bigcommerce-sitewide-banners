/**
 * Since the Sitewide Banners category is added as a menu item, we add a CSS rule to hide it.
 */

const path = require ('path');

const root = process.cwd();

const SCSS_PATH = 'assets/scss/theme.scss';

const SNIPPET =
`
@import "../../node_modules/bigcommerce-sitewide-banners/src/sitewide-banners";
`;

module.exports = function (grunt) {

    grunt.task.registerTask ('bigcommerce-sitewide-banners:add-css-rule', 'Adds a CSS rule to hide our banner from menu', function () {
        const content = grunt.file.read (path.join (root, SCSS_PATH));

        grunt.file.write (path.join (root, SCSS_PATH), `${ content }${ SNIPPET }`);
    });
};
