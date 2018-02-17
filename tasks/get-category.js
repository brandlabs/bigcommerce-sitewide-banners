
const path    = require ('path');
const { URL } = require ('url');
const https   = require ('https');

const root    = process.cwd();

const STENCIL_PATH = '.stencil';

module.exports = function (grunt) {

    grunt.task.registerTask ('bigcommerce-sitewide-banners:get-category', 'Create Site-wide banner Category and a Test banner on dashboard', async function () {
        const done = this.async();

        // we read the JSON content and append our custom template
        const stencil = grunt.file.readJSON (path.join (root, STENCIL_PATH));
        const { username, token, normalStoreUrl } = stencil;

        if (!username || !token) {
            grunt.fatal (new Error ('Username and Token needed on .stencil file'));
        }

        const siteUrl        = new URL (normalStoreUrl);
        const response = await getCategory (siteUrl.host, username, token, grunt);

        console.log(response);

        done();
    });
};

/**
 * We use BigCommerce API to create the Site wide banners category and resolve with the category created IS
 *
 * @param   {string}    host
 * @param   {string}    username
 * @param   {string}    token
 * @returns {Promise}
 */
function getCategory (host, username, token, grunt) {

    return new Promise (function (resolve, reject) {

        const options = {
            host,
            path:    `/api/v2/categories.json?name=${ encodeURI ('Sitewide banners') }`,
            auth:    `${ username }:${ token }`,
            method:  'get',
            headers: {
                accept:         'application/json',
                'Content-Type': 'application/json',
            },
        };

        let responseBody = '';

        const request = https.request (options, function (response) {
            response.setEncoding ('utf8');

            response.on ('data', chunk => (responseBody += chunk));
            response.on ('end', () => resolve (JSON.parse (responseBody)));
            response.on ('error', error => reject (grunt.fatal (error)));
        });

        request.end();
    });
}
