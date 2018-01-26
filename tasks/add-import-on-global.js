/**
 * We add our import function to global.js but leave to the user write where (s)he wants our function (`getBanner()`) be.
*/

const path = require ('path');

const root = process.cwd();

const GLOBAL_PATH = 'assets/js/theme/global.js';
const IMPORT_LINE = 16;

const SNIPPET =
`
import SiteWideBanner from 'bigcommerce-sitewide-banners';
`;

module.exports = function (grunt) {

    // From this, is expected to see an error when bundling, since we don't know where the user wants to call our function
    grunt.task.registerTask ('bigcommerce-sitewide-banners:add-script-import', 'Adds our script import on global.js', function () {
        const content = grunt.file.read (path.join (root, GLOBAL_PATH));

        const lines = content.split ('\n');
        lines.splice (IMPORT_LINE, 0, SNIPPET);  // There are a lot of imports, we just use one

        grunt.file.write (path.join (root, GLOBAL_PATH), lines.join ('\n'));
    });
};
