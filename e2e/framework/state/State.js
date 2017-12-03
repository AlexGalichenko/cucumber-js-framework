"use strict";

class State {

    /**
     * Set page map
     * @param pageMap
     */
    static setPageMap(pageMap) {
        this.pageMap = pageMap;
    }

    /**
     * Set page
     * @param pageName
     */
    static setPage(pageName) {
        const pageConstructor = this.pageMap.getPage(pageName).pageObject;
        this.page = new pageConstructor();
    }

    /**
     * Get current page
     * @return {*}
     */
    static getPage() {
        return this.page;
    }
}

module.exports = State;