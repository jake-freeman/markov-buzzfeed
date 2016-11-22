var MarkovChain = require('markovchain')
  , fs = require('fs')
  , titles = new MarkovChain(fs.readFileSync('./titles.dat', 'utf8'))

generated_title = titles.end(15).start(process.argv[2] ? process.argv[2] : '').process();

console.log(generated_title)
