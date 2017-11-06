
// 不管怎樣，先連上資料庫吧
var DATABASE_CONFIG = {
    host: "localhost",
    database: 'pc_pudding_2011_kals',
    username: 'kals',
    password: 'password'
};

var _reset = false;
var _limit = 10000;

// -----------------------------

const Sequelize = require('sequelize');
const sequelize = new Sequelize(DATABASE_CONFIG['database']
    , DATABASE_CONFIG['username']
    , DATABASE_CONFIG['password'], {
  host: DATABASE_CONFIG['host'],
  dialect: 'postgres',
  logging: false
});

// jQuery
var $
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    $ = require("jquery")(window);
});

// -------------------------------

var table_name = 'analysis_unigrams_text_20171106';
const table_object = sequelize.define('analysis_unigrams_text_20171106', {
    annotation_id: { type: Sequelize.INTEGER },
    unigrams_text: { type: Sequelize.TEXT },
}, {
	timestamps: false,
});

var create_table = function (_callback) {
	table_object.sync({force: _reset}).then(function () {
		_callback();
	});
};

var select_note = function (_callback) {
	var select_query = "select annotation_id, note "
		+ " from annotation left join " + table_name + "s using (annotation_id)"
		+ " where unigrams_text IS NULL"
		+ " limit " + _limit;
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

var strip_tags = function (_text) {
	if (_text === null || _text === undefined) {
		return "";
	}
	return $('<div>' + _text + '</div>').text().trim();
};

var is_english_number = function (_val) {
	var english = /^[A-Za-z0-9\.]*$/;
	return (english.test(_val));
}

var convert_to_unigrams_text = function (_text) {
	var _output = [];
	if (_text === null || _text === undefined) {
		return _output;
	}
	
	var _prev_word = null;
	
	for (var _i = 0; _i < _text.length; _i++) {
		var _word = _text.substr(_i, 1);
		if (_word.trim() === "") {
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

// -------------------

create_table(function () {
	select_note(function (annotation_id, note) {
		var _unigrams_text = note;
		//console.log(_unigrams_text);
		if (_unigrams_text !== null && 
			(_unigrams_text.trim() === ""  || _unigrams_text.trim() === "''" )  ) {
			_unigrams_text = null;
		}
		
		if (_unigrams_text !== null) {
			note = strip_tags(note);
			var _unigrams_text = convert_to_unigrams_text(note);
			_unigrams_text = _unigrams_text.join(" ");
		}
		table_object.create({
			annotation_id: annotation_id,
			unigrams_text: _unigrams_text
		});
		
		
		var _abs = _unigrams_text;
		if (_abs === null) {
			_abs = "";
		}
		if (_abs.length > 50) {
			_abs = _abs.substr(0, 50) + "...";
		}
		console.log("Process " + annotation_id + ": " + _abs);
	});
	
	console.log("finish");
});