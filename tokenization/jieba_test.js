// https://github.com/yanyiwu/nodejieba
require('../utils/pos_uitls.js');

//var _text = "人工智慧.....(AI)與深度學習(Deep learning)是當今非常熱門的議題！這些技術使用了多個隱藏層的神經網路(multi-hidden-layer neural networks)，又稱為深度學習模型(deep learning models)，電腦科學家已經用它們達成許多驚人的結果，像是分析圖片與演講語音等等。Deep learning";
var _text = "人工智慧.....(AI)與深度學習(Deep learning)是當今非常熱門的議題！Deep learning";
console.log(chinese_pos_tagger(_text));

//console.log(unigrams_splitor(_text));

//var _unigrams_text = unigrams_splitor(_text).join(" ");
//console.log(chinese_pos_tagger(_unigrams_text));


//console.log(bigram_splitor(_text));

//var result = nodejieba.cutForSearch("南京市长江大桥");
//console.log(result);
//["南京市","长江大桥"]

//console.log(nodejieba.tag("红掌拨清波"));
//[ { word: '红掌', tag: 'n' },
//  { word: '拨', tag: 'v' },
//  { word: '清波', tag: 'n' } ]

//console.log(nodejieba.tag("我來到北京清華大學"));
//console.log(nodejieba.tag("他來到了網易杭研大廈"));
//console.log(nodejieba.tag("小明碩士畢業於中國科學院計算所，後在日本東京大學深造"));
//console.log(nodejieba.cutForSearch("小明碩士畢業於 English best school 中國科學院計算所，後在日本東京大學深造"));
//console.log(nodejieba.tag("我來到北京清華大學"));

/*
console.log(nodejieba.cutForSearch("我來到北京清華大學"));
console.log(nodejieba.cutForSearch("他來到了網易杭研大廈"));
*/
/*
var result = nodejieba.cut("小明碩士畢業於 English best school 中國科學院計算所，後在日本東京大學深造");
for (var i in result) {
    result[i] = [result[i], JSON.stringify(nodejieba.tag(result[i]))];
}
console.log(result);
*/
/*
console.log(nodejieba.cutForSearch("小明碩士畢業於中國科學院計算所，後在日本東京大學深造"));

wrapWithDictLoad(nodejieba, "cutForSearch");
console.log(nodejieba.cut("小明碩士"));
*/
//wrapWithDictLoad(nodejieba, "cutForSearch");
//console.log(nodejieba.tag("小明碩士畢業於中國科學院計算所，後在日本東京大學深造"));

// ---------------------
/*
var RakutenMA = require('rakutenma');
// Initialize a RakutenMA instance
// with an empty model and the default ja feature set
var rma = new RakutenMA();
rma.featset = RakutenMA.default_featset_ja;

// Let's analyze a sample sentence (from http://tatoeba.org/jpn/sentences/show/103809)
// With a disastrous result, since the model is empty!
console.log(rma.tokenize("彼は新しいtest仕事12でき4.3っと成4. 3功するだろう。"));
*/
// ---------------------
/*
var pos = require('pos');
var words = new pos.Lexer().lex('This is some sample text. This text can contain multiple sentences.');
var tagger = new pos.Tagger();
var taggedWords = tagger.tag(words);
for (i in taggedWords) {
    var taggedWord = taggedWords[i];
    var word = taggedWord[0];
    var tag = taggedWord[1];
    console.log(word + " /" + tag);
}
*/

// extend the lexicon 
//tagger.extendLexicon({'Obama': ['NNP']});
//tagger.tag(['Mr', 'Obama']);