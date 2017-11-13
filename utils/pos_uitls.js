nodejieba = require("nodejieba");
nodejieba.load({
  dict: '../utils/dict.big.txt',
  userDict: '../utils/userdict.utf8'
});

englishPos = require('pos');
englishTagger = new englishPos.Tagger();

chinese_pos_tagger = function (_text) {
    var _eng_stack = [];
    var _last_is_eng = false;
    
    if (typeof(_text.join) === "function") {
        _text = _text.join(" ");
    }
    _text = ellipsis_filter(_text);
    
    var _jieba_tag_result = nodejieba.tag(_text);
    var _output_result = [];
    
    
    for (var _i in _jieba_tag_result) {
        var _word = _jieba_tag_result[_i].word.trim();
        var _tag = _jieba_tag_result[_i].tag;
        
        
        var _next_word = null;
        var _next_id = (parseInt(_i)+1);
        if (_next_id < _jieba_tag_result.length) {
            _next_word = _jieba_tag_result[_next_id].word.trim();
        }
        if ((_word === "." || _word === "・") 
                && _next_word === _word ) {
            _tag = "eng";
        }
        
        if (_word === "") {
            continue;
        }
        else if (_tag === "eng") {
            _eng_stack.push(_word);
            _last_is_eng = true;
            continue;
        }
        else if (_tag !== "eng" && _last_is_eng === true) {
            // 處理英文的輸出結果
            //console.log(_eng_stack);
            var _english_tag_result = english_pos_tagger(_eng_stack);
            for (var _j in _english_tag_result) {
                _output_result.push(_english_tag_result[_j]);
            }
            _eng_stack = [];
            _last_is_eng = false;
        }
        
        _output_result.push({
            word: _word,
            tag: _tag
        });
    }
    
    if (_last_is_eng === true) {
        // 處理英文的輸出結果
        var _english_tag_result = english_pos_tagger(_eng_stack);
        for (var _j in _english_tag_result) {
            _output_result.push(_english_tag_result[_j]);
        }
    }
    
    return _output_result;
};

// ----------------------------------

english_pos_tagger = function (_text) {
    if (typeof(_text.join) === "function") {
        _text = _text.join(" ");
    }
    var _words = new englishPos.Lexer().lex(_text);
    var _tag_result = englishTagger.tag(_words);
    //console.log(_tag_result);
    var _output_result = [];
    
    for (var _i in _tag_result) {
        var taggedWord = _tag_result[_i];
        var _word = taggedWord[0];
        var _tag = taggedWord[1];
        
        _output_result.push({
            word: _word,
            tag: "eng-" + _tag
        });
    }
    return _output_result;
};

// -----------------------------------

unigrams_splitor = function (_text) {
    _text = ellipsis_filter(_text);
    
    var _english_stack = [];
    var _is_english_number = function (_val) {
        var english = /^[A-Za-z0-9\.\/_\:]*$/;
        return (english.test(_val));
    };
    var _last_is_english = false;
    
    var _output = [];
    for (var _i = 0; _i < _text.length; _i++) {
        var _word = _text.substr(_i, 1);
        if (_is_english_number(_word) === true) {
            _english_stack.push(_word);
            _last_is_english = true;
        }
        else {
            if (_last_is_english === true) {
                // 上一個是英文，這個字不是英文
                var _english_word = _english_stack.join("");
                _output.push(_english_word);
                _last_is_english = false;
                _english_stack = [];
            }
            
            if (_word.trim() !== "") {
                _output.push(_word);
            }
        }
    }
    if (_last_is_english === true) {
        // 上一個是英文，這個字不是英文
        var _english_word = _english_stack.join("");
        _output.push(_english_word);
    }
    
    return _output;
};

bigram_splitor = function (_text) {
    var _is_english_number = function (_val) {
        var english = /^[A-Za-z0-9\.\/_\:]*$/;
        return (english.test(_val));
    };
    
    var _unigrams = unigrams_splitor(_text);
    var _window_length = 2;
    
    var _output = [];
    for (var _i = 0; _i < _unigrams.length- (_window_length+1) ; _i++) {
        var _window_word = _unigrams[_i];
        for (var _j = 1; _j < _window_length; _j++) {
            var _window_i = _j+_i;
            var _next_word = _unigrams[_window_i];
            
            var _last_word = _window_word.substr(_window_word.length-1, 1);
            var _first_word = _next_word.substr(0,1);
            if (_is_english_number(_last_word) === true 
                    && _is_english_number(_first_word) === true) {
                _window_word = _window_word + " ";
            }
            _window_word = _window_word + _next_word;
        }
        _output.push(_window_word);
    }
    
    return _output;
};

ellipsis_filter = function (_text) {
    // 如果文章裡面有 .. 則一直取代為 …
    while (_text.indexOf("..") > -1) {
        _text = _text.split("..").join("…");
    }
    
    while (_text.indexOf("….") > -1) {
        _text = _text.split("….").join("…");
    }
    
    while (_text.indexOf("……") > -1) {
        _text = _text.split("……").join("…");
    }
    
    return _text;
};