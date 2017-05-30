require('dotenv').load();

module.exports = (grunt) => {
  grunt.initConfig({
    eslint: {
      target: ['./app/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.registerTask('default', ['eslint']);
};
