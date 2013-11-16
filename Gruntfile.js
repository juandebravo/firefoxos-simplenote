/*jshint es5: true */

module.exports = function (grunt) {
  // load all grunt tasks
  //require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 9001
        }
      }
    },

    watch: {
    },

    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.',
          dest: 'dist',
          src: [
            /** COMPONENTS - Extracted from main.js config **/
            'bower_components/requirejs/require.js',
            'bower_components/db/index.js',
            'bower_components/js-base64/base64.min.js',
            'bower_components/markdown/lib/markdown.js',
            'bower_components/underscore/underscore-min.js',
            'bower_components/when/when.js',
            'bower_components/zepto/zepto.min.js',
            /** END OF COMPONENTS **/
            'shared/**/*',
            'style/*.css',
            'style/icons/*.{png,jpeg}',
            'scripts/**/*.js',
            'index.html',
            'manifest.webapp'
          ]
        }]
      }
    },
  });

  grunt.registerTask('server', function () {
    grunt.task.run([
      'connect:server',
      //'open:server',
      'watch'
    ]);
  });

  grunt.registerTask('dist', [
    'copy:build',
  ]);

};