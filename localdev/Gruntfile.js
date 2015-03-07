module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
              options: {
                style: 'expanded'
              },
              files: [{
                expand: true,
                cwd: 'src/scss/',
                src: ['*.scss'],
                dest: 'dest/css/',
                ext: '.css'
              }]
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 version']
            },
            dist: {
                src: [
                    'dest/css/style.css',
                ]
            }
        },

        watch: {
            files: ['src/scss/module/*.scss'],
            tasks: ['sass', 'autoprefixer']
        },

    });

    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build',['sass', 'autoprefixer']);
    grunt.registerTask('localdev',['watch']);
};
