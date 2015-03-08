module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        imagemin: {
            // static: {
            //     options: {
            //         optimizationLevel: 3,
            //         svgoPlugins: [{ removeViewBox: false }],
            //         use: [mozjpeg()]
            //     },
            //     files: {
            //         'dist/img.png': 'src/img.png',
            //         'dist/img.jpg': 'src/img.jpg',
            //         'dist/img.gif': 'src/img.gif'
            //     }
            // },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'dist2/'
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

    grunt.registerTask('build',['sass', 'autoprefixer']);
    grunt.registerTask('image',['imagemin']);
    grunt.registerTask('localdev',['watch']);
};
