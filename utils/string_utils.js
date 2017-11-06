is_english_number = function (_val) {
	var english = /^[A-Za-z0-9\.\/_\:]*$/;
	return (english.test(_val));
};


strip_tags = function (_text) {
	if (_text === null || _text === undefined) {
		return "";
	}
	return $('<div>' + _text + '</div>').text().trim();
};
