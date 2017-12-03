"use strict";
const AbstractCalculablesMap = require("../framework/memory/AbstractCalculablesMap");
const Memory = require("../framework/memory/Memory");

class CalculablesMap extends AbstractCalculablesMap {

    constructor() {
        super();

        this.defineCalculable(/^FUNCTION\((.+)\)$/, (args) => {
            return args[0]
        });

    }

}

module.exports = CalculablesMap;