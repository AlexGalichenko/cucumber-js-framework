"use strict";

const TasksKiller = require("./TasksKiller");
const tasksKiller = new TasksKiller();
tasksKiller.kill({
    "chromedriver": "contains",
    "iedriverserver": "contains",
    // "chrome": "starts",
    // "firefox": "starts"
});