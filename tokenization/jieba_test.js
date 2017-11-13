// https://github.com/yanyiwu/nodejieba
require('../utils/pos_uitls.js');

//var _text = "人工智慧.....(AI)與深度學習(Deep learning)是當今非常熱門的議題！這些技術使用了多個隱藏層的神經網路(multi-hidden-layer neural networks)，又稱為深度學習模型(deep learning models)，電腦科學家已經用它們達成許多驚人的結果，像是分析圖片與演講語音等等。Deep learning";
//var _text = "人工智慧.....(AI)與http://blog.pulipuli.info/深度http://blog.pulipuli.info學習(Deep learning)是當今非常熱門的議題！Deep learning";
var _text = '<p><object height="250" width="300"><param name="movie" value="http://www.youtube.com/v/-dwr9gBn458?fs=1&amp;hl=zh_TW" /><param name="allowFullScreen" value="true" /><param name="allowscriptaccess" value="always" /><embed allowfullscreen="true" allowscriptaccess="always" height="250" src="http://www.youtube.com/v/-dwr9gBn458?fs=1&amp;hl=zh_TW" type="application/x-shockwave-flash" width="300"></embed></object><a href="https://lh3.googleusercontent.com/-YXXGtLHxHhU/WgcQlcMaz-I/AAAAAAADjgQ/vNwuUsaq6mMZfSId15xT1IuZW0SI7PJ3ACHMYCw/s1600/image%255B52%255D" class="lightbox-group" data-lightbox="image0"><img alt="image" border="0" height="481" src="https://lh3.googleusercontent.com/-hJmMkBaFfUY/WgcQobGbIsI/AAAAAAADjgU/c_joU0QivZgOvdILpJs8Apnh9NyvP0LpQCHMYCw/image_thumb%255B17%255D?imgmax=800" style="display: inline; background-image: none;" title="image" width="913"></a></p><p><a href="http://wiki.pentaho.com/display/DATAMINING/M5P">M5P樹狀迴歸演算法</a>是<a href="http://blog.pulipuli.info/2017/06/weka-how-to-download-weka-and-install.html">Weka</a>內建的一種迴歸演算法。它可根據資料的分佈建立多種迴歸模型，依據輸入資料的不同來決定適用的迴歸模型。比起傳統的線性迴歸，M5P能夠準確預測非線性的資料，而且規則與迴歸模型容易解讀。相較於<a href="http://wiki.pentaho.com/display/DATAMINING/MultilayerPerceptron">類神經網路</a>和<a href="http://wiki.pentaho.com/display/DATAMINING/SMOreg">支持向量機</a>等黑箱演算法，白箱演算法的M5P更容易用於研究結果的解釋上。</p>';

//setTimeout(function () {
//    console.log(strip_tags(_text));
//}, 1000);
setTimeout(function () {
    _text = strip_tags(_text);
    console.log(_text);
    console.log(chinese_pos_tagger(_text));
}, 500);


//console.log(chinese_pos_tagger(_text));

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