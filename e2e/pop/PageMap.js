"use strict";
const AbstractPageMap = require("../framework/page_manager/AbstractPageMap");

const BasePage = require("./page/BasePage");

class PageMap extends AbstractPageMap {

    constructor() {
        super();

        this.definePage("Base", "^.+$", BasePage);
    }

}

module.exports = PageMap;