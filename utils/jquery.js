// jQuery
if (typeof ($) !== "function") {
    $ = undefined;
    require("jsdom").env("", function(err, window) {
        if (err) {
            console.error(err);
            return;
        }

        $ = require("jquery")(window);
    });
}