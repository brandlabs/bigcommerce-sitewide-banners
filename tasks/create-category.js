
const path    = require ('path');
const { URL } = require ('url');
const https   = require ('https');

const root    = process.cwd();

const STENCIL_PATH = '.stencil';

const categoryData = {
    name:        'Sitewide banners',
    url:         '/sitewide-banners/',
    layout_file: 'category.html',   // As per BigCommerce docs, this refers to blueprint, but it should work
};

module.exports = function (grunt) {

    grunt.task.registerTask ('bigcommerce-sitewide-banners:create-category', 'Create Sitewide banner Category on dashboard', async function () {
        const done = this.async();

        // we read the JSON content and append our custom template
        const stencil = grunt.file.readJSON (path.join (root, STENCIL_PATH));
        const { username, token, normalStoreUrl } = stencil;

        if (!username || !token) {
            grunt.fatal (new Error ('Username and Token needed on .stencil file'));
        }

        const siteUrl = new URL (normalStoreUrl);

        await createCategory (siteUrl.host, username, token, grunt);

        done();
    });
};

/**
 * We use BigCommerce API to create the Sitewide banners category and resolve with the category created IS
 *
 * @param   {string}    host
 * @param   {string}    username
 * @param   {string}    token
 * @returns {Promise}
 */
function createCategory (host, username, token, grunt) {

    return new Promise (function (resolve, reject) {

        const options = {
            host,
            path:    '/api/v2/categories.json',
            auth:    `${ username }:${ token }`,
            method:  'post',
            headers: {
                accept:         'application/json',
                'Content-Type': 'application/json',
            },
        };

        let responseBody = '';

        const request = https.request (options, function (response) {
            response.setEncoding ('utf8');

            response.on ('data', chunk => (responseBody += chunk));
            response.on ('end', () => resolve ());
            response.on ('error', error => reject (grunt.fatal (error)));
        });

        request.end (JSON.stringify (categoryData));
    });
}
