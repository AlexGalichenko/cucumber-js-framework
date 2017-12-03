"use strict";

class TasksKiller {

    constructor() {
        this.exec = require('child_process').exec;

        this.CMD_LIST = 'tasklist /V /FO CSV';
        this.CMD_KILL = 'taskkill /F';
        this.PID = 'PID';
        this.IMAGENAME = 'Image Name';

        this.processes = {};
        this.killedProcesses = {};
    }

    kill(processesToKill) {
            const self = this;

            function verify(imageName, query) {
                let queryResult;
                for (let element in query){
                    switch (query[element]){
                        case "starts":
                            queryResult = (imageName.indexOf(element)===0);
                            break;
                        case "contains":
                            queryResult = (imageName.indexOf(element)>=0);
                            break;
                        case "match":
                            queryResult = (imageName === element);
                            break;
                    }

                    if (queryResult) {
                        //console.log(queryResult + ": " + imageName + " " + query[element] + " " + element)
                        return true;
                    }
                }
                return false;
            }


            self.killedProcesses = {};
            self.exec(self.CMD_LIST, function(error, stdout, stderr) {
                self.processes = self.csvToProcesses(stdout);
                let pidList = "";
                for (let pid in self.processes) {
                    if (verify(self.processes[pid][self.IMAGENAME], processesToKill)){
                        pidList += " /pid " + pid;
                        console.log("Added to kill: " + self.processes[pid][self.IMAGENAME] + " with PID " + pid + " ")
                    }
                }

                if (pidList) {
                    self.exec(self.CMD_KILL + pidList, function(error, stdout, stderr) {
                        if (error) console.log(error);
                        console.log(stdout);
                        if (stderr) console.log(stderr);
                    });
                }
            });
    }

    csvToProcesses(csv) {
        const self = this;
        const rows = csv.split('\r\n');
        let data = [];

        // based on: http://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript
        // Return array of string values, or NULL if CSV string not well formed.
        function CSVtoArray(text) {
            const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
            const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
            // Return NULL if input string is not well formed CSV string.
            if (!re_valid.test(text)) return null;
            let a = [];                     // Initialize array to receive values.
            text.replace(re_value, // "Walk" the string using replace with callback.
                function (m0, m1, m2, m3) {
                    // Remove backslash from \' in single quoted values.
                    if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                    // Remove backslash from \" in double quoted values.
                    else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                    else if (m3 !== undefined) a.push(m3);
                    return ''; // Return empty string.
                });
            // Handle special case of empty last value.
            if (/,\s*$/.test(text)) a.push('');
            return a;
        }

        rows.forEach(function (row) {
            data.push(CSVtoArray(row));
        });

        const header = data.shift();

        let processes = {};
        data.forEach(function (row) {
            let process = {};
            for (let column = 0; column < row.length; column++) {
                process[header[column]] = row[column];
                if (header[column] === self.PID) processes[row[column]] = process;
            }
        });

        return processes;
    }

}

module.exports = TasksKiller;