"use strict";

/**
 * @abstract
 */
class Page {

    constructor() {
        this.elements = [];
    }

    /**
     * Define element on page / component
     * @param alias - alias of element
     * @param selectorType - selector type (css / cssContainingText)
     * @param selector - selector
     * @param text - containing text for cssContainingText selector
     */
    defineElement(alias, selectorType, selector, text) {
        this.elements.push({
            alias: alias,
            selectorType: selectorType,
            selector: selector,
            text: text,
            isCollection: false
        })
    }

    /**
     * Define collection on page / component
     * @param alias - alias of element
     * @param selectorType - selector type (css / cssContainingText)
     * @param selector - selector
     * @param text - containing text for cssContainingText selector
     */
    defineCollection(alias, selectorType, selector, text) {
        this.elements.push({
            alias: alias,
            selectorType: selectorType,
            selector: selector,
            text: text,
            isCollection: true
        })
    }

    /**
     * Get element by alias
     * @param alias - alias of element to get
     * @return {Promise<WebElement>} - promise that resolves with element
     */
    getElement(alias) {
         let elementDefinition = this._get(alias);

        switch (elementDefinition.selectorType) {
            case "css": return element(by.css(elementDefinition.selector));
            case "cssContainingText": return element(by.cssContainingText(elementDefinition.selector, elementDefinition.text));
            default: throw Error(`${elementDefinition.selectorType} selector type is not defined`);
        }

    }

    /**
     * Get collection by alias
     * @param alias - alias of element to get
     * @return {Promise<Array<WebElement>>} - promise that resolves with element collection
     */
    getCollection(alias) {
        let elementDefinition = this._get(alias);

        switch (elementDefinition.selectorType) {
            case "css": return element.all(by.css(elementDefinition.selector));
            case "cssContainingText": return element.all(by.cssContainingText(elementDefinition.selector, elementDefinition.text));
            default: throw Error(`${elementDefinition.selectorType} selector type is not defined`);
        }

    }

    /**
     * Get element from array
     * @param alias - alias of element to get
     */
    _get(alias) {
        const element = this.elements.find(item => item.alias === alias);
        if (element) {
            return element
        } else {
            throw Error(`${alias} element wasn't found on page`)
        }
    }

}

module.exports = Page;