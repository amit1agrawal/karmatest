'use strict';

module.exports = function(grunt) {

    grunt.initConfig({

        dir: {
            webapp: 'webapp',
            dist: 'dist',
            bower_components: 'bower_components',
            warfileout: 'warfile',
            eslintout: 'eslint/eslint.xml'
        },

        openui5_preload: {
            component: {
                options: {
                    resources: {
                        cwd: '<%=dir.webapp%>',
                        prefix: 'sap/ui/demo/tdg',
                        src: [
                            '**/*.js',
                            '**/*.fragment.html',
                            '**/*.fragment.json',
                            '**/*.fragment.xml',
                            '**/*.view.html',
                            '**/*.view.json',
                            '**/*.view.xml',
                            '**/*.properties',
														'**/*.css',
														'**/*.html',
														'model/*.*'
                        ]
                    },
                    dest: '<%=dir.dist%>',
                    compress: {
                        uglifyjs: {
                            output: {
                                comments: /copyright|\(c\)|released under|license|\u00a9/i
                            }
                        }
                    }
                },
                components: true
            }
        },

        connect: {

            options: {
                port: 8080,
                hostname: '*'
            },
            src: {},
            dist: {}
        },

        openui5_connect: {
            options: {
                resources: [
                    '<%= dir.bower_components %>/openui5-sap.ui.core/resources',
                    '<%= dir.bower_components %>/openui5-sap.m/resources',
                    '<%= dir.bower_components %>/openui5-sap.ui.layout/resources',
                    '<%= dir.bower_components %>/openui5-themelib_sap_bluecrystal/resources'
                ]
            },
            src: {
                options: {
                    appresources: '<%= dir.webapp %>'
                }
            },
            dist: {
                options: {
                    appresources: '<%= dir.dist %>'
                }
            }
        },

        clean: {
            dist: '<%= dir.dist %>/',
            warfileout: '<%=dir.warfileout%>',
            eslintout: '<%=dir.eslintout%>'
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= dir.webapp %>',
                    src: [
                        '**',
                        '!test/**'
                    ],
                    dest: '<%= dir.dist %>'
                }]
            }
        },

        eslint: {
            webapp: ['<%= dir.webapp %>'],
            outputFile: '<%= dir.eslintout %>'
        },
        war: {
            target: {
                options: {
                    war_dist_folder: '<%= dir.warfileout %>',
                    war_name: 'karmatest'
                },
                files: [{
                    expand: true,
                    cwd: '<%= dir.webapp %>',
                    src: ['**'],
                    dest: ''
                }]
            }
        },

        nwabap_ui5uploader: {
            options: {
                conn: {
                    server: 'http://appsvr5.industrysoln.sl.edst.ibm.com:51000',
                },
                auth: {
                    user: "AMIT_A",
                    pwd: "ibm123"
                }
            },
            upload_build: {
                options: {
                    ui5: {
                        package: 'ZMOB',
                        bspcontainer: 'ZZ_UI5_LOCAL',
                        bspcontainer_text: 'UI5 upload',
                        transportno: 'SMAK900168'
                    },
                    resources: {
                        cwd: '<%=dir.dist%>',
                        src: '**/*.*'
                    }
                }
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-openui5');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-war');
    grunt.loadNpmTasks('grunt-nwabap-ui5uploader');

    // Server task
    grunt.registerTask('serve', function(target) {
        grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
    });

    // Linting task
    grunt.registerTask('lint', ['eslint']);

    grunt.registerTask('preload', ['openui5_preload']);
    // Build task
    grunt.registerTask('build', ['openui5_preload', 'copy']);

    //war task
    grunt.registerTask('warfile', ['war']);

		grunt.registerTask('abapupload', ['nwabap_ui5uploader']);

    // Default task
    grunt.registerTask('default', [
        'clean',
        //'lint',
        'build',
        // 'serve:dist',
        'warfile',
        'abapupload'
    ]);
};
