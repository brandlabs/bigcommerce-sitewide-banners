
const path    = require ('path');
const { URL } = require ('url');
const https   = require ('https');

const root    = process.cwd();

const STENCIL_PATH = '.stencil';

const categoryData = {
    parent_id:   0,
    name:        'Sitewide banners',
    is_visible:  true,
    custom_url: {
        url:           '/sitewide-banners/',
        is_customized: false,
    },
    layout_file: 'category.html',   // As per BigCommerce docs, this refers to blueprint, but it should work
};

module.exports = function (grunt) {

    grunt.task.registerTask ('bigcommerce-sitewide-banners:create-category', 'Create Sitewide banner Category on dashboard', async function () {
        const done = this.async();

        // we read the JSON content and append our custom template
        const stencil = grunt.file.readJSON (path.join (root, STENCIL_PATH));
        const { clientId, accessToken, normalStoreUrl } = stencil;

        if (!clientId || !accessToken) {
            grunt.fatal (new Error ('clientId and accessToken needed on .stencil file'));
        }

        const siteUrl = new URL (normalStoreUrl);
        const [, storeHash] = /store-(.+).mybigcommerce.com/.exec(siteUrl.host);

        await createCategory (storeHash, clientId, accessToken, grunt);

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
function createCategory (storeHash, clientId, accessToken, grunt) {

    return new Promise (function (resolve, reject) {

        const options = {
            host:     'api.bigcommerce.com',
            procotol: 'https:',
            path:     `/stores/${ storeHash }/v3/catalog/categories`,
            method:   'post',
            headers: {
                accept:          'application/json',
                'Content-Type':  'application/json',
                'X-Auth-Client': clientId,
                'X-Auth-Token':  accessToken,
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
