
const path    = require ('path');
const { URL } = require ('url');
const https   = require ('https');

const root    = process.cwd();

const STENCIL_PATH = '.stencil';

module.exports = function (grunt) {

    grunt.task.registerTask ('bigcommerce-sitewide-banners:create-test-banner', 'Create Sitewide Test banner on dashboard', async function () {
        const done = this.async();

        // we read the JSON content and append our custom template
        const stencil = grunt.file.readJSON (path.join (root, STENCIL_PATH));
        const { username, token, normalStoreUrl } = stencil;

        if (!username || !token) {
            grunt.fatal (new Error ('Username and Token needed on .stencil file'));
        }

        const siteUrl        = new URL (normalStoreUrl);
        const categoryResult = await getCategory (siteUrl.host, username, token, grunt);

        if (categoryResult && categoryResult.length) {
            await createTestBanner (siteUrl.host, username, token, categoryResult[0].id, grunt);
        }

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

/**
 * We create a test banner applied to our new cateogry for testing
 *
 * @param   {string}    host
 * @param   {string}    username
 * @param   {string}    token
 * @param   {integer}   categoryId
 * @returns {Promise}
 */
function createTestBanner (host, username, token, categoryId, grunt) {

    return new Promise (function (resolve, reject) {

        const bannerData = {
            name:      'Site Wide banner Test banner',
            content:   '<p>Site Wide banner - Test promo</p>',
            page:      'category_page',
            location:  'top',
            date_type: 'always',
            item_id:   `${ categoryId }`,
            visible:   1,
        };

        const options = {
            host,
            path:    '/api/v2/banners.json',
            auth:    `${ username }:${ token }`,
            method:  'post',
            headers: {
                accept:         'application/json',
                'Content-Type': 'application/json',
            },
        };

        const request = https.request (options, function (response) {
            response.setEncoding ('utf8');

            response.on ('data', chunk => console.log (chunk)); // we need to consume the data provided
            response.on ('end', () => resolve());
            response.on ('error', error => reject (grunt.fatal (error)));
        });

        request.end (JSON.stringify (bannerData));
    });
}
