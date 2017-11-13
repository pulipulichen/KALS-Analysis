require("../utils/jquery.js");

if (typeof(is_english_number) !== "function") {
    is_english_number = function (_val) {
        var english = /^[A-Za-z0-9\.\/_\:]*$/;
        return (english.test(_val));
    };
}

if (typeof(strip_tags) !== "function") {
    strip_tags = function (_text) {
        if (_text === null || _text === undefined) {
            return "";
        }
        var _html_object = $('<div>' + _text + '</div>');

        // 只處理img的部分
        _html_object.find("img").each(function (_i, _img) {
            _img = _html_object.find("img:eq(" + _i + ")");

            if (typeof (_img.attr("src")) === "string") {
                _img.after('<span> ' + _img.attr('src') + ' </span>');
            }
            if (typeof (_img.attr("alt")) === "string") {
                _img.after('<span> ' + _img.attr('alt') + ' </span>');
            }
            if (typeof (_img.attr("title")) === "string") {
                _img.after('<span> ' + _img.attr('title') + ' </span>');
            }
        });
        
        _html_object.find('param[name="movie"]').each(function (_i, _param) {
            _param = _html_object.find('param[name="movie"]:eq(' + _i + ')');

            if (typeof (_param.attr("value")) === "string") {
                _param.after('<span> ' + _param.attr('value') + ' </span>');
            }
        });

        return _html_object.text().trim();
    };
}

if (typeof(is_valid_url) !== "function") {
    is_valid_url = function (str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    };
}