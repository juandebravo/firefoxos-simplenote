/*jshint es5: true */

module.exports = function (grunt) {
  // load all grunt tasks
  //require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 9001
        }
      }
    },

    watch: {
    }

  });
  grunt.registerTask('server', function () {
    grunt.task.run([
      'connect:server',
      //'open:server',
      'watch'
    ]);
  });
};