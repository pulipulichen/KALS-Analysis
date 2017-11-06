convert_to_word_bag = function (_word_array) {
	var _output = {};
	
	for (var _i = 0; _i < _word_array.length; _i++) {
		var _word = _word_array[_i];
		if (typeof(_output[_word]) === "undefined") {
			_output[_word] = 0;
		}
		_output[_word]++;
	}
	
	return _output;
};