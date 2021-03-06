"use strict";

class Memory {

    /**
     * @param calculablesInstance - instance of calculables map
     */
    static setCalculables(calculablesInstance) {
        this.calculablesInstance = calculablesInstance;
    }

    /**
     * bind value to memory class
     * @param key
     * @param value
     */
    static setValue(key, value) {
        if (!this.memory) {
            this.memory = {}
        }

        this.memory[key] = value;
    }

    /**
     * return value if exists in memory
     * @param key
     * @return {string} parsed value
     * @throws {Error}
     */
    static parseValue(key) {

        const MEMORY_REGEXP = /^(\$+|#)/g;

        const prefix = key.match(MEMORY_REGEXP) ? key.match(MEMORY_REGEXP).pop() : "";
        const parsedKey = key.replace(prefix, "");

        switch (prefix) {
            case "$": return this._getMemoryValue(parsedKey); break;
            case "#": return this._getCalculableValue(parsedKey); break;
            case "": return parsedKey; break;
            default: throw new Error(`${prefix} is not defined`)
        }

    }

    /**
     * Return value from memory
     * @param alias
     * @return {*}
     * @private
     */
    static _getMemoryValue(alias) {
        if (this.memory[alias]) {
            return this.memory[alias];
        } else {
            throw new Error(`Value ${alias} doesn't exist in memory`)
        }
    }

    /**
     * Retuern calculated value
     * @param alias
     * @return {*}
     * @private
     */
    static _getCalculableValue(alias) {
        if (this.calculablesInstance) {
            return this.calculablesInstance.getCalculable(alias)
        }
        else throw new Error(`Instance of calculables is not defined`)
    }

}

module.exports = Memory;