const {defineSupportCode} = require('cucumber');
const State = require("../../framework/state/State");
const PageMap = require("../../pop/PageMap");
const Memory = require("../../framework/memory/Memory");

const pageMap = new PageMap();
State.setPageMap(pageMap);

defineSupportCode(({setDefaultTimeout, When}) => {

    setDefaultTimeout(60000);
    const WAIT_TIMEOUT = 40 * 1000;

    When(/^I wait until "(.+)" (appear|disappear|become visible|become invisible)$/, (alias, action) => {
        const page = State.getPage();
        const element = page.getElement(alias);

        return browser.wait(getExpectedCondition(action, element), WAIT_TIMEOUT);

        function getExpectedCondition(action, element) {
            const EC = protractor.ExpectedConditions;
            switch (action) {
                case "appear": return EC.presenceOf(element); break;
                case "disappear": return EC.stalenessOf(element); break;
                case "become visible": return EC.visibilityOf(element); break;
                case "become invisible": return EC.invisibilityOf(element); break;
                default: throw new Error(`${action} is not defined`)
            }
        }
    });

});