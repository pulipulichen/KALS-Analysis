
// 不管怎樣，先連上資料庫吧
DATABASE_CONFIG = {
    host: "localhost",
    database: 'pc_pudding_2011_kals',
    username: 'kals',
    password: 'password'
};

RESET = true;
//LIMIT = 1000000;
LIMIT = 10;

// -----------------------------
require("../utils/database.js");
require("../utils/jquery.js");
require("../utils/string_utils.js");
require("../utils/word_bag_utils.js");
require("../utils/pos_uitls.js");

// -------------------------------

var _table_objects = [];
/*
var table_name = 'analysis_unigrams_text_20171113';
const table_object = sequelize_create_table_object(table_name, {
    annotation_id: "INTEGER",
    unigrams_text: "TEXT"
});
_table_objects.push(table_object);
*/

var wordbag_name = 'analysis_unigrams_wordbag_20171113';
const wordbag_object = sequelize_cdreate_table_object(wordbag_name, {
    annotation_id: "INTEGER",
    word: "TEXT",
    tag: "TEXT",
    frequency: "INTEGER"
});
_table_objects.push(wordbag_object);

// -----------------------------

var select_note = function (_callback) {
    var select_query = "select annotation_id, note "
            + " from annotation"
            + " limit " + LIMIT;
    //console.log(select_query);
    sequelize.query(select_query).spread((results, metadata) => {
        var _annotation_results = [];
        
        for (var _i = 0; _i < results.length; _i++) {
            var _annotation_id = results[_i]['annotation_id'];
            var _note = results[_i]['note'];
            _note = strip_tags(_note);
            //_callback(_annotation_id, _note);
            
            _annotation_results.push({
                annotation_id: _annotation_id,
                note: _note
            });
        }
        //_callback(results);
        
        _callback(_annotation_results);
    });
};

var _unigrams_insert_database = function (_annotation_results) {
    for (var _i = 0; _i < _annotation_results.length; _i++) {
        var _annotation_id = _annotation_results[_i].annotation_id;
        var _note = _annotation_results[_i].note;
        var _unigrams_text = unigrams_splitor(_note);
        var _tag_result = chinese_pos_tagger(_unigrams_text);
        
        // --------------------
        
        var _wordbag = {};
        
        for (var _j = 0; _j < _tag_result.length; _j++) {
            var _word = _tag_result[_j].word;
            var _tag = _tag_result[_j].tag;
            
            if (typeof(_wordbag[_word]) === "undefined") {
                _wordbag[_word] = {
                    tag: _tag,
                    frequency: 0
                };
            }
            _wordbag[_word].frequency++;
        }
        
        // --------------------
        
        for (var _word in _wordbag) {
            var _tag = _wordbag[_word].tag;
            var _frequency = _wordbag[_word].frequency;
            wordbag_object.create({
                annotation_id: _annotation_id,
                word: _word,
                tag: _tag,
                frequency: _frequency
            });
        }
        
        console.log([_annotation_id, "ok"]);
    }
};

