const superEasyDocs = require('super-easy-docs')

//replace PATH with the path to your markdown documentatin file
superEasyDocs('./docs.md', function(err, data){
  if(err) console.log(err)
  else console.log('success')
})