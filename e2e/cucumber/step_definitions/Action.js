const {defineSupportCode} = require('cucumber');

const fs = require("fs");
const path = require("path");

const expect = require("chai").expect;
const PageMap = require("../../pop/PageMap");
const PageManager = require("../../framework/page_manager/PageManager");
const State = require("../../framework/state/State");
const CredentialManager = require("../../framework/credential_manager/CredentialManager");
const Memory = require("../../framework/memory/Memory");

const pageMap = new PageMap();

State.setPageMap(pageMap);

defineSupportCode(({Given, When, Then, setDefaultTimeout, Before, After, AfterAll}) => {

    setDefaultTimeout(60000);

    Then(/^I should be on "(.+)" page$/, (pageName) => {
        State.setPage(pageName);
        return browser.getCurrentUrl()
            .then(url => {
                expect(url).to.match(new RegExp(pageMap.getPage(pageName).selector));
            })
    });

    When(/^(Enable|Disable) protractor synchronization$/, (enable) => {
        browser.ignoreSynchronization = enable !== "Enable";
    });

    When(/^I click "(.+)"$/, (alias) => {
        const page = State.getPage();
        return page.getElement(alias).click();
    });

    Given(/^I login$/, () => {
        browser.ignoreSynchronization = true;
        State.setPage("Login");
        const page = State.getPage();

        return browser.getCurrentUrl()
            .then(url => {
                expect(url).to.match(new RegExp(pageMap.getPage("Login").selector));
            })
            .then(() => {
                page.getElement("User Id Input").sendKeys(CredentialManager.username);
                page.getElement("User Password Input").sendKeys(CredentialManager.password);
                return page.getElement("Login Button").click()
            })
            .then(() => {
                return browser.wait(() => {
                    return browser.isElementPresent(element(by.css(".mr-search-form")));
                });
            })
            .then(() => {
                browser.ignoreSynchronization = false
            })
            .catch((e) => {
                browser.ignoreSynchronization = false;
                throw new Error(e);
            });

    });

    Given(/^I login as "(.+)" "(.+)"$/, (userId, password) => {
        browser.ignoreSynchronization = true;
        State.setPage("Login");
        const page = State.getPage();

        const parsedUserId = Memory.parseValue(userId);
        const parsedPassword = Memory.parseValue(password);

        return browser.getCurrentUrl()
            .then(url => {
                expect(url).to.match(new RegExp(pageMap.getPage("Login").selector));
            })
            .then(() => {
                page.getElement("User Id Input").sendKeys(parsedUserId);
                page.getElement("User Password Input").sendKeys(parsedPassword);
                return page.getElement("Login Button").click()
            })
            .then(() => {
                return browser.wait(() => {
                    return browser.isElementPresent(element(by.css(".mr-search-form")));
                });
            })
            .then(() => {
                browser.ignoreSynchronization = false
            })
            .catch((e) => {
                browser.ignoreSynchronization = false;
                throw new Error(e);
            });

    });

    Given(/^I login as "(.+)" user$/, (user) => {
        browser.ignoreSynchronization = true;
        State.setPage("Login");
        const page = State.getPage();

        const userId = browser.params.envData.decoratedUrl[user]["userid"];
        const password = browser.params.envData.decoratedUrl[user]["password"];

        if (!userId) {
            throw new Error(`${user} user was not found`)
        } else {
            return browser.getCurrentUrl()
                .then(url => {
                    expect(url).to.match(new RegExp(pageMap.getPage("Login").selector));
                })
                .then(() => {
                    page.getElement("User Id Input").sendKeys(userId);
                    page.getElement("User Password Input").sendKeys(password);
                    return page.getElement("Login Button").click()
                })
                .then(() => {
                    return browser.wait(() => {
                        return browser.isElementPresent(element(by.css(".mr-search-form")));
                    });
                })
                .then(() => {
                    browser.ignoreSynchronization = false
                })
                .catch((e) => {
                    browser.ignoreSynchronization = false;
                    throw new Error(e);
                });
        }



    });

    When(/I navigate by "(.+)" path/, (path) => {
        const page = State.getPage();
        let tokenList = path.split(' > ');

        let token = tokenList.shift();
        let promiseChain = page.getCollection("Level1 Nodes").filter((element) => {
           return element.getText().then(text => text === token)
        }).first().click();

        while (tokenList.length > 0) {
            let token = tokenList.shift();
            promiseChain = promiseChain.then(() => {
               return page.getCollection("Level2 Nodes").filter((element) => {
                   return element.getText().then(text => text === token)
               }).first().click();
            })
        }

        return promiseChain;
    });

    When(/^I click on "(.+)" in "(.+)"$/, (item, collection) => {
        const page = State.getPage();

        return page.getCollection(collection)
            .filter((element) => {
                return element.getText().then(text => text === item);
            })
            .first()
            .click()
    });

    When(/^I click on "(\d+)" element of "(.+)"$/, (index, collection) => {
        const page = State.getPage();

        return page.getCollection(collection)
            .get(index - 1)
            .click()
    });

    When(/^I type "(.+)" to "(.+)"$/, (value, alias) => {
        const page = State.getPage();
        const parsedValue = Memory.parseValue(value);

        return page.getElement(alias).sendKeys(parsedValue)
    });

    When(/^I scroll down page to "(\d+)" pixels$/, (pixel) => {
        return browser.waitForAngular()
            .then(() => {
                return browser.executeScript('window.scrollBy(0,' + pixel + ');')
            })
    });

    When(/^I perform search of "(.+)"$/, (searchTerm) => {
        const page = State.getPage();

        return page.getElement("Search Input")
            .clear()
            .sendKeys(searchTerm)
            .then(() => page.getElement("Search Button").click())
    });

    When(/^I download file by clicking on "(.+)"$/, (alias) => {
        const page = State.getPage();
        const dirToDownload = path.resolve("./download/");

        if (!fs.existsSync(dirToDownload)) {
            fs.mkdirSync(dirToDownload);
        } else {
            fs.readdirSync(dirToDownload)
                .forEach((file) => {
                    fs.unlinkSync(path.resolve(dirToDownload + "/" + file));
                });
        }

        let downloadFiles = fs.readdirSync(dirToDownload).length;
        page.getElement(alias)
            .click()
            .then(() => {
                downloadFiles++;
                return browser.wait(() => {
                    if (fs.readdirSync(dirToDownload).length === downloadFiles) {
                        return true
                    }
                }, 10000)
            })
    });

    When(/^I click all "(.+)" and confirm$/, (alias) => {
        const page = State.getPage();

        const confirmButton = page.getElement("Delete Button");

        return page.getCollection(alias)
            .each((element) => {
                element.click().then(() => confirmButton.click())
            })
    });

    When(/^I clear "(.+)"$/, (alias) => {
        const page = State.getPage();

        return page.getElement(alias).clear()
    });

    When(/^I select "(.+)" option from "(.+)"/, (option, dropdown) => {
        const page = State.getPage();

        return page.getElement(dropdown).click()
            .then(() => {
                return page.getElement(dropdown).all(by.css("option"))
                    .filter((element) => {
                        return element.getText().then(text => text === option)
                    })
                    .first()
                    .click()
            })
    });

    When(/^I switch to "(\d+)" (window|frame)$/, (index, element) => {

        const windowHandlesPromise = browser.getAllWindowHandles();

        switch(element) {
            case "window": return windowHandlesPromise.then((handles) => {
                browser.switchTo().window(handles[index - 1]);
            }); break;
            case "frame": return browser.switchTo().frame(index - 1); break;
            default: throw new Error(`${element} is not defined`)
        }
    });

    When(/^I (un)?check "(.+)" checkbox$/, (uncheck, alias) => {
        const page = State.getPage();
        const checkbox = page.getElement(alias);

        return checkbox.getAttribute("checked")
            .then((isChecked) => {
                const condition = (isChecked && uncheck) || (!isChecked && !uncheck);
                if (condition) return checkbox.click()
            })
    });

    When(/^I refresh page$/, () => {
        return browser.refresh()
    });

    When(/^I (un)?check "(.+)" checkbox in My Libraries$/, (uncheck, alias) => {
        const page = State.getPage();

        const checkbox = page.getCollection("My Libraries Table Rows")
            .filter(element => {
                return element.getText().then(text => text.includes(alias))
            })
            .first()
            .element(by.css("input[type='checkbox']"));

        return checkbox.getAttribute("checked")
            .then(isChecked => {
                const condition = (isChecked && uncheck) || (!isChecked && !uncheck);
                if (condition) return checkbox.click()
            })
    });

    When(/^I open "(.+)"$/, (url) => {
        const parsedUrl = Memory.parseValue(url);
        return browser.get(parsedUrl);
    });

    When(/^I restart browser$/, () => {
        browser.restart();
        browser.ignoreSynchronization = true;
        browser.manage().window().maximize();
        return browser.get(browser.params.envData.baseUrl);
    });

    When(/^I click BACK button$/, () => {
        return browser.navigate().back();
    });


});