// -----------------------------
/*
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
        } else if (is_english_number(_prev_word) && is_english_number(_word)) {
            _prev_word = _prev_word + _word;
        } else {
            _output.push(_prev_word);
            _prev_word = _word;
        }
    }
    _output.push(_prev_word);

    return _output;
};

// -----------------------------

var _english_stack = [];

var wordbag_insert = function (_annotation_id, _word_vector) {
    for (var _word in _word_vector) {
        var _freq = _word_vector[_word];
        //console.log([_annotation_id, _word, _freq]);
        // 先查查看有沒有這個字
        var _defaults = {word: _word};
        if (_word.substr(0, 7) === "http://" || _word.substr(0, 8) === "https://") {
            _defaults["pos"] = "PULI-url";
        }
        else if (_word.substr(0, 2) === "p.") {
            _defaults["pos"] = "PULI-page_number";
        }
        
        word_pos_object
                .findOrCreate({where: {word: _word}, defaults: _defaults})
                .spread(function (_result, _create) {
                    var _word_id = _result.id;

                    wordbag_object.create({
                        annotation_id: _annotation_id,
                        word_id: _word_id,
                        frequency: _freq
                    });
                    //console.log([_annotation_id, _word_id, _freq]);
                });
    }
};

var unigrams_text_insert = function (annotation_id, note) {
    var _unigrams_text = note;
    //console.log(_unigrams_text);
    if (_unigrams_text !== null &&
            (_unigrams_text.trim() === "" || _unigrams_text.trim() === "''")) {
        _unigrams_text = null;
    }

    if (_unigrams_text !== null) {
        note = strip_tags(note);
        
        var _unigrams_text_array = convert_to_unigrams_text(note);
        _unigrams_text = _unigrams_text_array.join(" ");
        
        // ----------------------
        
        word_pos_insert(_unigrams_text, function () {
            // -------------------
            var _word_vector = convert_to_word_bag(_unigrams_text_array);
            //console.log(_word_vector);
            wordbag_insert(annotation_id, _word_vector);
        });
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

var _added_word = {};

var word_pos_insert = function (_text, _callback) {
    var _jieba_result = nodejieba.tag(_text);
    //console.log(_jieba_result);
    //for (var _i = 0; _i < _jieba_result.length; _i++) {
	var _next = function (_i) {
		_i++;
		setTimeout(function () {
			_loop(_i);
		},0);
	};
	
	var _last_is_english = false;
		
    var _loop = function (_i) {
        if (_i === _jieba_result.length) {
			if (_last_is_english === true) {
				_last_is_english = false;
				
				// 開始剖析其他的
				english_word_insert(_english_stack, function () {
					_english_stack = [];
					//_i--;
					//_next(_i);
					_callback();
				});
				//return;
			}
			else {
				_callback();
			}
            return;
        }
        
        var _word = _jieba_result[_i].word.trim();
        
        if (_word === "" 
                || typeof(_added_word[_word]) !== "undefined" 
                || _word === null ) {
            return _next(_i);
        }
        
        _added_word[_word] = true;
        
        var _pos = _jieba_result[_i].tag;
        //console.log([_word, _pos]);
		
		if (_pos === "eng") {
			_last_is_english = true;
			_english_stack.push(_word);
			return _next(_i);
		}
		else if (_last_is_english === true) {
			_last_is_english = false;
			
			// 開始剖析其他的
			english_word_insert(_english_stack, function () {
				_english_stack = [];
				_i--;
				_next(_i);
			});
			return;
		}
        
        if (_pos.trim() === "" || _pos === null) {
            console.log(["null pos", _word, _pos]);
        }
        
        word_pos_object
            .findOrCreate({where: {word: _word}
                , defaults: {word: _word, pos: _pos}})
            .spread(function () {
                return _next(_i);
            });
        
    };
    _loop(0);
};

english_word_insert = function (_english_text, _callback) {
	if (typeof(_english_text.join) === "function") {
		_english_text = _english_text.join(" ");
	}
	
	var words = new pos.Lexer().lex(_english_text);
	var tagger = new pos.Tagger();
	var taggedWords = tagger.tag(words);
	var _words_array = [];
	var _exists_word = {};
	
	for (i in taggedWords) {
		var taggedWord = taggedWords[i];
		var word = taggedWord[0];
		var tag = taggedWord[1];
		//console.log(word + " /" + tag);
		
		//_words_json[word] = tag;
		if (typeof(_exists_word[word]) === "boolean") {
			continue;
		}
		_exists_word[word] = true;
		_words_array.push(taggedWord);
	}
	
	var _next = function (_i) {
		_i++;
		if (_i === _words_array.length) {
			_callback();
			return;
		}
		else {
			_loop(_i);
		}
	};
	
	var _loop = function (_i) {
		var _word = _words_array[_i][0];
		var _pos = _words_array[_i][1];
		_pos = "eng-" + _pos;
		//console.log(["eng", _word, _pos]);
		word_pos_object
             .findOrCreate({where: {word: _word}
                , defaults: {word: _word, pos: _pos}})
            .spread(function () {
                return _next(_i);
            });
	};
	
	_loop(0);
};
*/

// -------------------

sequelize_create_tables(_table_objects, RESET, function () {
    select_note(function (_annotation_results) {
        _unigrams_insert_database(_annotation_results);
        console.log("finish");
    });
});
