const {defineSupportCode} = require('cucumber');
const CredentialManager = require("../../framework/credential_manager/CredentialManager");
const ScreenshotManager = require("../../framework/screenshot_manager/ScreenshotManager");

defineSupportCode(function ({setDefaultTimeout, Before, After, AfterAll}) {

    setDefaultTimeout(60000);

    Before(function() {
        CredentialManager.getCredentials();
        browser.ignoreSynchronization = true;
        browser.manage().window().maximize();
        return browser.get(browser.params.envData.baseUrl);
    });

    After(function(scenario) {
        ScreenshotManager.takeScreenshot(this, scenario.result.status);
        CredentialManager.freeCredentials();
    });

});