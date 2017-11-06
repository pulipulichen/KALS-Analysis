var nodejieba = require("nodejieba");

// https://github.com/yanyiwu/nodejieba

var result = nodejieba.cut("南京市长江大桥");
console.log(result);
//["南京市","长江大桥"]

console.log(nodejieba.tag("红掌拨清波"));
//[ { word: '红掌', tag: 'n' },
//  { word: '拨', tag: 'v' },
//  { word: '清波', tag: 'n' } ]

var RakutenMA = require('rakutenma');
// Initialize a RakutenMA instance
// with an empty model and the default ja feature set
var rma = new RakutenMA();
rma.featset = RakutenMA.default_featset_ja;

// Let's analyze a sample sentence (from http://tatoeba.org/jpn/sentences/show/103809)
// With a disastrous result, since the model is empty!
console.log(rma.tokenize("彼は新しいtest仕事12でき4.3っと成4. 3功するだろう。"));

