var MarkovChain = require('markovchain'),
    $           = require('jquery'),
    titles      = require('./titles.js');

console.log("Is this working!?");

$(document).ready(function() {
    var title_chain = new MarkovChain(titles);
    generated_title = title_chain.end(15).start('Trump').process();
    
    console.log(generated_title);

    $('.gen-title').text(generated_title);
});
