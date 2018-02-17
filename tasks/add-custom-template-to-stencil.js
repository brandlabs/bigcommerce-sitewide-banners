
const path = require ('path');

const root = process.cwd();

const STENCIL_PATH = '.stencil';

module.exports = function (grunt) {

    grunt.task.registerTask ('bigcommerce-sitewide-banners:add-template-to-stencil', 'Adds our custom template into .stencil file', function () {

        // we read the JSON content and append our custom template
        const content = grunt.file.readJSON (path.join (root, STENCIL_PATH));
        content.customLayouts.category['sitewide-banners.html'] = '/sitewide-banners/';

        grunt.file.write (path.join (root, STENCIL_PATH), JSON.stringify (content));
    });
};
