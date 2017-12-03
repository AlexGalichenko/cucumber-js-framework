"use strict"

class ScreenshotManager {

    /**
     * Get sceenshot depending on scenario status
     * @param world - Cucumber context
     * @param status - status of cucumber scenarion
     */
    static takeScreenshot(world, status) {
        if (status === "failed") {
            return browser.takeScreenshot().then((screenShot) => {
                world.attach(screenShot, 'image/png');
            });
        }
    }

}

module.exports = ScreenshotManager;