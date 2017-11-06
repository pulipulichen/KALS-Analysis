
// 不管怎樣，先連上資料庫吧
DATABASE_CONFIG = {
    host: "localhost",
    database: 'pc_pudding_2011_kals',
    username: 'kals',
    password: 'password'
};

RESET = true;
LIMIT = 1000000;

// -----------------------------
require("../utils/database.js");
require("../utils/jquery.js");
require("../utils/string_utils.js");
require("../utils/word_bag_utils.js");

// -------------------------------

var table_name = 'analysis_unigrams_text_20171106';
const table_object = sequelize_create_table(table_name, {
    annotation_id: "INTEGER",
    unigrams_text: "TEXT"
});

var wordbag_name = 'analysis_unigrams_wordbag_20171106';
const wordbag_object = sequelize_create_table(wordbag_name, {
    annotation_id: "INTEGER",
	word_id: "INTEGER",
	frequency: "INTEGER"
});

var word_pos_name = 'analysis_word_pos_20171106';
const word_pos_object = sequelize_create_table(word_pos_name, {
    word: "TEXT",
	pos: "TEXT"
});

var create_table = function (_callback) {
	table_object.sync({force: RESET}).then(function () {
		wordbag_object.sync({force: RESET}).then(function () {
			word_pos_object.sync({force: RESET}).then(function () {
				_callback();
			});
		});
	});
};

// -----------------------------

var select_note = function (_callback) {
	var select_query = "select annotation_id, note "
		+ " from annotation left join " + table_name + "s using (annotation_id)"
		+ " where unigrams_text IS NULL"
		+ " limit " + LIMIT;
        //console.log(select_query);
	sequelize.query(select_query).spread((results, metadata) => {
		for (var _i = 0; _i < results.length; _i++) {
			var _annotation_id = results[_i]['annotation_id'];
			var _note = results[_i]['note'];
			_callback(_annotation_id, _note);
		}
		//_callback(results);
	});
};



var convert_to_unigrams_text = function (_text) {
	var _output = [];
	if (_text === null || _text === undefined) {
		return _output;
	}
	
	var _prev_word = null;
	
	for (var _i = 0; _i < _text.length; _i++) {
		var _word = _text.substr(_i, 1);
		if (_word.trim() === "") {
			_output.push(_prev_word);
			_prev_word = null;
			continue;
		}
		
		if (_prev_word === null) {
			_prev_word = _word;
		}
		else if (is_english_number(_prev_word) && is_english_number(_word)) {
			_prev_word = _prev_word + _word;
		}
		else {
			_output.push(_prev_word);
			_prev_word = _word;
		}
	}
	_output.push(_prev_word);
	
	return _output;
};


var wordbag_insert = function(_annotation_id, _word_vector) {
	for (var _word in _word_vector) {
		var _freq = _word_vector[_word];
		console.log([_annotation_id, _word, _freq]);
		// 先查查看有沒有這個字
		word_pos_object
			.findOrCreate({where: {word: _word}, defaults: {word: _word}})
			.spread(function (_result, _create) {
				var _word_id = _result.id;
				
				wordbag_object.create({
					annotation_id: _annotation_id,
					word_id: _word_id,
					frequency: _freq
				});
				console.log([_annotation_id, _word_id, _freq]);
			});
	}
};

var unigrams_text_insert = function (annotation_id, note) {
	var _unigrams_text = note;
	//console.log(_unigrams_text);
	if (_unigrams_text !== null && 
		(_unigrams_text.trim() === ""  || _unigrams_text.trim() === "''" )  ) {
		_unigrams_text = null;
	}
	
	if (_unigrams_text !== null) {
		note = strip_tags(note);
		var _unigrams_text_array = convert_to_unigrams_text(note);
		_unigrams_text = _unigrams_text_array.join(" ");
		
		// -------------------
		var _word_vector = convert_to_word_bag(_unigrams_text_array);
		//console.log(_word_vector);
		wordbag_insert(annotation_id, _word_vector);
	}
	
	
	table_object.create({
		annotation_id: annotation_id,
		unigrams_text: _unigrams_text
	});
	
	// ------------------------------------
	
	var _abs = _unigrams_text;
	if (_abs === null) {
		_abs = "";
	}
	if (_abs.length > 50) {
		_abs = _abs.substr(0, 50) + "...";
	}
	console.log("Process " + annotation_id + ": " + _abs);
};

// -------------------

create_table(function () {
	select_note(function (annotation_id, note) {
		unigrams_text_insert(annotation_id, note);
	});
	
	console.log("finish");
});
