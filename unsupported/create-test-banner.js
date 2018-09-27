/**
 * NOTE: banners are not part of v3 yet, so you need to create a banner and associate it with the Sitewide Banner Category manually
 */
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
        const { clientId, accessToken, normalStoreUrl } = stencil;

        if (!clientId || !accessToken) {
            grunt.fatal (new Error ('clientId and accessToken needed on .stencil file'));
        }

        const siteUrl        = new URL (normalStoreUrl);
        const [, storeHash] = /store-(.+).mybigcommerce.com/.exec(siteUrl.host);
        const categoryResult = await getCategory (siteUrl.host, clientId, accessToken, grunt);

        if (categoryResult && categoryResult.length) {
            await createTestBanner (storeHash, clientId, accessToken, categoryResult[0].id, grunt);
        }

        done();
    });
};

/**
 * We use BigCommerce API to create the Sitewide banners category and resolve with the category created IS
 *
 * @param   {string}    storeHash
 * @param   {string}    clientId
 * @param   {string}    accessToken
 * @returns {Promise}
 */
function getCategory (storeHash, clientId, accessToken, grunt) {

    return new Promise (function (resolve, reject) {

        const options = {
            host: 'api.bigcommerce.com',
            procotol: 'https:',
            // path:    `/api/v2/categories.json?name=${ encodeURI ('Sitewide banners') }`,
            path:    `/stores/${ storeHash }/v3/catalog/categories?name=${ encodeURI ('Sitewide banners') }`,
            method:  'get',
            headers: {
                accept:         'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Client': clientId,
                'X-Auth-Token': accessToken,
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
