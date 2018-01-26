
module.exports = function (grunt) {

    grunt.task.registerTask ('bigcommerce-sitewide-banners:init', 'Adds side wide banner custom template',  function() {
        const tasks = [
            'bigcommerce-sitewide-banners:create-template',
            'bigcommerce-sitewide-banners:add-css-rule',
            'bigcommerce-sitewide-banners:add-template-to-stencil',
            'bigcommerce-sitewide-banners:add-script-import',
            'bigcommerce-sitewide-banners:create-category',
            'bigcommerce-sitewide-banners:create-test-banner',
        ];

        grunt.task.run (tasks);
    });
};
