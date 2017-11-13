nodejieba = require("nodejieba");
nodejieba.load({
  dict: 'dict.big.txt',
  userDict: 'userdict.utf8'
});

englishPos = require('pos');
englishTagger = new englishPos.Tagger();


var chinese_pos_tagger = function (_text) {
    var _eng_stack = [];
    var _last_is_eng = false;
    
    var _jieba_tag_result = nodejieba.tag(_text);
    var _output_result = [];
    
    
    for (var _i in _jieba_tag_result) {
        var _word = _jieba_tag_result[_i].word.trim();
        var _tag = _jieba_tag_result[_i].tag;
        
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
            var _english_tag_result = _english_pos_tagger(_eng_stack);
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
        _output_result.concat(_english_tag_result);
    }
    
    return _output_result;
};


var english_pos_tagger = function (_text) {
    if (typeof(_text.join) === "function") {
        _text = _text.join(" ");
    }
    var _words = new englishPos.Lexer().lex(_text);
    var _tag_result = englishTagger.tag(_words);
    //console.log(_tag_result);
    var _output_result = [];
    for (_i in _tag_result) {
        var taggedWord = _tag_result[_i];
        var _word = taggedWord[0];
        var _tag = taggedWord[1];
        _output_result.push({
            word: _word,
            tag: _tag
        });
    }
    return _output_result;
};