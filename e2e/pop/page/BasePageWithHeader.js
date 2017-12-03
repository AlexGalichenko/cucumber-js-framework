const BasePage = require("./BasePage");

class BasePageWithHeader extends BasePage {

    constructor(page) {
        super(page);
        if (!page) page = this;

        page.defineElement("Element1", "css", '.modal-open button.remove');
        page.defineElement("Element2", "css", ".loading-mask");
    }

}

module.exports = BasePageWithHeader;
