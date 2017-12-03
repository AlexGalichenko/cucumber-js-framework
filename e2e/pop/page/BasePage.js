const Page = require("../../framework/pop/Page");

class BasePage extends Page {

    constructor(page) {
        super(page);
        if (!page) page = this;
    }

}

module.exports = BasePage;
