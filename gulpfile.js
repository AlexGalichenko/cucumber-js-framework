const gulp = require("gulp");
const util = require("gulp-util");
const clean = require("gulp-clean");
const protractor = require("gulp-protractor").protractor;
const gp = require('gulp-protractor');
const GulpHelpers = require("./e2e/framework/helpers/GulpHelpers");
const CredentialManager = require("./e2e/framework/credential_manager/CredentialManager");
const envs = require("./e2e/protractor.environments");
const webdriver_update = require('gulp-protractor').webdriver_update_specific;
const Reporter = require("./e2e/framework/reporter/Reporter");
const TasksKiller = require("./e2e/framework/taskskiller/TasksKiller");


gulp.task('folders', () => {
    return gulp.src('test', {read: false})
        .pipe(clean());
});

gulp.task('test:prepare_folders', ['folders'], () => {
    let promises = [];
    const creds = envs[util.env.env].credentials;
    promises.push(CredentialManager.createPool(creds));
    promises.push(GulpHelpers.prepareFolders());
    return Promise.all(promises);
});
gulp.task('test:driver_update', ['test:prepare_folders'], webdriver_update({
    browsers: ['chrome', 'ie']
}));

gulp.task('test:webdriver_server', ['test:driver_update'], gp.webdriver_standalone);

gulp.task('test', ['test:driver_update'], () => {
    gulp.src(['./cucumber/features/*.feature'])
        .pipe(protractor({
            configFile: "./e2e/protractor.conf.js",
            args: [
                "--params.environment", util.env.env,
                "--cucumberOpts.tags", util.env.tags
            ]
        }))
});

gulp.task('kill', () => {
    return new TasksKiller().kill({
        "chromedriver": "contains",
        "iedriverserver": "contains",
    });
});

gulp.task('junit', () => {
    Reporter.generateXMLReport("./test/report.json", "./test/report.xml");
});
