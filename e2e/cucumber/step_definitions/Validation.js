const {defineSupportCode} = require('cucumber');
const State = require("../../framework/state/State");
const PageMap = require("../../pop/PageMap");
const Memory = require("../../framework/memory/Memory");
const CalculablesMap = require("../../pop/CalculablesMap");
const expect = require("chai").expect;

const pageMap = new PageMap();
const calculablesMap = new CalculablesMap();

State.setPageMap(pageMap);
Memory.setCalculables(calculablesMap);

defineSupportCode(({setDefaultTimeout, Then}) => {

    setDefaultTimeout(60000);

    Then(/^Text of "(.+)" element should (not )?(be equal to|contain) "(.+)"$/, (alias, negate, action, value) => {
        const page = State.getPage();
        const parsedValue = Memory.parseValue(value);

        return page.getElement(alias).getText()
            .then((text) => {
                switch (action) {
                    case "be equal to": negate
                        ? expect(text).to.not.equal(parsedValue)
                        : expect(text).to.equal(parsedValue);
                        break;
                    case "contain": negate
                        ? expect(text).to.not.contain(parsedValue)
                        : expect(text).to.contain(parsedValue);
                        break;
                    default: throw Error(`${action} is not defined`)
                }
            })
    });

    Then(/^I should (not )?see "(.+)"$/, (negate, alias) => {
        const page = State.getPage();

        return page.getElement(alias).isPresent()
            .then((isPresent) => {
                if (isPresent) {
                    page.getElement(alias)
                        .isDisplayed()
                        .then(isDisplayed => expect(isDisplayed).to.be.equal(!negate))
                }
            })
    });

    Then(/^Number of elements in "(.+)" collection should (not )?be (equal to|less than|greater than) "(.+)"$/, (alias, negate, action, expectedValue) => {
        const page = State.getPage();
        const parsedValue = parseInt(Memory.parseValue(expectedValue));

        return page.getCollection(alias).count()
            .then((count) => {
                switch (action) {
                    case "equal to": negate
                        ? expect(count).to.not.equal(parsedValue)
                        : expect(count).to.equal(parsedValue);
                        break;
                    case "less than": negate
                        ? expect(count).to.not.be.lessThan(parsedValue)
                        : expect(count).to.be.lessThan(parsedValue);
                        break;
                    case "greater than": negate
                        ? expect(count).to.not.be.greaterThan(parsedValue)
                        : expect(count).to.be.greaterThan(parsedValue);
                        break;
                    default: throw Error(`${action} is not defined`)
                }
            })
    });

    Then(/^Page should (not )?be scrolled to top$/, (negate) => {
        browser.executeScript('return window.pageYOffset === 0')
            .then(result => expect(result).to.equal(!negate))
    });

    Then(/^Window title should (not )?be "(.+)"$/, (negate, expectedName) => {
        return browser.getTitle().then((title) => {
            return negate
                ? expect(title).to.not.equal(expectedName)
                : expect(title).to.equal(expectedName)
        })
    });

    Then(/^URL should (not )?(be|contain) "(.+)"$/, (negate, validation, expectedUrl) => {
        const parsedUrl = Memory.parseValue(expectedUrl);
        return browser.getCurrentUrl().then((url) => {
            switch (validation) {
                case "be": negate
                    ? expect(url).to.not.equal(parsedUrl)
                    : expect(url).to.equal(parsedUrl);
                    break;
                case "contain": negate
                    ? expect(url).to.not.contain(parsedUrl)
                    : expect(url).to.contain(parsedUrl);
                    break;
                default: throw Error(`${validation} is not defined`)
            }
        })
    });

    Then(/Value of "(.+)" attribute of "(.+)" should (not )?(be|contain) "(.*)"/, (attrName, alias, negate, validation, expectedValue) => {
        const page = State.getPage();
        const parsedValue = Memory.parseValue(expectedValue);

        return page.getElement(alias).getAttribute(attrName).then((attr) => {
            switch (validation) {
                case "be": negate
                    ? expect(attr).to.not.equal(parsedValue)
                    : expect(attr).to.equal(parsedValue);
                    break;
                case "contain": negate
                    ? expect(attr).to.not.contain(parsedValue)
                    : expect(attr).to.contain(parsedValue);
                    break;
                default: throw Error(`${validation} is not defined`)
            }
        })
    });

    Then(/^Text of "(.+)" elements should (not )?match "(.+)" regexp$/, (alias, negate, expectedValue) => {
        const page = State.getPage();
        const regexpString = Memory.parseValue(expectedValue);

        return page.getCollection(alias).each((element) => {
            element.getText().then((text) => {
                const REGEXP = new RegExp(regexpString, "gmi");
                negate
                    ? expect(text).to.not.match(REGEXP)
                    : expect(text).to.match(REGEXP)
            })
        })

    });

    Then(/^Text of "(.+)" element should (not )?match "(.+)" regexp$/, (alias, negate, expectedValue) => {
        const page = State.getPage();
        const regexpString = Memory.parseValue(expectedValue);

        return page.getElement(alias).getText().then((text) => {
                const REGEXP = new RegExp(regexpString, "gmi");
                negate
                    ? expect(text).to.not.match(REGEXP)
                    : expect(text).to.match(REGEXP)
            })

    });

    Then(/^Text of "(\d)" element in "(.+)" should (not )?(be equal to|contain) "(.+)"$/, (index, alias, negate, action, value) => {
        const page = State.getPage();
        const parsedValue = Memory.parseValue(value);

        return page.getCollection(alias).get(index - 1).getText()
            .then((text) => {
                switch (action) {
                    case "be equal to": negate
                        ? expect(text).to.not.equal(parsedValue)
                        : expect(text).to.equal(parsedValue);
                        break;
                    case "contain": negate
                        ? expect(text).to.not.contain(parsedValue)
                        : expect(text).to.contain(parsedValue);
                        break;
                    default: throw Error(`${action} is not defined`)
                }
            })
    });

});