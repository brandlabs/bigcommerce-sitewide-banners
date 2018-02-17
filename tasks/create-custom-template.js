
/**
 * We create "sitewide-banners.html" as a custom category template serving nothing but the banner if present
 */
const path = require ('path');

const root = process.cwd();

const TEMPLATE_PATH = 'templates/pages/custom/category/sitewide-banners.html';

const SNIPPET =
`
{{#if banners.top}}
    <div class="banners" data-banner-location="top">
        <div class="banner">
            {{#each banners.top}}
                {{{this}}}
            {{/each}}
        </div>
    </div>
{{/if}}
{{#if banners.bottom}}
    <div class="banners" data-banner-location="bottom">
        <div class="banner">
            {{#each banners.bottom}}
                {{{this}}}
            {{/each}}
        </div>
    </div>
{{/if}}
`;

module.exports = function (grunt) {

    grunt.task.registerTask ('bigcommerce-sitewide-banners:create-template', 'Creates our custom template', function () {
        grunt.file.write (path.join (root, TEMPLATE_PATH), SNIPPET);
    });
};
