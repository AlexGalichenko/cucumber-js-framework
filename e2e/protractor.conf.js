const path = require("path");
const envs = require("./protractor.environments");
const Reporter = require("./framework/reporter/Reporter");

exports.config = {

    seleniumServerJar: path.resolve("./node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.8.1.jar"),
    // seleniumAddress: 'http://localhost:4444/wd/hub',
    // seleniumPort: 4444,
    // localSeleniumStandaloneOpts: {
    //     jvmArgs: [
    //         "-Dwebdriver.ie.driver=node_modules/protractor/node_modules/webdriver-manager/selenium/IEDriverServer3.8.0.exe",
    //         "-Dwebdriver.gecko.driver=node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.19.1.exe",
    //         "-Dwebdriver.chrome.driver=node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.28.exe"
    //     ]
    // },

    chromeDriver: "./node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.28.exe",

    globalTimeout: 60 * 1000,
    pageTimeout: 60 * 1000,
    allScriptsTimeout: 60 * 1000,

    capabilities: {
        browserName:'chrome',
        shardTestFiles: false,
        maxInstances: 1,
        chromeOptions: {
            prefs: {
                credentials_enable_service: false,
                profile: {
                    password_manager_enabled: false
                },
                download: {
                    prompt_for_download: false,
                    default_directory: path.resolve("./download/")
                }
            }
        }
    },

    // capabilities: {
    //     browserName:'internet explorer',
    //     version: '11',
    //     platform: 'ANY',
    //     ignoreProtectedModeSettings: true
    // },

    // capabilities: {
    //     browserName:'firefox',
    //     version: 'ANY',
    //     platform: 'ANY',
    // },


    framework: 'custom',  // set to "custom" instead of cucumber.

    frameworkPath: require.resolve('protractor-cucumber-framework'),  // path relative to the current config file

    specs: [
        './cucumber/features/*.feature'     // Specs here are the cucumber feature files
    ],
    restartBrowserBetweenTests: true,

    // cucumber command line options
    cucumberOpts: {
        require: [
            "./cucumber/step_definitions/*.js"
        ],  // require step definition files before executing features
        //tags: [],                      // <string[]> (expression) only execute the features or scenarios with tags matching the expression
        strict: true,                  // <boolean> fail if there are any undefined or pending steps
        format: ['progress', 'json:test/report.json'],            // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
        // dryRun: false,                 // <boolean> invoke formatters without executing steps
        compiler: [],                   // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    },

    // params: envs[global.env],

    onPrepare: () => {
        browser.params.envData = envs[browser.params.environment];
    },

    onComplete: () => {
        browser.getCapabilities().then(capabilities => {
            Reporter.generateHTMLReport(capabilities);
        });
    },

};