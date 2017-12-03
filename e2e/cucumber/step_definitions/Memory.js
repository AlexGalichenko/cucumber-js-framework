const {defineSupportCode} = require('cucumber');
const State = require("../../framework/state/State");
const PageMap = require("../../pop/PageMap");
const Memory = require("../../framework/memory/Memory");

const pageMap = new PageMap();
State.setPageMap(pageMap);

defineSupportCode(({setDefaultTimeout, When}) => {

    setDefaultTimeout(60000);

    When(/^I remember "(.+)" value as "(.+)"$/, (alias, key) => {
        const page = State.getPage();

        return page.getElement(alias).getText()
            .then((text) => {
                Memory.setValue(key, text);
            })
    });

    When(/^I remember value of the "(.+)" element of "(.+)" as "(.+)"$/, (index, alias, key) => {
        const page = State.getPage();

        return page.getCollection(alias).get(index - 1)
            .getText()
            .then((text) => {
                console.log(text);
                Memory.setValue(key, text);
            })
    });

    When(/^I remember value of "(.+)" attribute of "(.+)" as "(.+)"$/, (attrName, alias, key) => {
        const page = State.getPage();

        return page.getElement(alias).getAttribute(attrName).then((attr) => {
            Memory.setValue(key, attr)
        })
    });

});