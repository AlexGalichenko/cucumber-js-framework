"use strict";

const fs = require("fs");
const path = require("path");
const report = require("multiple-cucumber-html-reporter");
const xml2js = require("xml2js");
const JunitReport = require("./JunitReport");

class Reporter {

    /**
     * Generate multiple html cucumber report
     * @param capabilities
     */
    static generateHTMLReport(capabilities) {
        const os = require("os");

        report.generate({
            jsonDir: path.resolve('./test/'),
            reportPath: path.resolve('./test/'),
            metadata: {
                browser: {
                    name: capabilities.get('browserName'),
                    version: capabilities.get('version')
                },
                device: "PC",
                platform: {
                    name: os.platform() === "win32" ? "windows" : os.platform(),
                    version: os.release()
                }
            }
        });
    }

    /**
     * Generate junit xml report
     * @param pathToJson
     * @param pathToXml
     */
    static generateXMLReport(pathToJson, pathToXml) {
        const builder = new xml2js.Builder();
        const jsonReport = require(path.resolve(pathToJson));

        const xml =  builder.buildObject(new JunitReport(jsonReport).build());

        fs.writeFile(path.resolve(pathToXml), xml, (err) => {
            if (err) {
                throw err
            }
        })
    }

}

module.exports = Reporter;