module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'dist/'
                }]
            }
        },

        sass: {
            dist: {
              options: {
                style: 'expanded'
              },
              files: [{
                expand: true,
                cwd: 'src/scss/',
                src: ['*.scss'],
                dest: 'dist/css/',
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
                    'dist/css/style.css',
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
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.registerTask('build-css',['sass', 'autoprefixer']);
    grunt.registerTask('build-img',['imagemin']);
    grunt.registerTask('build',['imagemin', 'sass', 'autoprefixer']);
    grunt.registerTask('sass-watch',['watch']);
};
